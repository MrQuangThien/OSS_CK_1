import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("")

  const fetchOrderDetail = () => {
    axios.get(`http://127.0.0.1:8000/api/chi-tiet-don-hang/${id}/`)
      .then(res => {
        setOrder(res.data)
        setStatus(res.data.trang_thai)
        setLoading(false)
      })
      .catch(err => {
        // Bắt lỗi chính xác từ backend gửi về hoặc báo lỗi URL
        console.error("LỖI API:", err);
        const errorMsg = err.response?.data?.error || "Không tìm thấy API (Lỗi 404)! Vui lòng kiểm tra urls.py";
        toast.error(`❌ ${errorMsg}`);
        navigate('/admin/don-hang');
      })
  }

  useEffect(() => { fetchOrderDetail() }, [id])

  const handleUpdateStatus = (e) => {
    e.preventDefault()
    axios.patch(`http://127.0.0.1:8000/api/don-hang/${id}/status/`, { trang_thai: status })
      .then(() => {
        toast.success("Cập nhật trạng thái thành công!")
        fetchOrderDetail()
      })
      .catch(err => toast.error("Có lỗi xảy ra!"))
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>

  const isClosed = ['Hoàn thành', 'Đã hủy', 'Giao thất bại / Hoàn hàng'].includes(order.trang_thai)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"><i className="fa-solid fa-file-invoice-dollar me-2 text-primary"></i>Chi tiết Đơn hàng #{order.id}</h2>
        <Link to="/admin/don-hang" className="btn btn-outline-secondary"><i className="fa-solid fa-arrow-left me-2"></i>Quay lại danh sách</Link>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4 shadow-sm border-0 rounded-4">
            <div className="card-header bg-white fw-bold py-3 text-uppercase border-bottom">Thông tin Khách hàng</div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-sm-3 text-muted">Họ và tên:</div>
                <div className="col-sm-9 fw-bold text-dark">{order.khach_hang?.ho_ten || "Khách lẻ"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3 text-muted">Số điện thoại:</div>
                <div className="col-sm-9 fw-bold text-primary">{order.khach_hang?.so_dien_thoai || "Chưa cung cấp"}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3 text-muted">Địa chỉ giao:</div>
                <div className="col-sm-9">{order.khach_hang?.dia_chi || "Chưa cung cấp"}</div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="card-header bg-white fw-bold py-3 text-uppercase border-bottom">Danh sách Sản phẩm</div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3">Sản phẩm</th>
                      <th className="text-center py-3">Đơn giá</th>
                      <th className="text-center py-3">Số lượng</th>
                      <th className="text-end pe-4 py-3">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Đổi từ chitietdonhang_set thành items */}
                    {order.items?.map((item, idx) => {
                      
                      // Hàm xử lý link ảnh trực tiếp tại đây cho tiện
                      const getImg = (path) => {
                        if (!path) return "https://via.placeholder.com/50x50?text=No+Image";
                        if (path.startsWith('http')) return path;
                        let cleanPath = path.startsWith('/') ? path : '/' + path;
                        return `http://127.0.0.1:8000${cleanPath.startsWith('/media/') ? cleanPath : '/media' + cleanPath}`;
                      };

                      return (
                        <tr key={idx}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center gap-3 py-2">
                              {/* Cột hiển thị hình ảnh */}
                              <div style={{ width: '50px', height: '50px', flexShrink: 0, borderRadius: '8px', border: '1px solid #eaeaea', background: '#fff', padding: '3px' }}>
                                <img 
                                  src={getImg(item.san_pham?.hinh_anh)} 
                                  alt="SP" 
                                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                />
                              </div>
                              <div className="fw-bold text-dark">{item.san_pham?.ten_san_pham || 'Sản phẩm lỗi'}</div>
                            </div>
                          </td>
                          <td className="text-center text-muted">{Number(item.don_gia).toLocaleString()} đ</td>
                          <td className="text-center fw-bold fs-6">{item.so_luong_mua}</td>
                          <td className="text-end pe-4 fw-bold text-danger">{(Number(item.don_gia) * item.so_luong_mua).toLocaleString()} đ</td>
                        </tr>
                      )
                    })}
                    
                    {/* Nếu mảng rỗng thì hiện thông báo */}
                    {(!order.items || order.items.length === 0) && (
                      <tr><td colSpan="4" className="text-center py-4 text-muted">Đơn hàng này không có sản phẩm nào.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-light mb-4 border-0 shadow-sm rounded-4">
            <div className="card-body text-center py-4">
              <div className="text-muted mb-2 text-uppercase fw-bold" style={{fontSize: '0.85rem'}}>Tổng giá trị đơn hàng</div>
              <h2 className="text-danger fw-bold mb-0">{Number(order.tong_tien).toLocaleString()} đ</h2>
            </div>
          </div>

          <div className="card border-primary shadow-sm rounded-4">
            <div className="card-header bg-primary text-white fw-bold py-3 text-uppercase border-bottom">
              <i className="fa-solid fa-rotate me-2"></i>Cập nhật Trạng thái
            </div>
            <div className="card-body bg-white rounded-bottom-4">
              <form onSubmit={handleUpdateStatus}>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">TRẠNG THÁI XỬ LÝ ĐƠN HÀNG:</label>
                  <select 
                    className="form-select form-select-lg fw-bold border-primary shadow-none" 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    disabled={isClosed}
                  >
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</option>
                    <option value="Đang giao hàng">Đang giao hàng</option>
                    <option value="Hoàn thành">Hoàn thành (Đã nhận hàng)</option>
                    <option value="Giao thất bại / Hoàn hàng">Giao thất bại / Hoàn trả hàng</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>

                {isClosed ? (
                  <button type="button" className="btn btn-secondary w-100 fw-bold py-3 shadow-sm rounded-3" disabled>
                    <i className="fa-solid fa-lock me-2"></i>ĐƠN HÀNG ĐÃ ĐÓNG
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary w-100 fw-bold py-3 shadow-sm rounded-3">
                    <i className="fa-solid fa-floppy-disk me-2"></i>LƯU BƯỚC TIẾP THEO
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOrderDetail