from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    # Pages
    path('', views.home_view, name='home'),
    path('shop/', views.shop_view, name='shop'),
    path('product/<int:pk>/<slug:slug>/', views.detail_view, name='product_detail'),
    path('cart/', views.cart_view, name='cart'),
    path('checkout/', views.checkout_view, name='checkout'),
    path('tracking/', views.tracking_view, name='tracking'),
    path('about/', views.about_view, name='about'),
    path('contact/', views.contact_view, name='contact'),
    path('login/', views.login_mock_view, name='login'),
    
    # AJAX / API endpoints
    path('api/cart/add/<int:product_id>/', views.cart_add_api, name='cart_add_api'),
    path('api/cart/remove/<int:product_id>/', views.cart_remove_api, name='cart_remove_api'),
    path('api/cart/update/<int:product_id>/', views.cart_update_api, name='cart_update_api'),
    path('api/cart/apply-coupon/', views.cart_apply_coupon_api, name='cart_apply_coupon_api'),
    path('api/cart/remove-coupon/', views.cart_remove_coupon_api, name='cart_remove_coupon_api'),
    path('api/cart/drawer-items/', views.cart_drawer_items_api, name='cart_drawer_items_api'),
    path('api/product/quickview/<int:product_id>/', views.product_quickview_api, name='product_quickview_api'),
]
