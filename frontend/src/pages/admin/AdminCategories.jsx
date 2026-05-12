import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  
  // States để xử lý tính năng "Sửa trực tiếp trên bảng" (Inline Edit)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  // 1. Tải danh sách
  const fetchCategories = () => {
    axios.get('https://computershop-api-gbkm.onrender.com/api/loai-hang/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => { fetchCategories() }, [])

  // 2. Thêm mới
  const handleAdd = (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    axios.post('https://computershop-api-gbkm.onrender.com/api/loai-hang/them/', { ten_loai: newCategory })
      .then(() => {
        toast.success("Đã thêm danh mục mới!")
        setNewCategory('')
        fetchCategories()
      })
      .catch(() => toast.error("Có lỗi xảy ra!"))
  }

  // 3. Xóa
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này? (Sẽ xóa luôn các sản phẩm bên trong nếu có liên kết CASCADE)")) {
      axios.delete(`https://computershop-api-gbkm.onrender.com/api/loai-hang/${id}/xoa/`)
        .then(() => {
          toast.info("Đã xóa danh mục")
          fetchCategories()
        })
        .catch(() => toast.error("Không thể xóa. Có thể danh mục đang chứa sản phẩm!"))
    }
  }

  // 4. Bật chế độ Sửa
  const startEdit = (cat) => {
    setEditingId(cat.id)
    setEditName(cat.ten_loai)
  }

  // 5. Lưu kết quả Sửa
  const saveEdit = (id) => {
    axios.patch(`https://computershop-api-gbkm.onrender.com/api/loai-hang/${id}/sua/`, { ten_loai: editName })
      .then(() => {
        toast.success("Đã cập nhật tên danh mục!")
        setEditingId(null) // Tắt chế độ sửa
        fetchCategories()
      })
      .catch(() => toast.error("Cập nhật thất bại!"))
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Quản lý Loại hàng (Danh mục)</h2>

      <div className="row g-4">
        {/* CỘT TRÁI: FORM THÊM MỚI */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 position-sticky" style={{ top: '80px' }}>
            <div className="card-header bg-white py-3 fw-bold">
              <i className="fa-solid fa-folder-plus text-primary me-2"></i>Thêm Danh Mục Mới
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">TÊN LOẠI HÀNG</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="VD: Laptop Gaming, Chuột Không Dây..." 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  <i className="fa-solid fa-plus me-2"></i> THÊM NGAY
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG DANH SÁCH */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4" style={{width: '10%'}}>ID</th>
                    <th style={{width: '60%'}}>Tên Danh Mục</th>
                    <th className="pe-4 text-end" style={{width: '30%'}}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="ps-4 fw-bold text-muted">#{cat.id}</td>
                      
                      {/* Hiển thị Input nếu đang sửa, ngược lại hiển thị Text */}
                      <td>
                        {editingId === cat.id ? (
                          <input 
                            type="text" 
                            className="form-control form-control-sm border-primary" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                          />
                        ) : (
                          <span className="fw-bold">{cat.ten_loai}</span>
                        )}
                      </td>

                      <td className="pe-4 text-end">
                        {editingId === cat.id ? (
                          <>
                            <button onClick={() => saveEdit(cat.id)} className="btn btn-sm btn-success me-2">Lưu</button>
                            <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary">Hủy</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(cat)} className="btn btn-sm btn-outline-info me-2" title="Sửa">
                              <i className="fa-solid fa-pen"></i>
                            </button>
                            <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-outline-danger" title="Xóa">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted">Chưa có danh mục nào. Hãy thêm ở form bên trái!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCategories