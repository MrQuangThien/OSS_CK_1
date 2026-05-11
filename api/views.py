from django.shortcuts import get_object_or_404
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status

# THÊM HinhAnhSanPham VÀO DÒNG IMPORT NÀY
from .models import SanPham, LoaiHang, DonHang, ChiTietDonHang, KhachHang, NhaCungCap, PhieuNhap, ChiTietPhieuNhap, HinhAnhSanPham
from .serializers import SanPhamSerializer, LoaiHangSerializer, DonHangSerializer, NhaCungCapSerializer

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
        if User.objects.filter(username=data['username']).exists():
            return Response({'error': 'Tên đăng nhập đã tồn tại!'}, status=status.HTTP_400_BAD_REQUEST)
        
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

    user = authenticate(username=username, password=password)

    if user is not None:
        # XÁC ĐỊNH VAI TRÒ ĐỂ GỬI VỀ REACT
        if user.is_superuser:
            role = 'Admin'
        elif user.is_staff:
            role = user.last_name or 'Quản lý'
        else:
            role = 'Khách hàng'

        return Response({
            'message': 'Đăng nhập thành công!',
            'user': {
                'username': user.username,
                'email': user.email,
                'role': role  # Gửi thêm role về Frontend
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

        khach_hang_obj, created = KhachHang.objects.get_or_create(
            so_dien_thoai=khach_hang_data.get('so_dien_thoai'),
            defaults={
                'ho_ten': khach_hang_data.get('ho_ten'),
                'dia_chi': khach_hang_data.get('dia_chi')
            }
        )

        don_hang = DonHang.objects.create(
            khach_hang=khach_hang_obj,
            tong_tien=tong_tien,
            trang_thai="Chờ xử lý" 
        )

        for item in san_phams:
            sp = SanPham.objects.get(id=item['id'])
            so_luong_mua = item['so_luong']

            ChiTietDonHang.objects.create(
                don_hang=don_hang,
                san_pham=sp,
                so_luong_mua=so_luong_mua,
                don_gia=item['gia_ban']
            )

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
        don_hangs = DonHang.objects.all().order_by('-ngay_dat_hang')
        serializer = DonHangSerializer(don_hangs, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def chi_tiet_don_hang(request, pk):
    try:
        # 1. Tìm đơn hàng
        dh = get_object_or_404(DonHang, pk=pk)
        
        # 2. Lấy thông tin cơ bản của đơn hàng
        serializer = DonHangSerializer(dh)
        data = serializer.data
        
        # 3. LẤY THÊM CHI TIẾT SẢN PHẨM VÀ ĐÍNH KÈM VÀO
        chi_tiets = ChiTietDonHang.objects.filter(don_hang=dh).select_related('san_pham')
        items = []
        for ct in chi_tiets:
            items.append({
                "san_pham": {
                    "ten_san_pham": ct.san_pham.ten_san_pham,
                    "hinh_anh": ct.san_pham.hinh_anh.url if ct.san_pham.hinh_anh else None
                },
                "don_gia": ct.don_gia,
                "so_luong_mua": ct.so_luong_mua
            })
        
        # Gắn mảng items vào cục data trả về
        data['items'] = items
        
        return Response(data)

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
    
@api_view(['DELETE'])
def delete_product(request, pk):
    sp = get_object_or_404(SanPham, pk=pk)
    sp.delete()
    return Response(status=204)


# ==========================================
# ĐÃ SỬA API THÊM SẢN PHẨM
# ==========================================
@api_view(['POST'])
def them_san_pham(request):
    try:
        data = request.data
        loai_hang_id = data.get('loai_hang')
        loai_hang = get_object_or_404(LoaiHang, pk=loai_hang_id)
        
        # 1. Ép kiểu Boolean cho các cờ trạng thái (Mới, Nổi bật)
        la_sp_moi = data.get('la_san_pham_moi', 'False') in ['True', 'true', True]
        la_sp_noi_bat = data.get('la_san_pham_noi_bat', 'False') in ['True', 'true', True]

        # 2. Tạo sản phẩm với đầy đủ các trường (bao gồm mô tả)
        sp = SanPham.objects.create(
            ten_san_pham=data.get('ten_san_pham'),
            loai_hang=loai_hang,
            gia_ban=data.get('gia_ban'),
            ton_kho=data.get('ton_kho', 0),
            mo_ta_ngan=data.get('mo_ta_ngan', ''),
            mo_ta_chi_tiet=data.get('mo_ta_chi_tiet', ''),
            la_san_pham_moi=la_sp_moi,
            la_san_pham_noi_bat=la_sp_noi_bat
        )
        
        # 3. Lưu ảnh đại diện chính
        if 'hinh_anh' in request.FILES:
            sp.hinh_anh = request.FILES['hinh_anh']
            sp.save()
            
        # 4. Lưu mảng ảnh phụ (Nếu có)
        danh_sach_anh_phu = request.FILES.getlist('hinh_anh_phu')
        for anh in danh_sach_anh_phu:
            HinhAnhSanPham.objects.create(san_pham=sp, hinh_anh=anh)
            
        return Response({"message": "Thêm sản phẩm thành công!"}, status=201)
        
    except Exception as e:
        print("🚨 LỖI THÊM SẢN PHẨM:", str(e))
        return Response({"error": str(e)}, status=400)


# ==========================================
# ĐÃ SỬA API SỬA SẢN PHẨM
# ==========================================
@api_view(['PATCH'])
def sua_san_pham(request, pk):
    try:
        sp = get_object_or_404(SanPham, pk=pk)
        data = request.data
        
        if 'ten_san_pham' in data: sp.ten_san_pham = data['ten_san_pham']
        if 'loai_hang' in data: sp.loai_hang = get_object_or_404(LoaiHang, pk=data['loai_hang'])
        if 'gia_ban' in data: sp.gia_ban = data['gia_ban']
        if 'ton_kho' in data: sp.ton_kho = data['ton_kho']
        if 'mo_ta_ngan' in data: sp.mo_ta_ngan = data['mo_ta_ngan']
        if 'mo_ta_chi_tiet' in data: sp.mo_ta_chi_tiet = data['mo_ta_chi_tiet']
            
        # Kiểm tra boolean và ép kiểu
        if 'la_san_pham_moi' in data:
            sp.la_san_pham_moi = data['la_san_pham_moi'] in ['True', 'true', True]
        if 'la_san_pham_noi_bat' in data:
            sp.la_san_pham_noi_bat = data['la_san_pham_noi_bat'] in ['True', 'true', True]
            
        # Cập nhật ảnh chính
        if 'hinh_anh' in request.FILES:
            sp.hinh_anh = request.FILES['hinh_anh']
            
        sp.save()
        
        # Cập nhật ảnh phụ (Chỉ nối thêm ảnh mới vào bộ sưu tập)
        danh_sach_anh_phu = request.FILES.getlist('hinh_anh_phu')
        for anh in danh_sach_anh_phu:
            HinhAnhSanPham.objects.create(san_pham=sp, hinh_anh=anh)
            
        return Response({"message": "Cập nhật sản phẩm thành công!"})
        
    except Exception as e:
        print("🚨 LỖI SỬA SẢN PHẨM:", str(e))
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
def them_loai_hang(request):
    try:
        ten = request.data.get('ten_loai')
        if not ten:
            return Response({"error": "Vui lòng nhập tên loại hàng"}, status=400)
            
        LoaiHang.objects.create(ten_loai=ten)
        return Response({"message": "Thêm danh mục thành công!"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['PATCH'])
def sua_loai_hang(request, pk):
    try:
        lh = get_object_or_404(LoaiHang, pk=pk)
        lh.ten_loai = request.data.get('ten_loai', lh.ten_loai)
        lh.save()
        return Response({"message": "Cập nhật thành công!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['DELETE'])
def xoa_loai_hang(request, pk):
    try:
        lh = get_object_or_404(LoaiHang, pk=pk)
        lh.delete()
        return Response({"message": "Đã xóa danh mục"}, status=204)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['GET'])
def danh_sach_phieu_nhap(request):
    try:
        phieu_nhaps = PhieuNhap.objects.select_related('nha_cung_cap').order_by('-id')
        
        data = []
        for pn in phieu_nhaps:
            data.append({
                "id": pn.id,
                "nha_cung_cap": pn.nha_cung_cap.ten_nha_cung_cap if pn.nha_cung_cap else "Khách lẻ",
                "ngay_nhap": pn.ngay_nhap.strftime("%d/%m/%Y %H:%M") if hasattr(pn, 'ngay_nhap') and pn.ngay_nhap else "",
                "tong_tien": pn.tong_tien if hasattr(pn, 'tong_tien') else 0,
            })
            
        return Response(data, status=200)
    except Exception as e:
        print("🚨 LỖI LẤY PHIẾU NHẬP:", str(e))
        return Response({"error": str(e)}, status=400)
    
@api_view(['POST'])
@transaction.atomic
def tao_phieu_nhap(request):
    try:
        data = request.data
        nha_cung_cap_id = data.get('nha_cung_cap')
        danh_sach_sp = data.get('chi_tiet', [])

        ncc = get_object_or_404(NhaCungCap, pk=nha_cung_cap_id)
        phieu_nhap = PhieuNhap.objects.create(nha_cung_cap=ncc, tong_tien=0)

        tong_tien_phieu = 0

        for item in danh_sach_sp:
            sp = get_object_or_404(SanPham, pk=item['san_pham_id'])
            so_luong = int(item['so_luong'])
            gia_nhap = float(item['gia_nhap'])
            thanh_tien = so_luong * gia_nhap

            ChiTietPhieuNhap.objects.create(
                phieu_nhap=phieu_nhap,
                san_pham=sp,
                so_luong=so_luong,
                gia_nhap=gia_nhap
            )

            sp.ton_kho += so_luong
            sp.save()

            tong_tien_phieu += thanh_tien

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

@api_view(['GET'])
def danh_sach_nha_cung_cap(request):
    nccs = NhaCungCap.objects.all()
    serializer = NhaCungCapSerializer(nccs, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def them_nha_cung_cap(request):
    try:
        data = request.data
        NhaCungCap.objects.create(
            ten_nha_cung_cap=data.get('ten_nha_cung_cap'),
            so_dien_thoai=data.get('so_dien_thoai', ''),
            dia_chi=data.get('dia_chi', '')
        )
        return Response({"message": "Thêm nhà cung cấp thành công!"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['PATCH'])
def sua_nha_cung_cap(request, pk):
    try:
        ncc = get_object_or_404(NhaCungCap, pk=pk)
        data = request.data
        if 'ten_nha_cung_cap' in data: ncc.ten_nha_cung_cap = data['ten_nha_cung_cap']
        if 'so_dien_thoai' in data: ncc.so_dien_thoai = data['so_dien_thoai']
        if 'dia_chi' in data: ncc.dia_chi = data['dia_chi']
        ncc.save()
        return Response({"message": "Cập nhật thành công!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['DELETE'])
def xoa_nha_cung_cap(request, pk):
    try:
        ncc = get_object_or_404(NhaCungCap, pk=pk)
        ncc.delete()
        return Response({"message": "Đã xóa nhà cung cấp"}, status=204)
    except Exception as e:
        return Response({"error": "Không thể xóa vì nhà cung cấp này đang có Phiếu nhập!"}, status=400)
    
@api_view(['GET'])
def danh_sach_khach_hang(request):
    try:
        # Lấy tất cả tài khoản là KHÁCH HÀNG (is_staff = False)
        khach_hangs = User.objects.filter(is_staff=False).order_by('-id')
        data = []
        for kh in khach_hangs:
            data.append({
                "id": kh.id,
                "username": kh.username,
                "email": kh.email if kh.email else "Chưa cập nhật",
                "ngay_tham_gia": kh.date_joined.strftime("%d/%m/%Y")
            })
        return Response(data, status=200)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
def danh_sach_nhan_vien(request):
    # CHỈ LẤY NHỮNG AI LÀ STAFF (Loại bỏ hoàn toàn khách vãng lai)
    users = User.objects.filter(is_staff=True).order_by('-id')
    data = []
    for u in users:
        if u.is_superuser:
            vai_tro = "Admin"
        else:
            vai_tro = u.last_name if u.last_name else "Nhân viên"
            
        data.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "vai_tro": vai_tro,
            "ngay_tham_gia": u.date_joined.strftime("%d/%m/%Y")
        })
    return Response(data, status=200)

@api_view(['POST'])
def them_nhan_vien(request):
    data = request.data
    try:
        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Tên đăng nhập đã tồn tại!"}, status=400)
        
        user = User.objects.create_user(
            username=data['username'],
            password=data['password'],
            email=data.get('email', '')
        )
        
        vai_tro = data.get('vai_tro', 'nhan_vien')
        
        # TẤT CẢ NHÂN SỰ ĐỀU PHẢI CÓ QUYỀN STAFF ĐỂ PHÂN BIỆT VỚI KHÁCH HÀNG
        user.is_staff = True 

        if vai_tro == 'admin':
            user.is_superuser = True
            user.last_name = 'Admin'
        elif vai_tro == 'quan_ly':
            user.is_superuser = False
            user.last_name = 'Quản lý'
        else:
            user.is_superuser = False
            user.last_name = 'Nhân viên'
            
        user.save()
        return Response({"message": "Thêm tài khoản thành công!"}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['DELETE'])
def xoa_nhan_vien(request, pk):
    try:
        user = User.objects.get(pk=pk)
        if user.is_superuser:
            return Response({"error": "Không thể xóa tài khoản Admin tối cao!"}, status=400)
        
        user.delete()
        return Response({"message": "Đã xóa nhân viên!"}, status=204)
    except Exception as e:
        # Bắt lỗi ràng buộc dữ liệu nếu có
        return Response({"error": "Không thể xóa do tài khoản này đang có dữ liệu liên kết!"}, status=400)

@api_view(['PATCH'])
def sua_nhan_vien(request, pk):
    try:
        user = User.objects.get(pk=pk)
        data = request.data
        
        # Cập nhật Email
        if 'email' in data:
            user.email = data['email']
            
        # Cập nhật Mật khẩu (Chỉ cập nhật nếu người dùng có gõ mật khẩu mới)
        if 'password' in data and data['password'].strip() != '':
            user.set_password(data['password'])
            
        # Cập nhật Phân quyền
        if 'vai_tro' in data:
            vai_tro = data['vai_tro']
            if vai_tro == 'admin':
                user.is_superuser = True
                user.last_name = 'Admin'
            elif vai_tro == 'quan_ly':
                user.is_superuser = False
                user.last_name = 'Quản lý'
            else:
                user.is_superuser = False
                user.last_name = 'Nhân viên'
                
        user.save()
        return Response({"message": "Cập nhật nhân sự thành công!"})
    except User.DoesNotExist:
        return Response({"error": "Không tìm thấy nhân viên!"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)