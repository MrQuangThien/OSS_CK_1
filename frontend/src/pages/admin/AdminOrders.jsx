import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [tuKhoa, setTuKhoa] = useState("")

  const fetchOrders = () => {
    axios.get('http://127.0.0.1:8000/api/lich-su-don-hang/')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => { fetchOrders() }, [])

  // Lọc đơn hàng ngay trên frontend cho nhanh
  const filteredOrders = orders.filter(order => {
    const searchStr = tuKhoa.toLowerCase()
    return (
      order.id.toString().includes(searchStr) ||
      (order.khach_hang?.ho_ten || '').toLowerCase().includes(searchStr) ||
      (order.khach_hang?.so_dien_thoai || '').includes(searchStr)
    )
  })

  // Hàm render Badge Trạng thái
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Chờ xác nhận': case 'Chờ xử lý': return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">Chờ xác nhận</span>
      case 'Đang chuẩn bị hàng': return <span className="badge bg-secondary text-white px-3 py-2 rounded-pill">Đang chuẩn bị</span>
      case 'Đang giao hàng': case 'Đang giao': return <span className="badge bg-info text-dark px-3 py-2 rounded-pill">Đang giao</span>
      case 'Hoàn thành': case 'Đã giao': return <span className="badge bg-success px-3 py-2 rounded-pill">Hoàn thành</span>
      case 'Đã hủy': return <span className="badge bg-danger px-3 py-2 rounded-pill">Đã hủy</span>
      case 'Giao thất bại / Hoàn hàng': return <span className="badge bg-dark px-3 py-2 rounded-pill">Giao thất bại</span>
      default: return <span className="badge bg-dark px-3 py-2 rounded-pill">{status}</span>
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0"><i className="fa-solid fa-list-check me-2 text-primary"></i>Danh sách Đơn hàng</h2>
        <Link to="/admin/pos" className="btn btn-success fw-bold shadow-sm d-flex align-items-center">
          <i className="fa-solid fa-plus me-2"></i> Tạo đơn tại quầy
        </Link>
      </div>

      <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px', background: '#f8f9fa' }}>
        <div className="card-body p-3">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small text-muted fw-bold mb-1"><i className="fa-solid fa-magnifying-glass me-1"></i>Tìm kiếm</label>
              <input type="text" className="form-control bg-white" placeholder="Mã đơn, Tên khách, SĐT..." 
                value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3">Mã Đơn</th>
                  <th className="py-3">Khách Hàng</th>
                  <th className="py-3">Ngày Đặt</th>
                  <th className="text-end py-3">Tổng Tiền</th>
                  <th className="text-center py-3">Trạng Thái</th>
                  <th className="text-center pe-4 py-3">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                    <td>
                      <div className="fw-bold text-dark">{order.khach_hang?.ho_ten || "Khách vãng lai"}</div>
                      <div className="small text-muted mt-1"><i className="fa-solid fa-phone fa-xs me-1"></i>{order.khach_hang?.so_dien_thoai || "Chưa cập nhật"}</div>
                    </td>
                    <td>
                      {/* Xử lý ngày tháng tạm thời nếu API trả về chuỗi ISO */}
                      <div className="fw-semibold">{order.ngay_dat_hang ? new Date(order.ngay_dat_hang).toLocaleDateString('vi-VN') : 'N/A'}</div>
                    </td>
                    <td className="text-end fw-bold text-danger fs-6">{Number(order.tong_tien).toLocaleString()} ₫</td>
                    <td className="text-center">{getStatusBadge(order.trang_thai)}</td>
                    <td className="text-center pe-4">
                      <Link to={`/admin/don-hang/${order.id}`} className="btn btn-sm btn-light border fw-bold text-primary shadow-sm">
                        <i className="fa-solid fa-pen-to-square me-1"></i> Xử lý
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">Chưa có đơn hàng nào khớp với tìm kiếm.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders