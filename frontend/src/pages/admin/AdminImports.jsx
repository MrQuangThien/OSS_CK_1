import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminImports() {
  const [imports, setImports] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchImports = () => {
    axios.get('https://computershop-api-gbkm.onrender.com/api/phieu-nhap/')
      .then(res => {
        setImports(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi tải phiếu nhập:", err)
        toast.error("Không thể tải dữ liệu nhập kho")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchImports()
  }, [])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Lịch sử Nhập hàng</h2>
        {/* Đã sửa thành thẻ Link để chuyển sang trang Tạo Phiếu */}
        <Link to="/admin/nhap-hang/tao" className="btn btn-primary fw-bold shadow-sm">
          <i className="fa-solid fa-plus me-2"></i>Tạo Phiếu Nhập Mới
        </Link>
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
                    <th className="ps-4">Mã Phiếu</th>
                    <th>Nhà Cung Cấp</th>
                    <th>Ngày Lập</th>
                    <th>Tổng Tiền</th>
                    <th className="pe-4 text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {imports.map((pn) => (
                    <tr key={pn.id}>
                      <td className="ps-4 fw-bold text-primary">PN-{pn.id.toString().padStart(4, '0')}</td>
                      <td className="fw-bold">{pn.nha_cung_cap}</td>
                      <td>{pn.ngay_nhap}</td>
                      <td className="fw-bold text-danger">
                        {Number(pn.tong_tien).toLocaleString()} ₫
                      </td>
                      <td className="pe-4 text-end">
                        {/* Đã sửa thành thẻ Link kèm theo ID của phiếu nhập */}
                        <Link to={`/admin/nhap-hang/${pn.id}`} className="btn btn-sm btn-outline-info rounded-pill px-3">
                          <i className="fa-solid fa-eye me-1"></i> Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {imports.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">
                        <i className="fa-solid fa-box-open fs-1 mb-3 text-light"></i>
                        <br />
                        Chưa có lịch sử nhập hàng nào.
                      </td>
                    </tr>
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

export default AdminImports