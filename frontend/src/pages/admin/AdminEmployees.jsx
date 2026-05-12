import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminEmployees() {
  const [employees, setEmployees] = useState([])
  const [formData, setFormData] = useState({ username: '', password: '', email: '', vai_tro: 'nhan_vien' })
  
  // BIẾN LƯU TRẠNG THÁI "CÓ ĐANG SỬA HAY KHÔNG"
  const [editingId, setEditingId] = useState(null)

  const fetchEmployees = () => {
    axios.get('https://computershop-api-gbkm.onrender.com/api/nhan-vien/').then(res => setEmployees(res.data))
  }

  useEffect(() => { fetchEmployees() }, [])

  // HÀM CHUNG CHO CẢ THÊM VÀ SỬA
  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      // ĐANG Ở CHẾ ĐỘ SỬA
      axios.patch(`https://computershop-api-gbkm.onrender.com/api/nhan-vien/${editingId}/sua/`, formData)
        .then(() => {
          toast.success("Cập nhật thông tin thành công!")
          cancelEdit() // Reset form
          fetchEmployees()
        })
        .catch(err => toast.error(err.response?.data?.error || "Có lỗi khi cập nhật!"))
    } else {
      // ĐANG Ở CHẾ ĐỘ THÊM MỚI
      axios.post('https://computershop-api-gbkm.onrender.com/api/nhan-vien/them/', formData)
        .then(() => {
          toast.success("Đã cấp tài khoản mới thành công!")
          cancelEdit() // Reset form
          fetchEmployees()
        })
        .catch(err => toast.error(err.response?.data?.error || "Có lỗi khi thêm!"))
    }
  }

  // HÀM KÍCH HOẠT CHẾ ĐỘ SỬA (KHI BẤM NÚT SỬA)
  const handleEditClick = (emp) => {
    let vai_tro_code = 'nhan_vien'
    if (emp.vai_tro === 'Admin') vai_tro_code = 'admin'
    if (emp.vai_tro === 'Quản lý') vai_tro_code = 'quan_ly'

    setFormData({
      username: emp.username,
      password: '', // Để trống, backend sẽ tự hiểu là không đổi pass
      email: emp.email,
      vai_tro: vai_tro_code
    })
    setEditingId(emp.id)
  }

  // HÀM HỦY SỬA (QUAY VỀ CHẾ ĐỘ THÊM)
  const cancelEdit = () => {
    setFormData({ username: '', password: '', email: '', vai_tro: 'nhan_vien' })
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (window.confirm("Cảnh báo: Bạn có chắc chắn muốn xóa nhân sự này không?")) {
      axios.delete(`https://computershop-api-gbkm.onrender.com/api/nhan-vien/${id}/xoa/`)
        .then(() => {
          toast.info("Đã xóa tài khoản nhân sự!")
          fetchEmployees()
        })
        .catch(err => toast.error(err.response?.data?.error || "Lỗi không thể xóa!"))
    }
  }

  const getRoleBadge = (role) => {
    if (role === 'Admin') return <span className="badge bg-danger">Quản trị viên (Admin)</span>
    if (role === 'Quản lý') return <span className="badge bg-warning text-dark">Quản lý Cửa hàng</span>
    return <span className="badge bg-success">Nhân viên</span>
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Quản lý Nhân sự</h2>

      <div className="row g-4">
        {/* CỘT TRÁI: FORM CẤP/SỬA TÀI KHOẢN */}
        <div className="col-lg-4">
          <div className={`card shadow-sm border-0 position-sticky ${editingId ? 'border-info border-2' : ''}`} style={{ top: '80px' }}>
            <div className={`card-header bg-white py-3 fw-bold ${editingId ? 'text-info' : 'text-primary'}`}>
              <i className={`fa-solid ${editingId ? 'fa-pen-to-square' : 'fa-user-plus'} me-2`}></i>
              {editingId ? 'Cập Nhật Tài Khoản' : 'Cấp Tài Khoản Mới'}
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">TÊN ĐĂNG NHẬP (*)</label>
                  <input type="text" className="form-control" required placeholder="VD: nhanvien_01"
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    disabled={editingId !== null} // KHÔNG CHO PHÉP SỬA USERNAME
                  />
                  {editingId && <small className="text-danger">Không thể thay đổi tên đăng nhập.</small>}
                </div>
                
                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">
                    {editingId ? 'MẬT KHẨU MỚI' : 'MẬT KHẨU (*)'}
                  </label>
                  <input type="password" className="form-control" placeholder={editingId ? "Bỏ trống nếu không đổi..." : "Tạo mật khẩu..."}
                    required={editingId === null} // Chỉ bắt buộc nhập khi Thêm mới
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-bold">EMAIL LIÊN HỆ</label>
                  <input type="email" className="form-control" placeholder="nguyenvana@gmail.com"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="mb-4 border rounded p-3 bg-light">
                  <label className="form-label text-dark fw-bold mb-3"><i className="fa-solid fa-shield-halved me-2"></i>CẤP QUYỀN TRUY CẬP</label>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" name="role" id="role1" 
                      checked={formData.vai_tro === 'nhan_vien'} onChange={() => setFormData({...formData, vai_tro: 'nhan_vien'})} />
                    <label className="form-check-label" htmlFor="role1">Nhân viên (Quyền cơ bản)</label>
                  </div>
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" name="role" id="role2" 
                      checked={formData.vai_tro === 'quan_ly'} onChange={() => setFormData({...formData, vai_tro: 'quan_ly'})} />
                    <label className="form-check-label" htmlFor="role2">Quản lý (Chỉnh sửa được SP)</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="role" id="role3" 
                      checked={formData.vai_tro === 'admin'} onChange={() => setFormData({...formData, vai_tro: 'admin'})} />
                    <label className="form-check-label text-danger fw-bold" htmlFor="role3">Admin (Toàn quyền)</label>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className={`btn ${editingId ? 'btn-info text-white' : 'btn-primary'} w-100 fw-bold py-2 shadow-sm`}>
                    <i className={`fa-solid ${editingId ? 'fa-save' : 'fa-check'} me-2`}></i> 
                    {editingId ? 'LƯU THAY ĐỔI' : 'TẠO TÀI KHOẢN'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="btn btn-light border fw-bold shadow-sm">Hủy</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG DANH SÁCH NHÂN VIÊN */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Tài khoản</th>
                      <th>Email liên hệ</th>
                      <th>Quyền hạn</th>
                      <th>Ngày tham gia</th>
                      <th className="pe-4 text-end">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id}>
                        <td className="ps-4 fw-bold">
                          <i className="fa-solid fa-circle-user text-secondary fs-4 me-2 align-middle"></i>
                          {emp.username}
                        </td>
                        <td className="text-muted small">{emp.email || 'Chưa cập nhật'}</td>
                        <td>{getRoleBadge(emp.vai_tro)}</td>
                        <td className="text-muted small">{emp.ngay_tham_gia}</td>
                        <td className="pe-4 text-end">
                          <button 
                            onClick={() => handleEditClick(emp)} 
                            className="btn btn-sm btn-outline-info me-2" 
                            title="Sửa phân quyền"
                          >
                            <i className="fa-solid fa-pen-to-square"></i>
                          </button>

                          <button 
                            onClick={() => handleDelete(emp.id)} 
                            className="btn btn-sm btn-outline-danger" 
                            title="Xóa tài khoản"
                            disabled={emp.vai_tro === 'Admin'} 
                          >
                            <i className="fa-solid fa-user-xmark"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">Chưa có nhân viên nào.</td></tr>
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

export default AdminEmployees