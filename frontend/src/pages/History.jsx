import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function History() {
  const [dsDonHang, setDsDonHang] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Gọi API lấy danh sách đơn hàng (Giả sử bạn sẽ viết API này ở Django)
    // Tạm thời mình gọi một endpoint tượng trưng, bạn có thể đổi tên sau
    axios.get('http://127.0.0.1:8000/api/lich-su-don-hang/')
      .then(res => {
        setDsDonHang(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi khi tải đơn hàng:", err)
        setLoading(false)
      })
  }, [])

  // Hàm chuyển đổi chuỗi ngày tháng từ Django sang chuẩn Việt Nam
  const formatNgay = (chuoiNgay) => {
    const date = new Date(chuoiNgay)
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="container mt-5 text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        <div className="col-12">
          <h2 className="fw-bold mb-4">
            <i className="fa-solid fa-clipboard-list me-2 text-primary"></i>Lịch sử mua hàng
          </h2>
          
          {dsDonHang.length > 0 ? (
            <div className="table-responsive bg-white rounded-3 shadow-sm p-3 border">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ minWidth: '250px' }}>Sản Phẩm</th>
                    <th>Ngày Đặt</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {dsDonHang.map((dh) => (
                    <tr key={dh.id}>
                      <td>
                        <div style={{ maxWidth: '300px' }}>
                          {/* Lấy tối đa 2 sản phẩm đầu tiên để hiển thị */}
                          {dh.chi_tiet.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-truncate fw-semibold text-dark" title={item.ten_san_pham}>
                              • {item.ten_san_pham} <span className="text-muted fw-normal">(x{item.so_luong})</span>
                            </div>
                          ))}
                          
                          {/* Nếu có nhiều hơn 2 sản phẩm thì hiện dòng "... và X sản phẩm khác" */}
                          {dh.chi_tiet.length > 2 && (
                            <div className="text-muted small fst-italic mt-1">
                              ... và {dh.chi_tiet.length - 2} sản phẩm khác
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td>{formatNgay(dh.ngay_dat_hang)}</td>
                      
                      <td className="fw-bold text-danger">
                        {Number(dh.tong_tien).toLocaleString('vi-VN')} đ
                      </td>
                      
                      <td>
                        <span className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                          {dh.trang_thai || 'Đang xử lý'}
                        </span>
                      </td>
                      
                      <td>
                        <Link to={`/don-hang/${dh.id}`} className="btn btn-sm btn-outline-primary fw-bold px-3" style={{ borderRadius: '6px' }}>
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5 bg-white rounded-3 shadow-sm border border-light">
              <img src="https://cdn-icons-png.flaticon.com/512/2748/2748614.png" alt="No orders" style={{width: '120px', opacity: 0.5, marginBottom: '20px'}} />
              <h4 className="text-muted mb-3">Bạn chưa có đơn hàng nào!</h4>
              <Link to="/" className="btn btn-primary px-4 py-2 fw-bold" style={{ borderRadius: '8px' }}>
                Mua sắm ngay
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History