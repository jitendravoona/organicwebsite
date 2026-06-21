from django.db import models
from django.urls import reverse

class Category(models.Model):
    name = models.Field # Wait, CharField! Let's write standard fields.
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)
    image = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Brand(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, related_name='products', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    oldPrice = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    badge = models.CharField(max_length=50, null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    reviews = models.IntegerField(default=0)
    image = models.CharField(max_length=255)
    description = models.TextField()
    specs = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('shop:product_detail', args=[self.id, self.slug])

    @property
    def discount_percent(self):
        if self.oldPrice and self.oldPrice > self.price:
            return round(((self.oldPrice - self.price) / self.oldPrice) * 100)
        return 0


class Order(models.Model):
    STATUS_CHOICES = (
        ('placed', 'Order Placed'),
        ('processing', 'Under Processing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Successfully Delivered'),
    )

    invoice_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    payment_mode = models.CharField(max_length=50, default='COD')
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='placed')

    def __str__(self):
        return f"Order {self.invoice_id} by {self.name}"

    def get_items(self):
        return self.items.all()


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"OrderItem {self.id} for Order {self.order.invoice_id}"

    @property
    def total_price(self):
        return self.price * self.quantity
