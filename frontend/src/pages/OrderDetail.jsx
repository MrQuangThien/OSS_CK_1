import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function OrderDetail() {
  const { id } = useParams()
  const [donHang, setDonHang] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hàm xử lý link ảnh để tránh bị gãy
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/80x80?text=No+Image";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `https://computershop-api-gbkm.onrender.com${cleanPath}`;
  };

  useEffect(() => {
    // Gọi API lấy dữ liệu chi tiết đơn hàng
    // (Lưu ý: Bạn có thể dùng /api/chi-tiet-don-hang/ hoặc /api/don-hang/ tùy theo urls.py của bạn)
    axios.get(`https://computershop-api-gbkm.onrender.com/api/chi-tiet-don-hang/${id}/`)
      .then(res => {
        setDonHang(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi khi tải chi tiết đơn hàng:", err)
        toast.error("Không thể tải thông tin đơn hàng!")
        setLoading(false)
      })
  }, [id])

  const formatNgay = (chuoiNgay) => {
    if (!chuoiNgay) return 'N/A'
    const date = new Date(chuoiNgay)
    return date.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  // Xác định bước hiện tại của đơn hàng để vẽ thanh Tiến độ
  const getStepIndex = (status) => {
    if (['Đã hủy', 'Giao thất bại / Hoàn hàng'].includes(status)) return -1;
    if (status === 'Chờ xác nhận' || status === 'Chờ xử lý') return 1;
    if (status === 'Đang chuẩn bị hàng') return 2;
    if (status === 'Đang giao hàng' || status === 'Đang giao') return 3;
    if (status === 'Hoàn thành' || status === 'Đã giao') return 4;
    return 1;
  }

  if (loading) {
    return <div className="text-center mt-5 py-5" style={{minHeight: '50vh'}}><div className="spinner-border text-orange"></div></div>
  }

  if (!donHang) {
    return (
      <div className="text-center mt-5 py-5" style={{minHeight: '50vh'}}>
        <i className="fa-solid fa-file-circle-xmark text-muted mb-3" style={{fontSize: '4rem', opacity: 0.5}}></i>
        <h4 className="text-dark fw-bold">Không tìm thấy đơn hàng này!</h4>
        <Link to="/lich-su" className="btn btn-orange mt-3 px-4 rounded-pill">Quay lại lịch sử</Link>
      </div>
    )
  }

  const step = getStepIndex(donHang.trang_thai);
  const isCancelled = step === -1;
  
  // Tương thích với cả 2 cách đặt tên mảng từ Backend
  const productList = donHang.items || donHang.chi_tiet || [];

  return (
    <div className="container mt-4 mb-5">
      
      {/* Nút quay lại */}
      <div className="mb-3">
        <Link to="/lich-su" className="text-decoration-none text-muted fw-bold transition-hover">
          <i className="fa-solid fa-chevron-left me-2"></i> Trở về danh sách đơn hàng
        </Link>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            
            {/* HEADER ĐƠN HÀNG */}
            <div className="card-header bg-white py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 px-4">
              <div>
                <h5 className="mb-1 fw-bold text-dark text-uppercase">Chi tiết đơn hàng <span className="text-orange">#{donHang.id}</span></h5>
                <span className="text-muted small">Ngày đặt: {formatNgay(donHang.ngay_dat_hang)}</span>
              </div>
              <div className="text-end">
                <span className="text-muted small me-2">TRẠNG THÁI:</span>
                <span className={`fw-bold fs-6 text-uppercase ${isCancelled ? 'text-danger' : 'text-orange'}`}>
                  {donHang.trang_thai}
                </span>
              </div>
            </div>
            
            {/* THANH TIẾN ĐỘ (STEPPER) */}
            <div className="card-body p-4 border-bottom bg-light">
              {isCancelled ? (
                <div className="text-center text-danger fw-bold py-3">
                  <i className="fa-solid fa-circle-xmark fs-1 mb-2"></i>
                  <p className="mb-0 fs-5">ĐƠN HÀNG ĐÃ BỊ HỦY HOẶC GIAO THẤT BẠI</p>
                </div>
              ) : (
                <div className="position-relative m-4">
                  <div className="progress" style={{height: '4px'}}>
                    <div className="progress-bar bg-orange" role="progressbar" style={{width: `${((step - 1) / 3) * 100}%`}}></div>
                  </div>
                  <div className="d-flex justify-content-between position-absolute top-50 start-0 w-100 translate-middle-y">
                    
                    <div className="text-center" style={{width: '60px', marginLeft: '-30px'}}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${step >= 1 ? 'bg-orange text-white' : 'bg-secondary text-white'}`} style={{width: '40px', height: '40px', border: '3px solid #fff'}}>
                        <i className="fa-solid fa-clipboard-check"></i>
                      </div>
                      <small className={`fw-bold ${step >= 1 ? 'text-dark' : 'text-muted'}`} style={{fontSize: '0.75rem'}}>Xác nhận</small>
                    </div>

                    <div className="text-center" style={{width: '60px'}}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${step >= 2 ? 'bg-orange text-white' : 'bg-secondary text-white opacity-50'}`} style={{width: '40px', height: '40px', border: '3px solid #fff'}}>
                        <i className="fa-solid fa-box-open"></i>
                      </div>
                      <small className={`fw-bold ${step >= 2 ? 'text-dark' : 'text-muted'}`} style={{fontSize: '0.75rem'}}>Chuẩn bị</small>
                    </div>

                    <div className="text-center" style={{width: '60px'}}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${step >= 3 ? 'bg-orange text-white' : 'bg-secondary text-white opacity-50'}`} style={{width: '40px', height: '40px', border: '3px solid #fff'}}>
                        <i className="fa-solid fa-truck-fast"></i>
                      </div>
                      <small className={`fw-bold ${step >= 3 ? 'text-dark' : 'text-muted'}`} style={{fontSize: '0.75rem'}}>Đang giao</small>
                    </div>

                    <div className="text-center" style={{width: '60px', marginRight: '-30px'}}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${step >= 4 ? 'bg-success text-white' : 'bg-secondary text-white opacity-50'}`} style={{width: '40px', height: '40px', border: '3px solid #fff'}}>
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <small className={`fw-bold ${step >= 4 ? 'text-success' : 'text-muted'}`} style={{fontSize: '0.75rem'}}>Hoàn thành</small>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <div className="card-body p-4">
              
              {/* KHỐI ĐỊA CHỈ NHẬN HÀNG */}
              <div className="address-box p-4 mb-4 rounded-3" style={{border: '2px dashed #ffbca8', backgroundColor: '#fffaf8'}}>
                <h6 className="text-orange fw-bold mb-3 d-flex align-items-center">
                  <i className="fa-solid fa-location-dot fs-5 me-2"></i> ĐỊA CHỈ NHẬN HÀNG
                </h6>
                <div className="ps-4">
                  <p className="mb-1 fw-bold text-dark fs-6">{donHang.khach_hang?.ho_ten || 'Khách hàng'}</p>
                  <p className="mb-1 text-muted small">{donHang.khach_hang?.so_dien_thoai || 'Chưa có SĐT'}</p>
                  <p className="mb-0 text-muted small">{donHang.khach_hang?.dia_chi || 'Chưa có địa chỉ'}</p>
                </div>
              </div>

              {/* DANH SÁCH SẢN PHẨM */}
              <h6 className="fw-bold mb-3 text-dark text-uppercase">Sản phẩm đã đặt</h6>
              <div className="table-responsive border rounded-3 mb-4">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4 py-3">Sản phẩm</th>
                      <th className="text-center py-3">Đơn giá</th>
                      <th className="text-center py-3">Số lượng</th>
                      <th className="text-end pe-4 py-3">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((item, index) => {
                      const tenSp = item.san_pham?.ten_san_pham || item.ten_san_pham || "Sản phẩm";
                      const hinhAnh = item.san_pham?.hinh_anh || item.hinh_anh;
                      const donGia = Number(item.don_gia);
                      const soLuong = item.so_luong_mua || item.so_luong;

                      return (
                        <tr key={index}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="border rounded p-1 flex-shrink-0" style={{ width: '70px', height: '70px', backgroundColor: '#fff' }}>
                                <img src={getImageUrl(hinhAnh)} alt={tenSp} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              </div>
                              <div className="fw-bold text-dark lh-base" style={{maxWidth: '300px'}}>{tenSp}</div>
                            </div>
                          </td>
                          <td className="text-center text-muted align-middle">{donGia.toLocaleString('vi-VN')} ₫</td>
                          <td className="text-center fw-bold align-middle">{soLuong}</td>
                          <td className="text-end pe-4 fw-bold text-danger align-middle">
                            {(donGia * soLuong).toLocaleString('vi-VN')} ₫
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* TỔNG KẾT TIỀN */}
              <div className="row justify-content-end">
                <div className="col-md-5 col-lg-4">
                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>Tạm tính:</span>
                    <span>{Number(donHang.tong_tien).toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3 small text-muted border-bottom pb-2">
                    <span>Phí vận chuyển:</span>
                    <span className="text-success">Miễn phí</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark fs-6">Thành tiền:</span>
                    <span className="fw-bold text-orange fs-3">{Number(donHang.tong_tien).toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-orange { background-color: var(--primary-orange) !important; }
        .text-orange { color: var(--primary-orange) !important; }
        .btn-orange { background-color: var(--primary-orange); color: white; border: none; }
        .btn-orange:hover { background-color: #e65c00; color: white; }
        .transition-hover:hover { color: var(--primary-orange) !important; }
      `}</style>
    </div>
  )
}

export default OrderDetail