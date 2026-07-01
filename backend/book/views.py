from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdminRole
from rest_framework import status, generics
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Book, Category, CartItem, Order, OrderItem, ContactMessage, Bookmark
from .serializers import (
    BookSerializer, CategorySerializer, CartItemSerializer,
    OrderSerializer, OrderItemSerializer, BookmarkSerializer,
    RegisterSerializer, LoginSerializer
)

User = get_user_model()


# ── Pagination ─────────────────────────────────────────────────────────────────

class BookPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# ── Purchase check ─────────────────────────────────────────────────────────────

class BookPurchasedCheckView(APIView):
    """
    GET /api/books/<pk>/purchased/
    Returns {'purchased': true/false} for the current user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        purchased = OrderItem.objects.filter(
            order__user=request.user,
            book_id=pk,
        ).exclude(order__status='cancelled').exists()
        return Response({'purchased': purchased})


class UserLibraryView(APIView):
    """
    GET /api/purchased/
    Returns all books the current user has purchased (non-cancelled orders).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get all book IDs the user has purchased
        purchased_book_ids = OrderItem.objects.filter(
            order__user=request.user,
        ).exclude(
            order__status='cancelled'
        ).values_list('book_id', flat=True).distinct()

        books = Book.objects.filter(id__in=purchased_book_ids)
        serializer = BookSerializer(books, many=True, context={'request': request})
        return Response(serializer.data)


# ── Auth ───────────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        username_or_email = serializer.validated_data['username']
        password = serializer.validated_data['password']

        # Try to find user by email first, then by username
        user = None
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user is None:
            user = authenticate(username=username_or_email, password=password)

        if user is None:
            return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

        # ── Track last login ──
        from django.utils import timezone
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'access':  str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id':         user.id,
                'username':   user.username,
                'email':      user.email,
                'role':       user.role,
                'first_name': user.first_name,
                'last_name':  user.last_name,
                'date_joined': user.date_joined.isoformat() if user.date_joined else None,
            }
        }, status=status.HTTP_200_OK)


# ── Books ──────────────────────────────────────────────────────────────────────

class BookListAPIView(generics.ListAPIView):
    """
    GET  /api/books/          → anyone can browse
    GET  /api/books/?most_read=true  → filter most read
    GET  /api/books/?new_release=true → filter new releases
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]
    pagination_class = BookPagination

    def get_queryset(self):
        queryset = Book.objects.all()
        category = self.request.query_params.get('category')
        search   = self.request.query_params.get('search')
        most_read = self.request.query_params.get('most_read')
        new_release = self.request.query_params.get('new_release')
        if category:
            queryset = queryset.filter(category__id=category)
        if search:
            queryset = queryset.filter(title__icontains=search)
        if most_read:
            queryset = queryset.filter(is_most_read=True)
        if new_release:
            queryset = queryset.filter(is_new_release=True)
        return queryset


class BookCreateAPIView(APIView):
    """
    POST /api/books/create/   → admin only
    """
    permission_classes = [IsAdminRole]

    def post(self, request):
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookDetailAPIView(APIView):
    """
    GET   /api/books/<pk>/    → anyone
    PUT   /api/books/<pk>/    → admin only
    DELETE /api/books/<pk>/   → admin only
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminRole()]

    def get(self, request, pk):
        try:
            book = Book.objects.get(id=pk)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = BookSerializer(book)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            book = Book.objects.get(id=pk)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            book = Book.objects.get(id=pk)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)  # 204 — no body on delete


# ── Categories ─────────────────────────────────────────────────────────────────

class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# ── Cart ───────────────────────────────────────────────────────────────────────

