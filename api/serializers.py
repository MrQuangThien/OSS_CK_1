from rest_framework import serializers
from .models import LoaiHang, SanPham, KhachHang, KhoHang, DonHang

# 1. Serializer cho Loại Hàng (Danh mục)
class LoaiHangSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoaiHang
        fields = '__all__' # Lấy toàn bộ các cột trong bảng LoaiHang

# 2. Serializer cho Sản Phẩm
class SanPhamSerializer(serializers.ModelSerializer):
    # Lấy thêm tên loại hàng thay vì chỉ hiện mỗi số ID của loại hàng
    ten_loai = serializers.CharField(source='loai_hang.ten_loai', read_only=True)
    
    # Lấy số lượng tồn kho (từ hàm @property ton_kho trong models.py)
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

# 4. Serializer cho Đơn Hàng
class DonHangSerializer(serializers.ModelSerializer):
    ten_khach_hang = serializers.CharField(source='khach_hang.ho_ten', read_only=True)

    class Meta:
        model = DonHang
        fields = '__all__'