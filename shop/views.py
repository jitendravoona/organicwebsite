import json
import random
import string
from decimal import Decimal
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .models import Category, Brand, Product, Order, OrderItem
from .cart import Cart

# ==========================================
# PAGE VIEWS
# ==========================================

def home_view(request):
    featured_products = Product.objects.all()[:8]
    categories = Category.objects.all()
    
    # Filter products for homepage tabs
    oils_category = Category.objects.filter(slug='cold-pressed-oils').first()
    oils_products = Product.objects.filter(category=oils_category)[:8] if oils_category else []
    
    spices_category = Category.objects.filter(slug='spices').first()
    spices_products = Product.objects.filter(category=spices_category)[:8] if spices_category else []
    
    millets_category = Category.objects.filter(slug='millets').first()
    millets_products = Product.objects.filter(category=millets_category)[:8] if millets_category else []

    context = {
        'featured_products': featured_products,
        'categories': categories,
        'oils_products': oils_products,
        'spices_products': spices_products,
        'millets_products': millets_products,
    }
    return render(request, 'shop/home.html', context)


def shop_view(request):
    products = Product.objects.all()
    categories = Category.objects.all()
    brands = Brand.objects.all()

    # Filters
    selected_category = request.GET.get('category', '')
    selected_brand = request.GET.get('brand', '')
    search_query = request.GET.get('search', '')
    sort_by = request.GET.get('sort', 'default')

    if selected_category:
        products = products.filter(category__slug=selected_category)
    
    if selected_brand:
        products = products.filter(brand__slug=selected_brand)
        
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query) | 
            Q(category__name__icontains=search_query)
        )

    # Sorting
    if sort_by == 'price-low':
        products = products.order_by('price')
    elif sort_by == 'price-high':
        products = products.order_by('-price')
    elif sort_by == 'rating':
        products = products.order_by('-rating')

    context = {
        'products': products,
        'categories': categories,
        'brands': brands,
        'selected_category': selected_category,
        'selected_brand': selected_brand,
        'search_query': search_query,
        'sort_by': sort_by,
    }
    return render(request, 'shop/product_list.html', context)


def detail_view(request, pk, slug):
    product = get_object_or_404(Product, id=pk)
    related_products = Product.objects.filter(category=product.category).exclude(id=product.id)[:4]
    
    context = {
        'product': product,
        'related_products': related_products,
    }
    return render(request, 'shop/product_detail.html', context)


def cart_view(request):
    return render(request, 'shop/cart.html')


def checkout_view(request):
    cart = Cart(request)
    if len(cart) == 0:
        return redirect('shop:shop')

    if request.method == 'POST':
        name = request.POST.get('name', '').strip()
        email = request.POST.get('email', '').strip()
        phone = request.POST.get('phone', '').strip()
        address = request.POST.get('address', '').strip()
        city = request.POST.get('city', '').strip()
        pincode = request.POST.get('pincode', '').strip()
        payment_mode = request.POST.get('payment_method', 'COD').upper()

        if name and email and phone and address and city and pincode:
            # Generate Unique Invoice ID: VO-XXXXXXXX (8 random capital letters/digits)
            random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            invoice_id = f"VO-{random_str}"

            # Create the Order
            order = Order.objects.create(
                invoice_id=invoice_id,
                name=name,
                email=email,
                phone=phone,
                address=address,
                city=city,
                pincode=pincode,
                payment_mode=payment_mode,
                subtotal=cart.get_subtotal(),
                discount=cart.get_discount(),
                shipping=cart.get_shipping(),
                total=cart.get_total()
            )

            # Create OrderItems
            for item in cart:
                OrderItem.objects.create(
                    order=order,
                    product=item['product'],
                    quantity=item['quantity'],
                    price=item['price']
                )

            # Clear session cart
            cart.clear()

            # Store the created invoice in session for a redirect landing page or tracking page
            return render(request, 'shop/checkout_success.html', {'order': order})

    return render(request, 'shop/checkout.html')


def tracking_view(request):
    invoice_id = request.GET.get('invoice_id', '').strip()
    contact = request.GET.get('contact', '').strip()

    order = None
    error_message = None

    if invoice_id and contact:
        # Check by email or phone
        order_query = Order.objects.filter(invoice_id=invoice_id)
        if order_query.exists():
            candidate = order_query.first()
            if candidate.email.lower() == contact.lower() or candidate.phone == contact:
                order = candidate
            else:
                error_message = "Order found, but contact details do not match."
        else:
            error_message = "No order found with this invoice ID."

    context = {
        'order': order,
        'invoice_id': invoice_id,
        'contact': contact,
        'error_message': error_message,
    }
    return render(request, 'shop/order_tracking.html', context)


