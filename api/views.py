from django.shortcuts import get_object_or_404
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from .models import SanPham, LoaiHang, DonHang, ChiTietDonHang, KhachHang
from .serializers import SanPhamSerializer, LoaiHangSerializer, DonHangSerializer
# API lấy danh sách tất cả sản phẩm
@api_view(['GET'])
def get_san_pham(request):
    san_phams = SanPham.objects.all().order_by('-id')
    serializer = SanPhamSerializer(san_phams, many=True)
    return Response(serializer.data)

# API lấy danh sách loại hàng (danh mục)
@api_view(['GET'])
def get_loai_hang(request):
    loai_hangs = LoaiHang.objects.all()
    serializer = LoaiHangSerializer(loai_hangs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_chi_tiet_sp(request, pk):
    try:
        sp = SanPham.objects.get(pk=pk)
        serializer = SanPhamSerializer(sp)
        return Response(serializer.data)
    except SanPham.DoesNotExist:
        return Response({'loi': 'Không tìm thấy sản phẩm'}, status=404)

@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        # Kiểm tra xem tên đăng nhập đã có ai dùng chưa
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Tên đăng nhập đã tồn tại!'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Dùng create_user để Django tự động mã hóa mật khẩu (Bắt buộc)
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        return Response({'message': 'Đăng ký thành công!'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')

    # Hàm authenticate sẽ vào Database kiểm tra xem đúng tài khoản/mật khẩu không
    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            'message': 'Đăng nhập thành công!',
            'user': {
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Sai tên đăng nhập hoặc mật khẩu!'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def dat_hang(request):
    try:
        data = request.data
        khach_hang_data = data.get('khach_hang', {})
        san_phams = data.get('san_phams', [])
        tong_tien = data.get('tong_tien', 0)

        # 1. TẠO HOẶC TÌM KHÁCH HÀNG
        # Tìm khách hàng theo Số điện thoại, nếu chưa có thì hệ thống tự tạo mới
        khach_hang_obj, created = KhachHang.objects.get_or_create(
            so_dien_thoai=khach_hang_data.get('so_dien_thoai'),
            defaults={
                'ho_ten': khach_hang_data.get('ho_ten'),
                'dia_chi': khach_hang_data.get('dia_chi')
            }
        )

        # 2. TẠO ĐƠN HÀNG CHÍNH
        don_hang = DonHang.objects.create(
            khach_hang=khach_hang_obj,
            tong_tien=tong_tien,
            trang_thai="Chờ xử lý" # Khớp với default trong Model của bạn
        )

        # 3. LƯU CHI TIẾT SẢN PHẨM & TRỪ TỒN KHO
        for item in san_phams:
            sp = SanPham.objects.get(id=item['id'])
            so_luong_mua = item['so_luong']

            ChiTietDonHang.objects.create(
                don_hang=don_hang,
                san_pham=sp,
                so_luong_mua=so_luong_mua,
                don_gia=item['gia_ban']
            )

            # Trừ tồn kho tự động (Tránh bán âm kho)
            if sp.ton_kho >= so_luong_mua:
                sp.ton_kho -= so_luong_mua
                sp.save()

        return Response({"message": "Lưu đơn hàng vào DB thành công!"}, status=201)
    
    except Exception as e:
        print("LỖI LƯU ĐƠN HÀNG:", str(e))
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def lich_su_don_hang(request):
    try:
        # Tạm thời lấy toàn bộ đơn hàng, sắp xếp theo ngày mới nhất lên đầu (-ngay_dat_hang)
        # (Sau này khi ráp chức năng Đăng nhập Token hoàn chỉnh, bạn có thể đổi thành:
        # don_hangs = DonHang.objects.filter(khach_hang=request.user).order_by('-ngay_dat_hang') )
        don_hangs = DonHang.objects.all().order_by('-ngay_dat_hang')
        
        # Đưa QuerySet vào Serializer để dịch ra JSON
        serializer = DonHangSerializer(don_hangs, many=True)
        
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def chi_tiet_don_hang(request, pk):
    try:
        # Tìm đơn hàng
        dh = get_object_or_404(DonHang, pk=pk)
        
        # Nhờ Serializer dịch ra JSON
        serializer = DonHangSerializer(dh)
        return Response(serializer.data)

    except Exception as e:
        print("🚨 LỖI API CHI TIẾT:", str(e))
        return Response({"error": str(e)}, status=400)