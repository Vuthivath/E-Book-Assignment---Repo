from django.urls import path
from .views import (
    RegisterView, LoginView,
    BookListAPIView, BookCreateAPIView, BookDetailAPIView, BookPurchasedCheckView,
    UserLibraryView,
    CategoryListAPIView,
    CartView, CartItemDetailView, CartClearView,
    BookmarkView,
    CheckoutView,
    OrderListView, OrderDetailView, OrderStatusUpdateView,
)
from . import views

urlpatterns = [
    # Auth
    path('register/',               RegisterView.as_view(),            name='register'),
    path('login/',                  LoginView.as_view(),               name='login'),

    # Books
    path('books/',                  BookListAPIView.as_view(),         name='book-list'),
    path('books/create/',           BookCreateAPIView.as_view(),       name='book-create'),
    path('books/<int:pk>/',         BookDetailAPIView.as_view(),       name='book-detail'),  # GET, PUT, DELETE
    path('books/<int:pk>/purchased/', BookPurchasedCheckView.as_view(), name='book-purchased'),
    path('purchased/',                UserLibraryView.as_view(),         name='user-library'),

    # Categories
    path('categories/',             CategoryListAPIView.as_view(),     name='category-list'),

    # Cart
    path('cart/',                   CartView.as_view(),                name='cart'),
    path('cart/clear/',             CartClearView.as_view(),           name='cart-clear'),
    path('cart/<int:pk>/',          CartItemDetailView.as_view(),      name='cart-item'),

    # Bookmarks
    path('bookmarks/',              BookmarkView.as_view(),            name='bookmarks'),

    # Orders
    path('checkout/',               CheckoutView.as_view(),            name='checkout'),
    path('orders/',                 OrderListView.as_view(),           name='order-list'),
    path('orders/<int:pk>/',        OrderDetailView.as_view(),         name='order-detail'),
    path('orders/<int:pk>/status/', OrderStatusUpdateView.as_view(),   name='order-status'),

    # ── Admin Dashboard ──
    path('admin/login/',            views.admin_login_view,            name='admin_login'),
    path('admin/logout/',           views.admin_logout_view,           name='admin_logout'),
    path('admin/',                  views.admin_dashboard,             name='admin_dashboard'),
    path('admin/books/',            views.admin_books_all,             name='admin_books_all'),
    path('admin/books/popular/',    views.admin_books_popular,         name='admin_books_popular'),
    path('admin/books/new/',        views.admin_books_new,             name='admin_books_new'),
    path('admin/books/add/',        views.admin_book_add,              name='admin_book_add'),
    path('admin/books/<int:pk>/edit/',  views.admin_book_edit,        name='admin_book_edit'),
    path('admin/books/<int:pk>/delete/', views.admin_book_delete,     name='admin_book_delete'),
    path('admin/books/<int:pk>/toggle/<str:flag>/', views.admin_book_toggle_flag, name='admin_book_toggle_flag'),
    path('admin/orders/',           views.admin_orders,                name='admin_orders'),
    path('admin/users/',            views.admin_users,                 name='admin_users'),
    path('admin/users/<int:pk>/delete/', views.admin_user_delete,      name='admin_user_delete'),
    path('admin/messages/',         views.admin_messages,              name='admin_messages'),

    # ── Admin: Genre Management ──
    path('admin/genres/',           views.admin_genre_list,            name='admin_genre_list'),
    path('admin/genres/add/',       views.admin_genre_add,             name='admin_genre_add'),
    path('admin/genres/<int:pk>/edit/',   views.admin_genre_edit,      name='admin_genre_edit'),
    path('admin/genres/<int:pk>/delete/', views.admin_genre_delete,    name='admin_genre_delete'),
]
