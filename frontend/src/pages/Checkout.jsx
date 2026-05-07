import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function Checkout({ gioHang, onXoaSachGio }) {
  const navigate = useNavigate()
  const tongTien = gioHang.reduce((total, item) => total + (Number(item.gia_ban) * item.so_luong), 0)

  const [khachHang, setKhachHang] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: ''
  })

  // Ngăn chặn nếu người dùng cố tình gõ URL /thanh-toan khi giỏ trống
  if (gioHang.length === 0) {
    navigate('/gio-hang')
    return null
  }

  const handleDatHang = (e) => {
    e.preventDefault()
    
    const duLieuDonHang = {
      khach_hang: khachHang,
      san_phams: gioHang, // Gửi kèm mảng đã có số lượng
      tong_tien: tongTien
    }

    axios.post('http://127.0.0.1:8000/api/dat-hang/', duLieuDonHang)
      .then(response => {
        toast.success('🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')
        onXoaSachGio()
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
          <h2 className="fw-bold"><i className="fa-solid fa-credit-card text-primary me-2"></i>Thanh toán đơn hàng</h2>
          <p className="text-muted">Vui lòng kiểm tra lại thông tin giao hàng trước khi xác nhận.</p>
        </div>

        {/* BÊN TRÁI: FORM ĐIỀN THÔNG TIN */}
        <div className="col-lg-7 mb-4">
          <div className="card checkout-card p-4">
            <h4 className="section-title">Thông tin giao hàng</h4>
            
            <form onSubmit={handleDatHang} id="checkoutForm">
              <div className="mb-3">
                <label className="form-label fw-bold">Họ và tên người nhận</label>
                <input type="text" className="form-control" required placeholder="Nhập họ tên..."
                  value={khachHang.ho_ten} onChange={(e) => setKhachHang({...khachHang, ho_ten: e.target.value})} />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Số điện thoại</label>
                <input type="tel" className="form-control" required placeholder="Nhập số điện thoại..."
                  value={khachHang.so_dien_thoai} onChange={(e) => setKhachHang({...khachHang, so_dien_thoai: e.target.value})} />
              </div>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Địa chỉ giao hàng chi tiết</label>
                <textarea className="form-control" rows="3" required placeholder="Nhập số nhà, tên đường, phường/xã..."
                  value={khachHang.dia_chi} onChange={(e) => setKhachHang({...khachHang, dia_chi: e.target.value})}></textarea>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Phương thức thanh toán</label>
                <div className="form-check border rounded p-3 bg-light">
                  <input className="form-check-input ms-1" type="radio" checked readOnly />
                  <label className="form-check-label ms-2 fw-semibold text-dark">
                    <i className="fa-solid fa-money-bill-wave text-success me-2"></i> Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* BÊN PHẢI: REVIEW LẠI GIỎ HÀNG CHUẨN BỊ CHỐT */}
        <div className="col-lg-5">
          <div className="order-summary shadow-sm">
            <h4 className="section-title">Tóm tắt đơn hàng</h4>
            
            <div className="cart-items-list mb-4" style={{maxHeight: '350px', overflowY: 'auto', paddingRight: '5px'}}>
              {gioHang.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div style={{width: '55px', height: '55px', flexShrink: '0', borderRadius: '8px', border: '1px solid #eee', background: '#fff', padding: '3px'}}>
                      <img src={item.hinh_anh || "https://via.placeholder.com/55"} alt={item.ten_san_pham} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
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
              <span className="fs-4 fw-bold text-danger">{tongTien.toLocaleString('vi-VN')} ₫</span>
            </div>
            
            <button type="submit" form="checkoutForm" className="btn btn-primary w-100 fw-bold py-3 fs-5" style={{borderRadius: '8px'}}>
              <i className="fa-solid fa-circle-check me-2"></i> XÁC NHẬN ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout