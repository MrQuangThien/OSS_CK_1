from django.contrib import admin
from .models import SanPham, LoaiHang

admin.site.register(SanPham)
admin.site.register(LoaiHang)
@admin.register(NhaCungCap)
class NhaCungCapAdmin(admin.ModelAdmin):
    list_display = ('ten_nha_cung_cap', 'so_dien_thoai', 'dia_chi')
    search_fields = ('ten_nha_cung_cap',)

# Tạo giao diện bảng Nhúng (Inline) cho Chi Tiết Phiếu Nhập
class ChiTietPhieuNhapInline(admin.TabularInline):
    model = ChiTietPhieuNhap
    extra = 3 # Hiển thị sẵn 3 dòng trống để nhập liệu cho lẹ

# Đăng ký Phiếu Nhập và nhúng cái bảng Chi tiết vào trong nó
@admin.register(PhieuNhap)
class PhieuNhapAdmin(admin.ModelAdmin):
    list_display = ('id', 'nha_cung_cap', 'nguoi_nhap', 'ngay_nhap', 'tong_tien')
    list_filter = ('ngay_nhap', 'nha_cung_cap')
    readonly_fields = ('tong_tien', 'nguoi_nhap') # Không cho sửa bằng tay
    inlines = [ChiTietPhieuNhapInline]

    # Tự động gán người nhập chính là cái tài khoản Admin đang thao tác
    def save_model(self, request, obj, form, change):
        if not getattr(obj, 'nguoi_nhap', None):
            obj.nguoi_nhap = request.user
        super().save_model(request, obj, form, change)