import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Cart({ gioHang, onXoaKhoiGio, onXoaSachGio }) {
  const navigate = useNavigate()
  
  // State lưu thông tin khách điền vào Form
  const [khachHang, setKhachHang] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    dia_chi: ''
  })

  const tongTien = gioHang.reduce((total, item) => total + Number(item.gia_ban), 0)

  // Hàm xử lý khi khách bấm nút Đặt Hàng
  const handleDatHang = (e) => {
    e.preventDefault() // Ngăn form tự động tải lại trang
    
    // Gom thông tin người mua và giỏ hàng thành 1 cục dữ liệu
    const duLieuDonHang = {
      khach_hang: khachHang,
      san_phams: gioHang,
      tong_tien: tongTien
    }

    // Gửi cục dữ liệu đó về cổng 8000 của Django
    axios.post('http://127.0.0.1:8000/api/dat-hang/', duLieuDonHang)
      .then(response => {
        alert('🎉 ' + response.data.message)
        onXoaSachGio() // Làm trống giỏ hàng
        navigate('/') // Đẩy khách về lại trang chủ
      })
      .catch(error => {
        alert('Có lỗi xảy ra khi đặt hàng!')
        console.error(error)
      })
  }

  if (gioHang.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-muted mb-4">Giỏ hàng của bạn đang trống</h3>
        <Link to="/" className="btn btn-primary btn-lg fw-bold">← Tiếp tục mua sắm</Link>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">🛒 GIỎ HÀNG CỦA BẠN</h2>
      <div className="row">
        
        {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
        <div className="col-md-7 mb-4">
          <ul className="list-group shadow-sm">
            {gioHang.map((sp, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center p-3">
                <div>
                  <h6 className="mb-1 fw-bold">{sp.ten_san_pham}</h6>
                  <small className="text-muted">Danh mục: {sp.ten_loai}</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="text-danger fw-bold me-4">
                    {Number(sp.gia_ban).toLocaleString('vi-VN')} đ
                  </span>
                  <button onClick={() => onXoaKhoiGio(index)} className="btn btn-sm btn-outline-danger">Xóa</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CỘT PHẢI: FORM THANH TOÁN */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0 bg-light p-3">
            <div className="card-body">
              <h5 className="card-title fw-bold border-bottom pb-2 mb-3">THÔNG TIN GIAO HÀNG</h5>
              
              <form onSubmit={handleDatHang}>
                <div className="mb-3">
                  <label className="form-label">Họ và tên</label>
                  <input type="text" className="form-control" required
                    value={khachHang.ho_ten}
                    onChange={(e) => setKhachHang({...khachHang, ho_ten: e.target.value})} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input type="tel" className="form-control" required
                    value={khachHang.so_dien_thoai}
                    onChange={(e) => setKhachHang({...khachHang, so_dien_thoai: e.target.value})} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ nhận hàng</label>
                  <textarea className="form-control" rows="2" required
                    value={khachHang.dia_chi}
                    onChange={(e) => setKhachHang({...khachHang, dia_chi: e.target.value})} 
                  ></textarea>
                </div>

                <div className="d-flex justify-content-between mb-4 mt-4 border-top pt-3">
                  <span>Tổng thanh toán:</span>
                  <h4 className="text-danger fw-bold mb-0">
                    {tongTien.toLocaleString('vi-VN')} đ
                  </h4>
                </div>
                <button type="submit" className="btn btn-success w-100 btn-lg fw-bold text-uppercase">
                  Xác nhận Đặt hàng
                </button>
              </form>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart