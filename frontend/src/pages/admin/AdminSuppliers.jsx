import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [formData, setFormData] = useState({ ten_nha_cung_cap: '', so_dien_thoai: '', dia_chi: '' })
  
  // States cho tính năng Edit
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ ten_nha_cung_cap: '', so_dien_thoai: '', dia_chi: '' })

  const fetchSuppliers = () => {
    axios.get('http://127.0.0.1:8000/api/nha-cung-cap/')
      .then(res => setSuppliers(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => { fetchSuppliers() }, [])

  const handleAdd = (e) => {
    e.preventDefault()
    if (!formData.ten_nha_cung_cap.trim()) return

    axios.post('http://127.0.0.1:8000/api/nha-cung-cap/them/', formData)
      .then(() => {
        toast.success("Đã thêm nhà cung cấp mới!")
        setFormData({ ten_nha_cung_cap: '', so_dien_thoai: '', dia_chi: '' })
        fetchSuppliers()
      })
      .catch(() => toast.error("Có lỗi xảy ra!"))
  }

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này?")) {
      axios.delete(`http://127.0.0.1:8000/api/nha-cung-cap/${id}/xoa/`)
        .then(() => {
          toast.info("Đã xóa nhà cung cấp")
          fetchSuppliers()
        })
        .catch(() => toast.error("Không thể xóa. Đang có dữ liệu liên quan!"))
    }
  }

  const startEdit = (ncc) => {
    setEditingId(ncc.id)
    setEditData({ ten_nha_cung_cap: ncc.ten_nha_cung_cap, so_dien_thoai: ncc.so_dien_thoai, dia_chi: ncc.dia_chi })
  }

  const saveEdit = (id) => {
    axios.patch(`http://127.0.0.1:8000/api/nha-cung-cap/${id}/sua/`, editData)
      .then(() => {
        toast.success("Cập nhật thành công!")
        setEditingId(null)
        fetchSuppliers()
      })
      .catch(() => toast.error("Cập nhật thất bại!"))
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Quản lý Nhà Cung Cấp</h2>

      <div className="row g-4">
        {/* CỘT TRÁI: FORM THÊM MỚI */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 position-sticky" style={{ top: '80px' }}>
            <div className="card-header bg-white py-3 fw-bold">
              <i className="fa-solid fa-building text-primary me-2"></i>Thêm Nhà Cung Cấp
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">TÊN NHÀ CUNG CẤP (*)</label>
                  <input type="text" className="form-control" required placeholder="VD: Công ty DELL VN"
                    value={formData.ten_nha_cung_cap} onChange={e => setFormData({...formData, ten_nha_cung_cap: e.target.value})} />
                </div>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">SỐ ĐIỆN THOẠI</label>
                  <input type="text" className="form-control" placeholder="0123..."
                    value={formData.so_dien_thoai} onChange={e => setFormData({...formData, so_dien_thoai: e.target.value})} />
                </div>
                <div className="mb-4">
                  <label className="form-label text-muted small fw-bold">ĐỊA CHỈ</label>
                  <textarea className="form-control" rows="2" placeholder="Nhập địa chỉ..."
                    value={formData.dia_chi} onChange={e => setFormData({...formData, dia_chi: e.target.value})}></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100 fw-bold">
                  <i className="fa-solid fa-plus me-2"></i> THÊM MỚI
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG DANH SÁCH */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Tên NCC</th>
                      <th>Liên hệ</th>
                      <th className="pe-4 text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {suppliers.map((ncc) => (
                      <tr key={ncc.id}>
                        <td className="ps-4">
                          {editingId === ncc.id ? (
                            <input type="text" className="form-control form-control-sm border-primary" value={editData.ten_nha_cung_cap} onChange={e => setEditData({...editData, ten_nha_cung_cap: e.target.value})} />
                          ) : <span className="fw-bold">{ncc.ten_nha_cung_cap}</span>}
                        </td>
                        
                        <td>
                          {editingId === ncc.id ? (
                            <>
                              <input type="text" className="form-control form-control-sm mb-1" placeholder="SĐT" value={editData.so_dien_thoai} onChange={e => setEditData({...editData, so_dien_thoai: e.target.value})} />
                              <input type="text" className="form-control form-control-sm" placeholder="Địa chỉ" value={editData.dia_chi} onChange={e => setEditData({...editData, dia_chi: e.target.value})} />
                            </>
                          ) : (
                            <>
                              <div className="small text-dark"><i className="fa-solid fa-phone me-1 text-muted"></i> {ncc.so_dien_thoai || 'Trống'}</div>
                              <div className="small text-muted"><i className="fa-solid fa-location-dot me-1"></i> {ncc.dia_chi || 'Trống'}</div>
                            </>
                          )}
                        </td>

                        <td className="pe-4 text-end">
                          {editingId === ncc.id ? (
                            <>
                              <button onClick={() => saveEdit(ncc.id)} className="btn btn-sm btn-success me-1">Lưu</button>
                              <button onClick={() => setEditingId(null)} className="btn btn-sm btn-secondary">Hủy</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(ncc)} className="btn btn-sm btn-outline-info me-2" title="Sửa"><i className="fa-solid fa-pen"></i></button>
                              <button onClick={() => handleDelete(ncc.id)} className="btn btn-sm btn-outline-danger" title="Xóa"><i className="fa-solid fa-trash"></i></button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                    {suppliers.length === 0 && (
                      <tr><td colSpan="3" className="text-center py-4 text-muted">Chưa có nhà cung cấp nào.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSuppliers