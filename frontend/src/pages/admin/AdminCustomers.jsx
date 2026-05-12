import { useState, useEffect } from 'react'
import axios from 'axios'

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('https://computershop-api-gbkm.onrender.com/api/khach-hang/')
      .then(res => {
        setCustomers(res.data)
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold mb-0">Tài khoản Khách hàng</h2>
        <p className="text-muted mt-1">Danh sách tất cả các tài khoản thành viên đã đăng ký trên hệ thống của bạn.</p>
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
                    <th>Tên tài khoản</th>
                    <th>Email liên hệ</th>
                    <th>Phân quyền</th>
                    <th className="pe-4 text-center">Ngày đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((kh) => (
                    <tr key={kh.id}>
                      <td className="ps-4 fw-bold text-muted">#KH{kh.id.toString().padStart(3, '0')}</td>
                      <td className="fw-bold text-primary">
                        <i className="fa-solid fa-circle-user text-secondary me-2"></i>
                        {kh.username}
                      </td>
                      <td className="fw-semibold">{kh.email}</td>
                      <td><span className="badge bg-secondary">Khách hàng</span></td>
                      <td className="pe-4 text-center text-muted small">
                        {kh.ngay_tham_gia}
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-5 text-muted">Chưa có khách hàng nào đăng ký.</td></tr>
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