def about_view(request):
    return render(request, 'shop/about.html')


def contact_view(request):
    success = False
    if request.method == 'POST':
        # Simply return success feedback mock
        success = True
    return render(request, 'shop/contact.html', {'success': success})


def login_mock_view(request):
    if request.method == 'POST':
        # Mock login: save username in session
        email = request.POST.get('email', '')
        request.session['user_email'] = email
        return redirect('shop:home')
    return render(request, 'shop/login.html')


# ==========================================
# AJAX API VIEWS
# ==========================================

@csrf_exempt
def cart_add_api(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    
    qty = 1
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            qty = int(data.get('quantity', 1))
        except (ValueError, json.JSONDecodeError):
            qty = int(request.POST.get('quantity', 1))
    elif request.method == 'GET':
        qty = int(request.GET.get('quantity', 1))

    cart.add(product=product, quantity=qty)
    return JsonResponse({
        'success': True,
        'message': f"Added {product.name} to cart.",
        'cart_count': len(cart),
        'cart_total': float(cart.get_total()),
    })


@csrf_exempt
def cart_remove_api(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    cart.remove(product)
    return JsonResponse({
        'success': True,
        'message': f"Removed {product.name} from cart.",
        'cart_count': len(cart),
        'cart_total': float(cart.get_total()),
    })


@csrf_exempt
def cart_update_api(request, product_id):
    cart = Cart(request)
    product = get_object_or_404(Product, id=product_id)
    
    qty = 1
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            qty = int(data.get('quantity', 1))
        except (ValueError, json.JSONDecodeError):
            qty = int(request.POST.get('quantity', 1))
    elif request.method == 'GET':
        qty = int(request.GET.get('quantity', 1))

    cart.add(product=product, quantity=qty, override_quantity=True)
    return JsonResponse({
        'success': True,
        'message': f"Updated {product.name} quantity.",
        'cart_count': len(cart),
        'cart_total': float(cart.get_total()),
    })


@csrf_exempt
def cart_apply_coupon_api(request):
    cart = Cart(request)
    code = ""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            code = data.get('coupon_code', '').strip().upper()
        except (ValueError, json.JSONDecodeError):
            code = request.POST.get('coupon_code', '').strip().upper()

    coupons = {
        'ORGANIC10': Decimal('0.10'),
        'VILLAGE20': Decimal('0.20'),
    }

    if code in coupons:
        cart.apply_coupon(code, coupons[code])
        return JsonResponse({
            'success': True,
            'message': f"Coupon '{code}' applied successfully!",
            'discount': float(cart.get_discount()),
            'subtotal': float(cart.get_subtotal()),
            'shipping': float(cart.get_shipping()),
            'total': float(cart.get_total()),
        })
    else:
        return JsonResponse({
            'success': False,
            'message': "Invalid coupon code."
        })


@csrf_exempt
def cart_remove_coupon_api(request):
    cart = Cart(request)
    cart.remove_coupon()
    return JsonResponse({
        'success': True,
        'message': "Coupon removed.",
        'subtotal': float(cart.get_subtotal()),
        'discount': 0.0,
        'shipping': float(cart.get_shipping()),
        'total': float(cart.get_total()),
    })


def cart_drawer_items_api(request):
    cart = Cart(request)
    items_data = []
    for item in cart:
        items_data.append({
            'id': item['product'].id,
            'name': item['product'].name,
            'price': float(item['price']),
            'quantity': item['quantity'],
            'image': item['product'].image,
            'total_price': float(item['total_price']),
        })

    return JsonResponse({
        'items': items_data,
        'subtotal': float(cart.get_subtotal()),
        'discount': float(cart.get_discount()),
        'shipping': float(cart.get_shipping()),
        'total': float(cart.get_total()),
        'cart_count': len(cart),
    })


def product_quickview_api(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return JsonResponse({
        'id': product.id,
        'name': product.name,
        'price': float(product.price),
        'oldPrice': float(product.oldPrice) if product.oldPrice else None,
        'badge': product.badge,
        'rating': float(product.rating),
        'reviews': product.reviews,
        'image': product.image,
        'categoryName': product.category.name,
        'description': product.description,
        'specs': product.specs,
    })
