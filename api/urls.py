from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('san-pham/', views.get_san_pham, name='api_san_pham'),
    path('loai-hang/', views.get_loai_hang, name='api_loai_hang'),
    path('san-pham/<int:pk>/', views.get_chi_tiet_sp, name='api_chi_tiet_sp'),
    path('register/', views.register_user, name='api_register'),
    path('login/', views.login_user, name='api_login'),
    path('dat-hang/', views.dat_hang, name='api_dat_hang'),    
    path('lich-su-don-hang/', views.lich_su_don_hang, name='lich_su_don_hang'),
    path('don-hang/<int:pk>/', views.chi_tiet_don_hang, name='chi_tiet_don_hang'),
    path('chi-tiet-don-hang/<int:pk>/', views.chi_tiet_don_hang), 
    path('don-hang/<int:pk>/status/', views.update_order_status),
    path('san-pham/<int:pk>/delete/', views.delete_product),
    path('san-pham/them/', views.them_san_pham, name='them_san_pham'),
    path('san-pham/<int:pk>/sua/', views.sua_san_pham, name='sua_san_pham'),
    path('loai-hang/them/', views.them_loai_hang, name='them_loai_hang'),
    path('loai-hang/<int:pk>/sua/', views.sua_loai_hang, name='sua_loai_hang'),
    path('loai-hang/<int:pk>/xoa/', views.xoa_loai_hang, name='xoa_loai_hang'),
    path('phieu-nhap/', views.danh_sach_phieu_nhap, name='danh_sach_phieu_nhap'),
    path('phieu-nhap/tao/', views.tao_phieu_nhap),
    path('phieu-nhap/<int:pk>/', views.chi_tiet_phieu_nhap),
    path('nha-cung-cap/', views.danh_sach_nha_cung_cap, name='danh_sach_nha_cung_cap'),
    path('nha-cung-cap/them/', views.them_nha_cung_cap),
    path('nha-cung-cap/<int:pk>/sua/', views.sua_nha_cung_cap),
    path('nha-cung-cap/<int:pk>/xoa/', views.xoa_nha_cung_cap),
    path('khach-hang/', views.danh_sach_khach_hang),
    path('nhan-vien/', views.danh_sach_nhan_vien),
    path('nhan-vien/them/', views.them_nhan_vien),
    path('nhan-vien/<int:pk>/xoa/', views.xoa_nhan_vien),
    path('nhan-vien/<int:pk>/sua/', views.sua_nhan_vien),
    path('thong-tin-ca-nhan/', views.thong_tin_ca_nhan),
]