class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        book_id  = request.data.get('book')
        quantity = int(request.data.get('quantity', 1))

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Check if already purchased
        already_owned = OrderItem.objects.filter(
            order__user=request.user,
            book_id=book_id
        ).exclude(order__status='cancelled').exists()

        if already_owned:
            return Response({'error': 'You already own this book.'}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(user=request.user, book=book)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        return Response({
            'message': f'"{book.title}" added to cart!',
            'quantity': cart_item.quantity,
        }, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            item = CartItem.objects.get(id=pk, user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_quantity = int(request.data.get('quantity', item.quantity))
        item.quantity = new_quantity
        item.save()
        return Response({'message': 'Quantity updated.'}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            item = CartItem.objects.get(id=pk, user=request.user)
            item.delete()
            return Response({'message': 'Item removed.'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=status.HTTP_404_NOT_FOUND)


class CartClearView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        CartItem.objects.filter(user=request.user).delete()
        return Response({'message': 'Cart cleared.'}, status=status.HTTP_200_OK)


# ── Bookmarks ──────────────────────────────────────────────────────────────────

class BookmarkView(APIView):
    """
    GET  /api/bookmarks/      → list current user's bookmarks
    POST /api/bookmarks/      → create a bookmark (send {book: <id>})
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        bookmarks = Bookmark.objects.filter(user=request.user).select_related('book__category')
        serializer = BookmarkSerializer(bookmarks, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        book_id = request.data.get('book')
        if not book_id:
            return Response({'error': 'book is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)

        _, created = Bookmark.objects.get_or_create(user=request.user, book=book)
        if not created:
            return Response({'message': 'Already bookmarked.'}, status=status.HTTP_200_OK)

        return Response({'message': f'"{book.title}" bookmarked!'}, status=status.HTTP_201_CREATED)

    def delete(self, request):
        """Delete a bookmark — send {book: <id>}"""
        book_id = request.data.get('book')
        if not book_id:
            # Support query param: ?book=<id>
            book_id = request.query_params.get('book')

        if not book_id:
            return Response({'error': 'book is required.'}, status=status.HTTP_400_BAD_REQUEST)

        deleted, _ = Bookmark.objects.filter(user=request.user, book__id=book_id).delete()
        if deleted:
            return Response({'message': 'Bookmark removed.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Bookmark not found.'}, status=status.HTTP_404_NOT_FOUND)


# ── Orders ─────────────────────────────────────────────────────────────────────

class CheckoutView(APIView):
    """
    POST /api/checkout/   → place an order from current cart
    """
    permission_classes = [IsAuthenticated]

    TAX_RATE = 0.234

    def post(self, request):
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({'error': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        subtotal = sum(item.book.price * item.quantity for item in cart_items)
        tax = round(subtotal * self.TAX_RATE, 2)
        total_price = round(subtotal + tax, 2)
        order = Order.objects.create(
            user=request.user,
            total_price=total_price,
            status='pending'
        )
        OrderItem.objects.bulk_create([
            OrderItem(order=order, book=item.book, quantity=item.quantity, price=item.book.price)
            for item in cart_items
        ])
        cart_items.delete()

        return Response({
            'message':  'Order placed successfully!',
            'order_id': order.id
        }, status=status.HTTP_201_CREATED)


class OrderListView(APIView):
    """
    GET /api/orders/
    - customer → sees only their own orders
    - admin    → sees all orders (pass ?all=true)
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'admin' and request.query_params.get('all'):
            orders = Order.objects.all().order_by('-created_at')
        else:
            orders = Order.objects.filter(user=request.user).order_by('-created_at')

        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class OrderDetailView(APIView):
    """
    GET   /api/orders/<pk>/          → fetch a single order with its items
    PATCH /api/orders/<pk>/status/   → admin updates order status
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            # customers can only see their own orders
            if request.user.role == 'admin':
                order = Order.objects.get(id=pk)
            else:
                order = Order.objects.get(id=pk, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderSerializer(order)
        return Response(serializer.data)


class OrderStatusUpdateView(APIView):
    """
    PATCH /api/orders/<pk>/status/
    Admin only — update order status (pending → confirmed → cancelled)
    """
    permission_classes = [IsAdminRole]

    VALID_STATUSES = ['pending', 'confirmed', 'cancelled']

    def patch(self, request, pk):
        try:
            order = Order.objects.get(id=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in self.VALID_STATUSES:
            return Response(
                {'error': f'Invalid status. Choose from: {", ".join(self.VALID_STATUSES)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()
        return Response({'message': f'Order #{order.id} marked as {new_status}.'}, status=status.HTTP_200_OK)


# ═══════════════════════════════════════════════════════════════
#  ADMIN DASHBOARD — Django-templated views
# ═══════════════════════════════════════════════════════════════

from django.contrib.auth import login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages as django_messages
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from django.utils import timezone

def is_admin_user(user):
    return user.is_authenticated and (user.role == 'admin' or user.is_superuser)

def admin_login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and (user.role == 'admin' or user.is_superuser):
            auth_login(request, user)
            return redirect('admin_dashboard')
        else:
            return render(request, 'Admin.html', {'error': 'Invalid credentials or not an admin.'})
    return render(request, 'Admin.html')

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_dashboard(request):
    books = Book.objects.all()
    total_revenue = Order.objects.aggregate(total=Sum('total_price'))['total'] or 0
    total_users = User.objects.count()
    total_books = Book.objects.count()
    total_categories = Category.objects.count()
    new_users_this_month = User.objects.filter(
        date_joined__gte=timezone.now() - timedelta(days=30)
    ).count()
    revenue_growth = 12  # simplified
    pending_orders_count = Order.objects.filter(status='pending').count()
    unread_messages_count = ContactMessage.objects.filter(is_read=False).count()
    most_read_books = Book.objects.order_by('-read_count')[:5]

    return render(request, 'Admin.html', {
        'active_section': 'dashboard',
        'books': books,
        'total_revenue': total_revenue,
        'total_users': total_users,
        'total_books': total_books,
        'total_categories': total_categories,
        'new_users_this_month': new_users_this_month,
        'revenue_growth': revenue_growth,
        'pending_orders_count': pending_orders_count,
        'unread_messages_count': unread_messages_count,
        'most_read_books': most_read_books,
    })

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_books_all(request):
    books = Book.objects.all()
    return render(request, 'Admin.html', {
        'active_section': 'books_all',
        'books': books,
        'most_read_books': [],
        'hide_stats': True,
        'hide_most_read': True,
    })

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_books_popular(request):
    most_read_books = Book.objects.filter(read_count__gt=0).order_by('-read_count')
    return render(request, 'Admin.html', {
        'active_section': 'books_popular',
        'books': [],
        'most_read_books': most_read_books,
        'hide_stats': True,
        'hide_books_table': True,
    })

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_books_new(request):
    books = Book.objects.order_by('-created_at')
    return render(request, 'Admin.html', {
        'active_section': 'books_new',
        'books': books,
        'most_read_books': [],
        'hide_stats': True,
        'hide_most_read': True,
    })

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_orders(request):
    if request.method == 'POST':
        order_id = request.POST.get('order_id')
        new_status = request.POST.get('new_status')
        if order_id and new_status:
            Order.objects.filter(id=order_id).update(status=new_status)
        return redirect('admin_orders')
    orders_list = Order.objects.all().order_by('-order_date')
    pending_orders_count = Order.objects.filter(status='pending').count()
    return render(request, 'Admin.html', {
        'active_section': 'orders',
        'orders': orders_list,
        'pending_orders_count': pending_orders_count,
    })

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_messages(request):
    msgs = ContactMessage.objects.all()
    unread_messages_count = ContactMessage.objects.filter(is_read=False).count()
    return render(request, 'Admin.html', {
        'active_section': 'messages',
        'contact_messages': msgs,
        'unread_messages_count': unread_messages_count,
    })

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_users(request):
    # Support ?logged_in=true to show only users who have ever logged in
    filter_type = request.GET.get('filter', 'all')
    if filter_type == 'logged_in':
        users = User.objects.exclude(last_login__isnull=True).order_by('-last_login')
    else:
        users = User.objects.all().order_by('-date_joined')

    total_users = User.objects.count()
    logged_in_users = User.objects.exclude(last_login__isnull=True).count()
    new_users_this_month = User.objects.filter(
        date_joined__gte=timezone.now() - timedelta(days=30)
    ).count()
    return render(request, 'Admin.html', {
        'active_section': 'users',
        'users': users,
        'total_users': total_users,
        'logged_in_users': logged_in_users,
        'new_users_this_month': new_users_this_month,
        'filter_type': filter_type,
    })

from django import forms

class BookAdminForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author', 'price', 'description', 'category', 'image', 'published', 'publisher', 'language', 'pages', 'isbn']
        labels = {
            'category': 'Genre',
            'description': 'Description',
            'published': 'Published',
            'publisher': 'Publisher',
            'language': 'Language',
            'pages': 'Pages',
            'isbn': 'ISBN',
        }
        widgets = {
            'category': forms.Select(attrs={'style': 'padding: 10px 14px;'}),
            'description': forms.Textarea(attrs={'style': 'padding: 10px 14px;', 'rows': 5, 'placeholder': 'Enter book description/synopsis...'}),
            'published': forms.TextInput(attrs={'style': 'padding: 10px 14px;', 'placeholder': 'e.g. 2024'}),
            'publisher': forms.TextInput(attrs={'style': 'padding: 10px 14px;', 'placeholder': 'Publisher name'}),
            'language': forms.TextInput(attrs={'style': 'padding: 10px 14px;', 'placeholder': 'e.g. English'}),
            'pages': forms.NumberInput(attrs={'style': 'padding: 10px 14px;', 'placeholder': 'Number of pages'}),
            'isbn': forms.TextInput(attrs={'style': 'padding: 10px 14px;', 'placeholder': 'ISBN number'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['category'].required = False
        self.fields['image'].required = False
        self.fields['description'].required = False
        self.fields['published'].required = False
        self.fields['publisher'].required = False
        self.fields['language'].required = False
        self.fields['pages'].required = False
        self.fields['isbn'].required = False

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_book_add(request):
    if request.method == 'POST':
        form = BookAdminForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            django_messages.success(request, 'Book added successfully.')
            return redirect('admin_dashboard')
    else:
        form = BookAdminForm()
    return render(request, 'admin_book_form.html', {'form': form})

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_book_edit(request, pk):
    book = get_object_or_404(Book, id=pk)
    if request.method == 'POST':
        form = BookAdminForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            form.save()
            django_messages.success(request, 'Book updated successfully.')
            return redirect('admin_dashboard')
    else:
        form = BookAdminForm(instance=book)
    return render(request, 'admin_book_form.html', {'form': form, 'book': book})


@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_book_toggle_flag(request, pk, flag):
    """
    POST /admin/books/<pk>/toggle/<flag>/
    Toggle is_most_read or is_new_release on a book.
    """
    book = get_object_or_404(Book, id=pk)
    if flag == 'most_read':
        book.is_most_read = not book.is_most_read
        label = 'Most Read'
    elif flag == 'new_release':
        book.is_new_release = not book.is_new_release
        label = 'New Release'
    else:
        django_messages.error(request, 'Invalid flag.')
        return redirect(request.META.get('HTTP_REFERER', 'admin_dashboard'))
    book.save()
    status_text = 'added to' if (
        (flag == 'most_read' and book.is_most_read) or
        (flag == 'new_release' and book.is_new_release)
    ) else 'removed from'
    django_messages.success(request, f'"{book.title}" {status_text} {label}.')
    return redirect(request.META.get('HTTP_REFERER', 'admin_dashboard'))

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_book_delete(request, pk):
    book = get_object_or_404(Book, id=pk)
    if request.method == 'POST':
        book.delete()
        django_messages.success(request, 'Book deleted.')
        return redirect('admin_dashboard')
    return render(request, 'admin_book_confirm_delete.html', {'book': book})

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_user_delete(request, pk):
    if request.method == 'POST':
        try:
            user = get_object_or_404(User, id=pk)
            # Don't allow deleting yourself
            if user.id == request.user.id:
                django_messages.error(request, 'You cannot delete your own account.')
                return redirect('admin_users')
            user.delete()
            django_messages.success(request, 'User deleted.')
        except:
            django_messages.error(request, 'User not found.')
        return redirect('admin_users')
    return redirect('admin_users')

@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_logout_view(request):
    auth_logout(request)
    return redirect('admin_login')


# ── Admin: Genre (Category) Management ─────────────────────────────────────────

class GenreAdminForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description']
        labels = {
            'name': 'Genre Name',
            'description': 'Description (optional)',
        }
        widgets = {
            'name': forms.TextInput(attrs={'style': 'padding: 10px 14px;'}),
            'description': forms.Textarea(attrs={'style': 'padding: 10px 14px;', 'rows': 3}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['description'].required = False


@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_genre_list(request):
    genres = Category.objects.annotate(book_count=Count('books')).order_by('name')
    return render(request, 'Admin.html', {
        'active_section': 'genres',
        'genres': genres,
        'hide_stats': True,
        'hide_books_table': True,
        'hide_most_read': True,
    })


@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_genre_add(request):
    if request.method == 'POST':
        form = GenreAdminForm(request.POST)
        if form.is_valid():
            form.save()
            django_messages.success(request, 'Genre added successfully.')
            return redirect('admin_genre_list')
    else:
        form = GenreAdminForm()
    return render(request, 'admin_genre_form.html', {'form': form})


@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_genre_edit(request, pk):
    genre = get_object_or_404(Category, id=pk)
    if request.method == 'POST':
        form = GenreAdminForm(request.POST, instance=genre)
        if form.is_valid():
            form.save()
            django_messages.success(request, 'Genre updated successfully.')
            return redirect('admin_genre_list')
    else:
        form = GenreAdminForm(instance=genre)
    return render(request, 'admin_genre_form.html', {'form': form, 'genre': genre})


@login_required(login_url='admin_login')
@user_passes_test(is_admin_user, login_url='admin_login')
def admin_genre_delete(request, pk):
    genre = get_object_or_404(Category, id=pk)
    if request.method == 'POST':
        # Check if genre has books
        if genre.books.exists():
            django_messages.error(request, f'Cannot delete "{genre.name}" — it has {genre.books.count()} book(s) assigned.')
            return redirect('admin_genre_list')
        genre.delete()
        django_messages.success(request, 'Genre deleted.')
        return redirect('admin_genre_list')
    return render(request, 'admin_genre_confirm_delete.html', {'genre': genre})
