from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from .models import SanPham, LoaiHang
from .serializers import SanPhamSerializer, LoaiHangSerializer

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
def dat_hang(request):
    # Nhận dữ liệu (Tên, SĐT, Địa chỉ, Danh sách hàng) từ React gửi lên
    data = request.data 
    
    # Tạm thời in ra màn hình Terminal để kiểm tra xem React gửi đúng chưa
    print("DỮ LIỆU ĐƠN HÀNG MỚI:", data)
    
    # Trả về thông báo thành công cho React
    return Response({"message": "Đặt hàng thành công!"})

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
