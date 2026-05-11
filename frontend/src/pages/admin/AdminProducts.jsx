import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

function AdminProducts() {
  const [products, setProducts] = useState([])

  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/san-pham/').then(res => setProducts(res.data))
  }

  useEffect(() => { fetchProducts() }, [])

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/50x50?text=No+Image";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      // ĐÃ SỬA CHỮ /xoa/ THÀNH /delete/
      axios.delete(`http://127.0.0.1:8000/api/san-pham/${id}/delete/`)
        .then(() => {
          toast.info("Đã xóa sản phẩm");
          fetchProducts();
        })
        .catch(() => toast.error("Có lỗi khi xóa!"))
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Quản lý Sản phẩm</h2>
        <Link to="/admin/san-pham/them" className="btn btn-primary fw-bold shadow-sm">
          <i className="fa-solid fa-plus me-2"></i>Thêm sản phẩm mới
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Ảnh</th>
                <th style={{ width: '30%' }}>Tên sản phẩm</th>
                <th>Nhãn</th> {/* CỘT NHÃN MỚI */}
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th className="pe-4 text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(sp => (
                <tr key={sp.id}>
                  <td className="ps-4">
                    <img src={getImageUrl(sp.hinh_anh)} alt="Ảnh SP" className="border rounded bg-white" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                  </td>
                  <td className="fw-bold">{sp.ten_san_pham}</td>
                  
                  {/* CỘT NHÃN */}
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {sp.la_san_pham_moi && <span className="badge bg-success" style={{fontSize: '0.65rem'}}>MỚI</span>}
                      {sp.la_san_pham_noi_bat && <span className="badge bg-danger" style={{fontSize: '0.65rem'}}>HOT</span>}
                      {!sp.la_san_pham_moi && !sp.la_san_pham_noi_bat && <span className="text-muted small">-</span>}
                    </div>
                  </td>

                  <td className="text-danger fw-bold">{Number(sp.gia_ban).toLocaleString()} ₫</td>
                  <td>
                    <span className={`badge ${sp.ton_kho > 0 ? 'bg-secondary' : 'bg-danger'}`}>
                      {sp.ton_kho > 0 ? `Kho: ${sp.ton_kho}` : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="pe-4 text-end">
                    <Link to={`/admin/san-pham/sua/${sp.id}`} className="btn btn-sm btn-outline-info me-2"><i className="fa-solid fa-pen"></i></Link>
                    <button onClick={() => handleDelete(sp.id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan="6" className="text-center py-4">Chưa có sản phẩm nào.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts