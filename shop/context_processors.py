from shop.cart import Cart
from shop.models import Category, Brand

def cart_processor(request):
    """
    Exposes the Cart object and category database queries to all template rendering engines.
    """
    return {
        'cart': Cart(request),
        'header_categories': Category.objects.all(),
        'header_brands': Brand.objects.all(),
    }
