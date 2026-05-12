import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function AdminDashboard() {
  const [stats, setStats] = useState({
    donChoXuLy: 0,
    tongDoanhThu: 0,
    tongKhachHang: 0,
    spSapHet: 0
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gọi cùng lúc 3 API để gom dữ liệu thống kê
    Promise.all([
      axios.get('https://computershop-api-gbkm.onrender.com/api/lich-su-don-hang/'),
      axios.get('https://computershop-api-gbkm.onrender.com/api/khach-hang/'),
      axios.get('https://computershop-api-gbkm.onrender.com/api/san-pham/')
    ])
    .then(([resOrders, resCustomers, resProducts]) => {
      const orders = resOrders.data
      const customers = resCustomers.data
      const products = resProducts.data

      // 1. Tính số đơn đang chờ xử lý
      const donCho = orders.filter(o => o.trang_thai === 'Chờ xác nhận' || o.trang_thai === 'Chờ xử lý').length

      // 2. Tính tổng doanh thu (Chỉ cộng những đơn Đã giao/Hoàn thành)
      const doanhThu = orders
        .filter(o => o.trang_thai === 'Hoàn thành' || o.trang_thai === 'Đã giao')
        .reduce((sum, o) => sum + Number(o.tong_tien), 0)

      // 3. Đếm sản phẩm sắp hết hàng (Tồn kho <= 5)
      const sapHet = products.filter(p => p.ton_kho <= 5).length

      setStats({
        donChoXuLy: donCho,
        tongDoanhThu: doanhThu,
        tongKhachHang: customers.length,
        spSapHet: sapHet
      })

      // 4. Lấy 5 đơn hàng mới nhất cho bảng bên dưới
      setRecentOrders(orders.slice(0, 5))
      setLoading(false)
    })
    .catch(err => {
      console.error("Lỗi tải dữ liệu Dashboard:", err)
      setLoading(false)
    })
  }, [])

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Chờ xác nhận': case 'Chờ xử lý': return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill">Chờ xác nhận</span>
      case 'Đang chuẩn bị hàng': return <span className="badge bg-secondary text-white px-2 py-1 rounded-pill">Đang chuẩn bị</span>
      case 'Đang giao hàng': case 'Đang giao': return <span className="badge bg-info text-dark px-2 py-1 rounded-pill">Đang giao</span>
      case 'Hoàn thành': case 'Đã giao': return <span className="badge bg-success px-2 py-1 rounded-pill">Hoàn thành</span>
      case 'Đã hủy': return <span className="badge bg-danger px-2 py-1 rounded-pill">Đã hủy</span>
      case 'Giao thất bại / Hoàn hàng': return <span className="badge bg-dark px-2 py-1 rounded-pill">Giao thất bại</span>
      default: return <span className="badge bg-dark px-2 py-1 rounded-pill">{status}</span>
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>

  return (
    <div>
      <h2 className="fw-bold mb-4 text-dark">Bảng điều khiển</h2>

      {/* 4 THẺ THỐNG KÊ */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-primary text-white position-relative overflow-hidden">
            <div className="card-body p-4">
              <h3 className="fw-bold display-6 mb-1">{stats.donChoXuLy}</h3>
              <p className="mb-0 fw-semibold opacity-75">Đơn chờ xử lý</p>
            </div>
            <i className="fa-solid fa-bell position-absolute opacity-25" style={{ fontSize: '4rem', bottom: '-10px', right: '10px' }}></i>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-success text-white position-relative overflow-hidden">
            <div className="card-body p-4">
              <h3 className="fw-bold fs-3 mb-1 mt-2">{stats.tongDoanhThu.toLocaleString()} ₫</h3>
              <p className="mb-0 fw-semibold opacity-75">Tổng doanh thu</p>
            </div>
            <i className="fa-solid fa-money-bill-wave position-absolute opacity-25" style={{ fontSize: '4rem', bottom: '-10px', right: '10px' }}></i>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-info text-white position-relative overflow-hidden">
            <div className="card-body p-4">
              <h3 className="fw-bold display-6 mb-1">{stats.tongKhachHang}</h3>
              <p className="mb-0 fw-semibold opacity-75">Khách hàng đăng ký</p>
            </div>
            <i className="fa-solid fa-users position-absolute opacity-25" style={{ fontSize: '4rem', bottom: '-10px', right: '10px' }}></i>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-danger text-white position-relative overflow-hidden">
            <div className="card-body p-4">
              <h3 className="fw-bold display-6 mb-1">{stats.spSapHet}</h3>
              <p className="mb-0 fw-semibold opacity-75">Sản phẩm sắp hết</p>
            </div>
            <i className="fa-solid fa-triangle-exclamation position-absolute opacity-25" style={{ fontSize: '4rem', bottom: '-10px', right: '10px' }}></i>
          </div>
        </div>
      </div>

      {/* BẢNG ĐƠN HÀNG GẦN ĐÂY */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-header bg-white py-3 fw-bold border-bottom d-flex justify-content-between align-items-center">
          <span><i className="fa-solid fa-clock-rotate-left text-primary me-2"></i>Đơn hàng vừa cập nhật</span>
          <Link to="/admin/don-hang" className="btn btn-sm btn-outline-primary fw-bold">Xem tất cả</Link>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th className="ps-4 py-3">Mã ĐH</th>
                  <th className="py-3">Khách hàng</th>
                  <th className="py-3">Thời gian</th>
                  <th className="py-3">Tổng tiền</th>
                  <th className="py-3">Trạng thái</th>
                  <th className="pe-4 py-3 text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                    <td className="fw-bold text-dark">{order.khach_hang?.ho_ten || "Khách vãng lai"}</td>
                    <td className="text-muted small">
                      {order.ngay_dat_hang ? new Date(order.ngay_dat_hang).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                    </td>
                    <td className="text-danger fw-bold">{Number(order.tong_tien).toLocaleString()} ₫</td>
                    <td>{getStatusBadge(order.trang_thai)}</td>
                    <td className="text-end pe-4">
                      <Link to={`/admin/don-hang/${order.id}`} className="btn btn-sm btn-light border fw-bold text-primary shadow-sm">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">Chưa có đơn hàng nào trong hệ thống.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard