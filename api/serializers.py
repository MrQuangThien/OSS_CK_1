from rest_framework import serializers
from .models import LoaiHang, SanPham, KhachHang, KhoHang, DonHang, ChiTietDonHang

# 1. Serializer cho Loại Hàng (Danh mục)
class LoaiHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoaiHang
        fields = '__all__'

# 2. Serializer cho Sản Phẩm
class SanPhamSerializer(serializers.ModelSerializer):
    ten_loai = serializers.CharField(source='loai_hang.ten_loai', read_only=True)
    ton_kho = serializers.IntegerField(read_only=True)

    class Meta:
        model = SanPham
        fields = '__all__'

# 3. Serializer cho Khách Hàng
class KhachHangSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = KhachHang
        fields = ['id', 'username', 'email', 'ho_ten', 'so_dien_thoai', 'dia_chi']

class ChiTietDonHangSerializer(serializers.ModelSerializer):
    ten_san_pham = serializers.CharField(source='san_pham.ten_san_pham', read_only=True)
    # Lấy thêm cả hình ảnh để React hiển thị
    hinh_anh = serializers.ImageField(source='san_pham.hinh_anh', read_only=True)
    so_luong = serializers.IntegerField(source='so_luong_mua', read_only=True)

    class Meta:
        model = ChiTietDonHang
        fields = ['ten_san_pham', 'hinh_anh', 'so_luong', 'don_gia']

class DonHangSerializer(serializers.ModelSerializer):
    # Nhúng thông tin khách hàng vào chung cục JSON
    khach_hang = KhachHangSerializer(read_only=True)
    # Nhúng danh sách chi tiết sản phẩm vào chung cục JSON
    chi_tiet = ChiTietDonHangSerializer(source='chitietdonhang_set', many=True, read_only=True)

    class Meta:
        model = DonHang
        # Khai báo các cột cần thiết gửi sang React
        fields = ['id', 'ngay_dat_hang', 'tong_tien', 'trang_thai', 'khach_hang', 'chi_tiet']