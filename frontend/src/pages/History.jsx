import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function History() {
  const [dsDonHang, setDsDonHang] = useState([])
  const [loading, setLoading] = useState(true)
  const username = localStorage.getItem('username')
  const navigate = useNavigate()

  useEffect(() => {
    if (!username) {
      toast.warning("Vui lòng đăng nhập để xem đơn hàng của bạn!")
      navigate('/dang-nhap')
      return
    }

    // Truyền username lên Backend để lấy ĐÚNG đơn hàng của người này
    axios.get(`http://127.0.0.1:8000/api/lich-su-don-hang/?username=${username}`)
      .then(res => {
        setDsDonHang(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi khi tải đơn hàng:", err)
        setLoading(false)
      })
  }, [username, navigate])

  const formatNgay = (chuoiNgay) => {
    const date = new Date(chuoiNgay)
    return date.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  // Cấu hình màu sắc rực rỡ cho Trạng thái
  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Chờ xác nhận': case 'Chờ xử lý': return <span className="text-warning fw-bold"><i className="fa-solid fa-clock me-1"></i>CHỜ XÁC NHẬN</span>
      case 'Đang chuẩn bị hàng': return <span className="text-secondary fw-bold"><i className="fa-solid fa-box me-1"></i>ĐANG CHUẨN BỊ</span>
      case 'Đang giao hàng': case 'Đang giao': return <span className="text-info fw-bold"><i className="fa-solid fa-truck-fast me-1"></i>ĐANG GIAO HÀNG</span>
      case 'Hoàn thành': case 'Đã giao': return <span className="text-success fw-bold"><i className="fa-solid fa-check-circle me-1"></i>HOÀN THÀNH</span>
      case 'Đã hủy': return <span className="text-danger fw-bold"><i className="fa-solid fa-circle-xmark me-1"></i>ĐÃ HỦY</span>
      case 'Giao thất bại / Hoàn hàng': return <span className="text-dark fw-bold"><i className="fa-solid fa-rotate-left me-1"></i>HOÀN HÀNG</span>
      default: return <span className="text-dark fw-bold">{status}</span>
    }
  }

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/80x80?text=No+Image";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    return `http://127.0.0.1:8000${cleanPath.startsWith('/media/') ? cleanPath : '/media' + cleanPath}`;
  };

  if (loading) {
    return <div className="container mt-5 text-center py-5"><div className="spinner-border text-orange"></div></div>
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <h2 className="fw-bold mb-4 text-dark">
            <i className="fa-solid fa-clipboard-list me-2 text-orange"></i>Đơn hàng của tôi
          </h2>
          
          {dsDonHang.length > 0 ? (
            dsDonHang.map((dh) => (
              <div key={dh.id} className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                
                {/* HEADER ĐƠN HÀNG */}
                <div className="card-header bg-light border-bottom d-flex justify-content-between align-items-center py-3 px-4">
                  <div className="fw-bold text-muted small">
                    <span className="me-3">MÃ ĐƠN: <span className="text-dark">#{dh.id}</span></span>
                    <span>NGÀY ĐẶT: <span className="text-dark">{formatNgay(dh.ngay_dat_hang)}</span></span>
                  </div>
                  <div>{getStatusDisplay(dh.trang_thai)}</div>
                </div>

                {/* DANH SÁCH SẢN PHẨM TRONG ĐƠN */}
                {/* DANH SÁCH SẢN PHẨM TRONG ĐƠN (ĐÃ GIỚI HẠN) */}
                <div className="card-body px-4 py-2">
                  {/* Dùng .slice(0, 2) để chỉ lấy tối đa 2 sản phẩm đầu tiên hiển thị */}
                  {dh.chi_tiet && dh.chi_tiet.slice(0, 2).map((item, index) => (
                    <div key={index} className="d-flex align-items-center py-3 border-bottom border-light">
                      <div className="border rounded p-1 me-3 flex-shrink-0" style={{width: '80px', height: '80px', backgroundColor: '#fff'}}>
                        <img src={getImageUrl(item.hinh_anh)} alt={item.ten_san_pham} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold text-dark mb-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.ten_san_pham}
                        </h6>
                        <div className="text-muted small">x{item.so_luong}</div>
                      </div>
                      <div className="fw-bold text-danger">
                        {Number(item.don_gia).toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  ))}

                  {/* NẾU ĐƠN HÀNG CÓ NHIỀU HƠN 2 SẢN PHẨM -> HIỆN DÒNG THÔNG BÁO TÓM TẮT */}
                  {dh.chi_tiet && dh.chi_tiet.length > 2 && (
                    <div className="text-center py-3 border-bottom border-light">
                      <span className="text-muted small fw-semibold fst-italic">
                        ... và {dh.chi_tiet.length - 2} sản phẩm khác
                      </span>
                    </div>
                  )}
                </div>

                {/* FOOTER ĐƠN HÀNG (TỔNG TIỀN + NÚT) */}
                <div className="card-footer bg-white border-top-0 px-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div className="text-end text-md-start">
                    <span className="text-muted me-2">Thành tiền:</span>
                    <span className="fs-5 fw-bold text-orange">{Number(dh.tong_tien).toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <Link to={`/don-hang/${dh.id}`} className="btn btn-outline-orange fw-bold px-4 rounded-3">
                      Xem chi tiết
                    </Link>
                    {dh.trang_thai === 'Hoàn thành' && (
                      <button className="btn btn-orange fw-bold px-4 rounded-3">Mua lại</button>
                    )}
                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm border-0 mt-4">
              <div className="mb-4">
                <i className="fa-solid fa-box-open text-muted" style={{fontSize: '5rem', opacity: 0.3}}></i>
              </div>
              <h4 className="fw-bold text-dark mb-2">Chưa có đơn hàng nào</h4>
              <p className="text-muted mb-4">Bạn chưa từng đặt mua sản phẩm nào trên hệ thống.</p>
              <Link to="/" className="btn btn-orange px-5 py-3 fw-bold rounded-pill shadow-sm">
                Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History