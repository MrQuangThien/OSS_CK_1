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

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      axios.delete(`http://127.0.0.1:8000/api/san-pham/${id}/delete/`)
        .then(() => {
          toast.info("Đã xóa sản phẩm");
          fetchProducts();
        })
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Quản lý Sản phẩm</h2>
        <Link to="/admin/san-pham/them" className="btn btn-primary fw-bold">
          <i className="fa-solid fa-plus me-2"></i>Thêm sản phẩm mới
        </Link>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá bán</th>
                <th>Tồn kho</th>
                <th className="pe-4 text-end">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(sp => (
                <tr key={sp.id}>
                  <td className="ps-4">
                    <img
                      src={sp.hinh_anh ? (sp.hinh_anh.startsWith('http') ? sp.hinh_anh : `http://127.0.0.1:8000${sp.hinh_anh}`) : "https://via.placeholder.com/50"}
                      alt="Ảnh SP"
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />
                  </td>
                  <td className="fw-bold">{sp.ten_san_pham}</td>
                  <td className="text-danger fw-bold">{Number(sp.gia_ban).toLocaleString()} ₫</td>
                  <td><span className="badge bg-secondary">Kho: {sp.ton_kho}</span></td>
                  <td className="pe-4 text-end">
                    <Link to={`/admin/san-pham/sua/${sp.id}`} className="btn btn-sm btn-outline-info me-2">
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                    <button onClick={() => handleDelete(sp.id)} className="btn btn-sm btn-outline-danger"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminProducts