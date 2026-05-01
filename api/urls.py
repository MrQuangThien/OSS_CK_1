from django.urls import path
from . import views

urlpatterns = [
    path('san-pham/', views.get_san_pham, name='api_san_pham'),
    path('loai-hang/', views.get_loai_hang, name='api_loai_hang'),
    path('san-pham/<int:pk>/', views.get_chi_tiet_sp, name='api_chi_tiet_sp'),
    path('dat-hang/', views.dat_hang, name='api_dat_hang'),
    path('register/', views.register_user, name='api_register'),
    path('login/', views.login_user, name='api_login'),
]