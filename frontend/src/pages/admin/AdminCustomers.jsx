import { useState, useEffect } from 'react'
import axios from 'axios'

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/khach-hang/')
      .then(res => {
        setCustomers(res.data)
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-0">Danh sách Khách hàng</h2>
        <p className="text-muted mt-1">Hệ thống tự động ghi nhận thông tin khách hàng từ các đơn đặt hàng. Dữ liệu này chỉ được phép XEM để bảo vệ thông tin thanh toán.</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Họ và Tên</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ giao hàng mặc định</th>
                    <th className="pe-4 text-center">Lịch sử mua</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((kh) => (
                    <tr key={kh.id}>
                      <td className="ps-4 fw-bold text-muted">#KH{kh.id.toString().padStart(3, '0')}</td>
                      <td className="fw-bold text-primary">{kh.ho_ten}</td>
                      <td className="fw-semibold">{kh.so_dien_thoai}</td>
                      <td className="text-muted small">{kh.dia_chi}</td>
                      <td className="pe-4 text-center">
                        <span className="badge bg-info rounded-pill">{kh.so_don_hang} đơn hàng</span>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">Chưa có khách hàng nào trong hệ thống.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminCustomers