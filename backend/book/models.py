from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')

    def __str__(self):
        return self.username

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    price = models.FloatField()
    stock = models.PositiveIntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='books')
    image = models.ImageField(upload_to='books/', blank=True, null=True)
    description = models.TextField(blank=True, help_text='Book description / synopsis')
    read_count = models.PositiveIntegerField(default=0, help_text='Number of times this book has been read')
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    is_most_read = models.BooleanField(default=False, help_text='Mark as "Most Read This Week"')
    is_new_release = models.BooleanField(default=False, help_text='Mark as "New Release"')
    published = models.CharField(max_length=50, blank=True, help_text='Year or date published')
    publisher = models.CharField(max_length=200, blank=True, help_text='Publisher name')
    language = models.CharField(max_length=100, blank=True, default='English')
    pages = models.PositiveIntegerField(null=True, blank=True, help_text='Number of pages')
    isbn = models.CharField(max_length=50, blank=True, help_text='ISBN number')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class CartItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='cart_items'
    )
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.book.title}'

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.username} bookmarked {self.book.title}'

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)
    total_price = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f'Order #{self.id} by {self.user.username}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price = models.FloatField()

    def __str__(self):
        return f'{self.quantity} x {self.book.title}'

class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.subject}'
