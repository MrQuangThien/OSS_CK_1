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
@api_view(['PATCH']) 
def update_order_status(request, pk):
    try:
        don_hang = DonHang.objects.get(pk=pk)
        moi_trang_thai = request.data.get('trang_thai')
        if moi_trang_thai:
            don_hang.trang_thai = moi_trang_thai
            don_hang.save()
            return Response({"message": "Cập nhật thành công!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)  
@api_view(['GET'])
def danh_sach_phieu_nhap(request):
    try:
        # Lấy tất cả phiếu nhập, sắp xếp mới nhất lên đầu
        phieu_nhaps = PhieuNhap.objects.select_related('nha_cung_cap').order_by('-id')
        
        data = []
        for pn in phieu_nhaps:
            data.append({
                "id": pn.id,
                # Lấy tên nhà cung cấp, nếu không có thì để trống
                "nha_cung_cap": pn.nha_cung_cap.ten_nha_cung_cap if pn.nha_cung_cap else "Khách lẻ",
                # Format ngày tháng (bạn nhớ check xem trường trong model của bạn tên là gì, ở đây mình giả sử là ngay_nhap)
                "ngay_nhap": pn.ngay_nhap.strftime("%d/%m/%Y %H:%M") if hasattr(pn, 'ngay_nhap') and pn.ngay_nhap else "",
                "tong_tien": pn.tong_tien if hasattr(pn, 'tong_tien') else 0,
            })
            
        return Response(data, status=200)
    except Exception as e:
        print("🚨 LỖI LẤY PHIẾU NHẬP:", str(e))
        return Response({"error": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic # Dùng transaction để bảo vệ dữ liệu
def tao_phieu_nhap(request):
    try:
        data = request.data
        nha_cung_cap_id = data.get('nha_cung_cap')
        danh_sach_sp = data.get('chi_tiet', []) # Mảng các sản phẩm nhập

        # 1. Tạo Phiếu Nhập tổng
        ncc = get_object_or_404(NhaCungCap, pk=nha_cung_cap_id)
        phieu_nhap = PhieuNhap.objects.create(nha_cung_cap=ncc, tong_tien=0)

        tong_tien_phieu = 0

        # 2. Lặp qua từng sản phẩm trong danh sách để lưu chi tiết
        for item in danh_sach_sp:
            sp = get_object_or_404(SanPham, pk=item['san_pham_id'])
            so_luong = int(item['so_luong'])
            gia_nhap = float(item['gia_nhap'])
            thanh_tien = so_luong * gia_nhap

            # Lưu Chi tiết phiếu nhập
            ChiTietPhieuNhap.objects.create(
                phieu_nhap=phieu_nhap,
                san_pham=sp,
                so_luong=so_luong,
                gia_nhap=gia_nhap
            )

            # --- QUAN TRỌNG: CẬP NHẬT TỒN KHO ---
            sp.ton_kho += so_luong
            sp.save()

            tong_tien_phieu += thanh_tien

        # 3. Cập nhật lại tổng tiền cho phiếu nhập
        phieu_nhap.tong_tien = tong_tien_phieu
        phieu_nhap.save()

        return Response({"message": "Nhập kho thành công!", "id": phieu_nhap.id}, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def chi_tiet_phieu_nhap(request, pk):
    phieu = get_object_or_404(PhieuNhap, pk=pk)
    chi_tiet = ChiTietPhieuNhap.objects.filter(phieu_nhap=phieu).select_related('san_pham')
    
    return Response({
        "id": phieu.id,
        "nha_cung_cap": phieu.nha_cung_cap.ten_nha_cung_cap if phieu.nha_cung_cap else "N/A",
        "ngay_nhap": phieu.ngay_nhap.strftime("%d/%m/%Y %H:%M") if hasattr(phieu, 'ngay_nhap') else "",
        "tong_tien": phieu.tong_tien,
        "items": [{
            "ten_sp": item.san_pham.ten_san_pham,
            "so_luong": item.so_luong,
            "gia_nhap": item.gia_nhap,
            "thanh_tien": item.so_luong * item.gia_nhap
        } for item in chi_tiet]
    })
