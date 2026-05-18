import { Link } from 'react-router-dom'

function Cart({ gioHang, onXoaKhoiGio, onTangSoLuong, onGiamSoLuong }) {
  const tongTien = gioHang.reduce((total, item) => total + (Number(item.gia_ban) * item.so_luong), 0)

  // Hàm fix lỗi gãy ảnh
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  if (gioHang.length === 0) {
    return (
      <div className="container text-center py-5 mt-5">
        <i className="fa-solid fa-cart-shopping text-muted mb-3" style={{fontSize: '5rem', opacity: '0.5'}}></i>
        <h3 className="fw-bold mt-3">Giỏ hàng của bạn đang trống</h3>
        <p className="text-muted mb-4">Hãy chọn thêm sản phẩm để mua sắm nhé!</p>
        <Link to="/tat-ca-san-pham" className="btn btn-orange fw-bold px-5 py-3 rounded-pill shadow-sm">
          <i className="fa-solid fa-arrow-left me-2"></i>TIẾP TỤC MUA SẮM
        </Link>
      </div>
    )
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="fw-bold mb-4"><i className="fa-solid fa-cart-shopping text-orange me-2"></i>Giỏ hàng của bạn</h2>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold">Danh sách sản phẩm ({gioHang.length})</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Sản phẩm</th>
                      <th>Đơn giá</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-end pe-4">Thành tiền</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {gioHang.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3 py-2">
                            <div className="border rounded-3 p-1" style={{width: '60px', height: '60px', background: '#fff'}}>
                              <img src={getImageUrl(item.hinh_anh)} alt={item.ten_san_pham} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                            </div>
                            <Link to={`/san-pham/${item.id}`} className="fw-bold text-dark text-decoration-none text-truncate" style={{maxWidth: '200px'}}>
                              {item.ten_san_pham}
                            </Link>
                          </div>
                        </td>
                        <td className="fw-semibold text-muted">{Number(item.gia_ban).toLocaleString('vi-VN')} ₫</td>
                        <td>
                          <div className="d-flex justify-content-center align-items-center">
                            <button onClick={() => onGiamSoLuong(item.id)} className="btn btn-sm btn-outline-secondary rounded-circle" style={{width: '30px', height: '30px'}}><i className="fa-solid fa-minus"></i></button>
                            <span className="mx-3 fw-bold">{item.so_luong}</span>
                            <button onClick={() => onTangSoLuong(item.id)} className="btn btn-sm btn-outline-secondary rounded-circle" style={{width: '30px', height: '30px'}}><i className="fa-solid fa-plus"></i></button>
                          </div>
                        </td>
                        <td className="text-end pe-4 fw-bold text-orange">
                          {(Number(item.gia_ban) * item.so_luong).toLocaleString('vi-VN')} ₫
                        </td>
                        <td className="text-end pe-3">
                          <button onClick={() => onXoaKhoiGio(item.id)} className="btn btn-sm btn-light text-danger rounded-circle" title="Xóa">
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{top: '100px'}}>
            <div className="card-body p-4">
              <h4 className="fw-bold border-bottom pb-3 mb-4">Tổng Giỏ Hàng</h4>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Tạm tính:</span>
                <span className="fw-bold">{tongTien.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
                <span className="text-muted">Phí vận chuyển:</span>
                <span className="fw-bold text-success">Miễn phí</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5 fw-bold">Tổng cộng:</span>
                <span className="fs-4 fw-bold text-orange">{tongTien.toLocaleString('vi-VN')} ₫</span>
              </div>
              <Link to="/thanh-toan" className="btn btn-orange w-100 fw-bold py-3 rounded-pill shadow-sm">
                <i className="fa-solid fa-credit-card me-2"></i>TIẾN HÀNH THANH TOÁN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart