import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' // Thêm useLocation
import axios from 'axios'
import { toast } from 'react-toastify'

function Checkout({ gioHang, onXoaSachGio }) {
  const navigate = useNavigate()
  const location = useLocation()

  // 1. LOGIC QUAN TRỌNG: XÁC ĐỊNH NGUỒN DỮ LIỆU THANH TOÁN
  // Nếu đi từ nút "Mua Ngay" (có location.state.buyNowItem), ta chỉ lấy 1 món đó.
  // Ngược lại (đi từ Giỏ hàng sang), ta dùng toàn bộ gioHang.
  const checkoutItems = location.state?.buyNowItem ? [location.state.buyNowItem] : gioHang;

  // Tính tổng tiền dựa trên danh sách đã chốt ở trên
  const tongTien = checkoutItems.reduce((total, item) => total + (Number(item.gia_ban) * item.so_luong), 0)

  const [khachHang, setKhachHang] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: ''
  })

  // Hàm fix gãy ảnh
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  if (checkoutItems.length === 0) {
    navigate('/gio-hang')
    return null
  }

  const handleDatHang = (e) => {
    e.preventDefault()
    
    const duLieuDonHang = {
      khach_hang: khachHang,
      san_phams: checkoutItems, // Gửi danh sách đúng món đã chọn
      tong_tien: tongTien
    }

    axios.post('http://127.0.0.1:8000/api/dat-hang/', duLieuDonHang)
      .then(response => {
        toast.success('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')
        
        // Nếu họ thanh toán từ Giỏ hàng chung, thì xóa sạch giỏ hàng.
        // Nếu mua ngay 1 món, thì không động chạm tới giỏ hàng.
        if (!location.state?.buyNowItem) {
          onXoaSachGio()
        }
        
        navigate('/')
      })
      .catch(error => {
        toast.error('❌ Có lỗi xảy ra khi đặt hàng!')
        console.error(error)
      })
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-12 mb-4">
          <h2 className="fw-bold"><i className="fa-solid fa-credit-card text-orange me-2"></i>Thanh toán đơn hàng</h2>
          <p className="text-muted">Vui lòng kiểm tra lại thông tin giao hàng trước khi xác nhận.</p>
        </div>

        <div className="col-lg-7 mb-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold border-bottom pb-3 mb-4">Thông tin giao hàng</h5>
            
            <form onSubmit={handleDatHang} id="checkoutForm">
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">HỌ VÀ TÊN NGƯỜI NHẬN</label>
                <input type="text" className="form-control px-3 py-2" required placeholder="Nhập họ tên..."
                  value={khachHang.ho_ten} onChange={(e) => setKhachHang({...khachHang, ho_ten: e.target.value})} />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">SỐ ĐIỆN THOẠI</label>
                <input type="tel" className="form-control px-3 py-2" required placeholder="Nhập số điện thoại..."
                  value={khachHang.so_dien_thoai} onChange={(e) => setKhachHang({...khachHang, so_dien_thoai: e.target.value})} />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted">ĐỊA CHỈ GIAO HÀNG CHI TIẾT</label>
                <textarea className="form-control px-3 py-2" rows="3" required placeholder="Nhập số nhà, tên đường, phường/xã..."
                  value={khachHang.dia_chi} onChange={(e) => setKhachHang({...khachHang, dia_chi: e.target.value})}></textarea>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted">PHƯƠNG THỨC THANH TOÁN</label>
                <div className="form-check border border-orange rounded p-3 bg-light">
                  <input className="form-check-input ms-1" type="radio" checked readOnly />
                  <label className="form-check-label ms-2 fw-semibold text-dark">
                    <i className="fa-solid fa-money-bill-wave text-success me-2"></i> Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{top: '100px'}}>
            <h5 className="fw-bold border-bottom pb-3 mb-4">Tóm tắt đơn hàng</h5>
            
            <div className="cart-items-list mb-4" style={{maxHeight: '350px', overflowY: 'auto', paddingRight: '5px'}}>
              {/* Lặp từ mảng checkoutItems thay vì gioHang */}
              {checkoutItems.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{width: '55px', height: '55px', flexShrink: '0', borderRadius: '8px', border: '1px solid #eee', background: '#fff', padding: '3px'}}>
                      <img src={getImageUrl(item.hinh_anh)} alt={item.ten_san_pham} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark text-truncate" style={{maxWidth: '160px'}}>{item.ten_san_pham}</div>
                      <div className="small text-muted">Số lượng: {item.so_luong}</div>
                    </div>
                  </div>
                  <div className="fw-bold text-end">
                    {(Number(item.gia_ban) * item.so_luong).toLocaleString('vi-VN')} ₫
                  </div>
                </div>
              ))}
            </div>
            
            <div className="d-flex justify-content-between mb-2 mt-4">
              <span className="text-muted">Tạm tính:</span>
              <span className="fw-bold">{tongTien.toLocaleString('vi-VN')} ₫</span>
            </div>
            <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
              <span className="text-muted">Phí vận chuyển:</span>
              <span className="fw-bold text-success">Miễn phí</span>
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold">Tổng cộng:</span>
              <span className="fs-4 fw-bold text-orange">{tongTien.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <button type="submit" form="checkoutForm" className="btn btn-orange w-100 fw-bold py-3 fs-5 rounded-pill shadow-sm">
              <i className="fa-solid fa-circle-check me-2"></i> XÁC NHẬN ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout