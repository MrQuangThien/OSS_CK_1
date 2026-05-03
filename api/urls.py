from django.urls import path
from . import views

urlpatterns = [
    path('san-pham/', views.get_san_pham, name='api_san_pham'),
    path('loai-hang/', views.get_loai_hang, name='api_loai_hang'),
    path('san-pham/<int:pk>/', views.get_chi_tiet_sp, name='api_chi_tiet_sp'),
    path('register/', views.register_user, name='api_register'),
    path('login/', views.login_user, name='api_login'),
    path('dat-hang/', views.dat_hang, name='api_dat_hang'),    
    path('lich-su-don-hang/', views.lich_su_don_hang, name='lich_su_don_hang'),
    path('don-hang/<int:pk>/', views.chi_tiet_don_hang, name='chi_tiet_don_hang'),
]