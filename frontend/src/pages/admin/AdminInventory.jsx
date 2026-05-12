import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function AdminInventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Tận dụng lại API danh sách sản phẩm đã có sẵn
    axios.get('https://computershop-api-gbkm.onrender.com/api/san-pham/')
      .then(res => {
        // MẸO UX: Sắp xếp tự động - Món nào tồn kho ít nhất sẽ nổi lên đầu bảng
        const sortedData = res.data.sort((a, b) => a.ton_kho - b.ton_kho)
        setInventory(sortedData)
        setLoading(false)
      })
      .catch(err => {
        console.error("Lỗi tải kho:", err)
        setLoading(false)
      })
  }, [])

  // Hàm xử lý link ảnh (Tái sử dụng để ảnh không bị gãy)
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/50x50?text=No+Image";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) {
      cleanPath = '/media' + cleanPath;
    }
    return `https://computershop-api-gbkm.onrender.com${cleanPath}`;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Tồn Kho Hiện Tại</h2>
        <Link to="/admin/nhap-hang/tao" className="btn btn-primary fw-bold shadow-sm">
          <i className="fa-solid fa-truck-fast me-2"></i> Nhập Hàng Ngay
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
                    <th className="ps-4">Ảnh</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Giá Bán</th>
                    <th className="text-center">Số Lượng Tồn</th>
                    <th className="pe-4 text-end">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((sp) => {
                    // LOGIC CẢNH BÁO: Kiểm tra tồn kho dưới 5
                    const isLowStock = sp.ton_kho < 5;
                    const isOutOfStock = sp.ton_kho === 0;

                    return (
                      <tr key={sp.id} className={isLowStock ? "table-warning" : ""}>
                        <td className="ps-4">
                          <img 
                            src={getImageUrl(sp.hinh_anh)} 
                            alt={sp.ten_san_pham} 
                            style={{width: '50px', height: '50px', objectFit: 'contain', borderRadius: '5px'}} 
                          />
                        </td>
                        <td className="fw-bold">{sp.ten_san_pham}</td>
                        <td className="text-muted">{Number(sp.gia_ban).toLocaleString()} ₫</td>
                        
                        {/* Cột hiển thị số lượng */}
                        <td className="text-center fw-bold fs-5">
                          <span className={isLowStock ? "text-danger" : "text-success"}>
                            {sp.ton_kho}
                          </span>
                        </td>
                        
                        {/* Cột hiển thị Badge cảnh báo */}
                        <td className="pe-4 text-end">
                          {isOutOfStock ? (
                            <span className="badge bg-danger p-2"><i className="fa-solid fa-triangle-exclamation me-1"></i> Hết Hàng</span>
                          ) : isLowStock ? (
                            <span className="badge bg-warning text-dark p-2"><i className="fa-solid fa-bell me-1"></i> Sắp Hết </span>
                          ) : (
                            <span className="badge bg-success p-2"><i className="fa-solid fa-check me-1"></i> Ổn Định</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}

                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">Kho hàng đang trống.</td>
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

export default AdminInventory