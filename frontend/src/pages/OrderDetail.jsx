import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function OrderDetail() {
  const { id } = useParams() // Lấy ID đơn hàng từ thanh địa chỉ (URL)
  const [donHang, setDonHang] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gọi API lấy dữ liệu của 1 đơn hàng
    axios.get(`http://127.0.0.1:8000/api/don-hang/${id}/`)
      .then(res => {
        setDonHang(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err)
        setLoading(false)
      })
  }, [id])

  const formatNgay = (chuoiNgay) => {
    const date = new Date(chuoiNgay)
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="text-center mt-5 py-5"><div className="spinner-border text-primary"></div></div>
  }

  if (!donHang) {
    return <div className="text-center mt-5 py-5"><h4>Không tìm thấy đơn hàng này!</h4></div>
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            
            <div className="card-header bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold">Chi tiết đơn hàng #{donHang.id}</h4>
              <span className="badge bg-info px-3 py-2 fs-6">{donHang.trang_thai}</span>
            </div>
            
            <div className="card-body p-4">
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="text-muted text-uppercase mb-3">Thông tin nhận hàng</h6>
                  <p className="mb-1 fw-bold">{donHang.khach_hang.ho_ten}</p>
                  <p className="mb-1">{donHang.khach_hang.so_dien_thoai}</p>
                  <p className="mb-0">{donHang.khach_hang.dia_chi}</p>
                </div>
                <div className="col-md-6 text-md-end">
                  <h6 className="text-muted text-uppercase mb-3">Ngày đặt hàng</h6>
                  <p className="fw-bold">{formatNgay(donHang.ngay_dat_hang)}</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-end">Đơn giá</th>
                      <th className="text-end">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donHang.chi_tiet.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '60px', height: '60px', flexShrink: 0, borderRadius: '8px', border: '1px solid #eaeaea', background: '#fff', padding: '4px' }}>
                              <img src={item.hinh_anh || "https://via.placeholder.com/60"} alt={item.ten_san_pham} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div className="fw-bold text-primary">{item.ten_san_pham}</div>
                          </div>
                        </td>
                        <td className="text-center align-middle">{item.so_luong}</td>
                        <td className="text-end align-middle">{Number(item.don_gia).toLocaleString('vi-VN')} ₫</td>
                        <td className="text-end fw-bold align-middle">
                          {(Number(item.don_gia) * item.so_luong).toLocaleString('vi-VN')} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end fw-bold fs-5 pt-3">Tổng thanh toán:</td>
                      <td className="text-end text-danger fw-bold fs-5 pt-3">{Number(donHang.tong_tien).toLocaleString('vi-VN')} ₫</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="card-footer bg-white border-0 py-4 text-center">
              <Link to="/lich-su" className="btn btn-outline-secondary px-4 rounded-pill">
                <i className="fa-solid fa-arrow-left me-2"></i>Quay lại lịch sử
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail