from decimal import Decimal
from django.conf import settings
from shop.models import Product

class Cart:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get('cart')
        if not cart:
            # Initialize an empty cart in session
            cart = self.session['cart'] = {}
        self.cart = cart
        
        # Load coupon code and discount from session
        self.coupon_code = self.session.get('coupon_code', None)
        self.coupon_discount = Decimal(self.session.get('coupon_discount', '0.00'))

    def add(self, product, quantity=1, override_quantity=False):
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                'quantity': 0,
                'price': str(product.price)
            }
        
        if override_quantity:
            self.cart[product_id]['quantity'] = int(quantity)
        else:
            self.cart[product_id]['quantity'] += int(quantity)
            
        self.save()

    def remove(self, product):
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self.save()

    def __iter__(self):
        product_ids = self.cart.keys()
        products = Product.objects.filter(id__in=product_ids)
        cart = self.cart.copy()
        
        for product in products:
            cart[str(product.id)]['product'] = product

        for item in cart.values():
            if 'product' in item:
                item['price'] = Decimal(item['price'])
                item['total_price'] = item['price'] * item['quantity']
                yield item

    def __len__(self):
        return sum(item['quantity'] for item in self.cart.values())

    def get_subtotal(self):
        return sum(Decimal(item['price']) * item['quantity'] for item in self.cart.values())

    def get_discount(self):
        if self.coupon_discount > 0:
            return round(self.get_subtotal() * self.coupon_discount, 2)
        return Decimal('0.00')

    def get_shipping(self):
        subtotal = self.get_subtotal()
        if subtotal == 0 or subtotal >= 500:
            return Decimal('0.00')
        return Decimal('50.00')

    def get_free_shipping_remaining(self):
        subtotal = self.get_subtotal()
        if subtotal >= 500:
            return Decimal('0.00')
        return Decimal('500.00') - subtotal

    def get_total(self):
        return self.get_subtotal() - self.get_discount() + self.get_shipping()

    def apply_coupon(self, code, discount_decimal):
        self.coupon_code = code
        self.coupon_discount = Decimal(str(discount_decimal))
        self.session['coupon_code'] = code
        self.session['coupon_discount'] = str(discount_decimal)
        self.session.modified = True

    def remove_coupon(self):
        self.coupon_code = None
        self.coupon_discount = Decimal('0.00')
        if 'coupon_code' in self.session:
            del self.session['coupon_code']
        if 'coupon_discount' in self.session:
            del self.session['coupon_discount']
        self.session.modified = True

    def clear(self):
        if 'cart' in self.session:
            del self.session['cart']
        self.remove_coupon()
        self.save()

    def save(self):
        self.session.modified = True
