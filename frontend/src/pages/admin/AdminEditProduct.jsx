import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminEditProduct() {
  const { id } = useParams() // Lấy ID sản phẩm cần sửa
  const navigate = useNavigate()
  const [loaiHangs, setLoaiHangs] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    ten_san_pham: '',
    loai_hang: '',
    gia_ban: '',
    ton_kho: '',
  })
  
  // State quản lý ảnh
  const [hinhAnhMoi, setHinhAnhMoi] = useState(null) // Chứa file nếu up ảnh mới
  const [preview, setPreview] = useState(null)       // Link hiển thị ảnh

  useEffect(() => {
    // Tải đồng thời Danh mục Loại hàng VÀ Dữ liệu của Sản phẩm hiện tại
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/loai-hang/'),
      // Giả sử bạn có API lấy chi tiết 1 SP (Tái sử dụng API cũ của trang Detail)
      axios.get(`http://127.0.0.1:8000/api/san-pham/${id}/`) 
    ])
    .then(([resLH, resSP]) => {
      setLoaiHangs(resLH.data)
      
      const sp = resSP.data
      // Đổ dữ liệu cũ vào Form
      setFormData({
        ten_san_pham: sp.ten_san_pham,
        loai_hang: sp.loai_hang, // Đảm bảo API trả về ID của loại hàng
        gia_ban: sp.gia_ban,
        ton_kho: sp.ton_kho,
      })
      // Hiển thị ảnh cũ có sẵn trong Database
      if (sp.hinh_anh) setPreview(sp.hinh_anh)
      
      setLoading(false)
    })
    .catch(err => {
      toast.error("Không tìm thấy sản phẩm!")
      navigate('/admin/san-pham')
    })
  }, [id, navigate])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHinhAnhMoi(file) // Vẫn lưu file gốc để gửi lên Django
      
      // Dùng FileReader để hiển thị
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result) // Đưa chuỗi hình ảnh vào State
      }
      reader.readAsDataURL(file)
    } else {
      setHinhAnhMoi(null)
      // Không setPreview(null) ở đây vì AdminEdit cần giữ lại ảnh cũ nếu họ bỏ chọn
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataToSend = new FormData()
    dataToSend.append('ten_san_pham', formData.ten_san_pham)
    dataToSend.append('loai_hang', formData.loai_hang)
    dataToSend.append('gia_ban', formData.gia_ban)
    dataToSend.append('ton_kho', formData.ton_kho)
    
    // CHỈ gửi file ảnh ĐÍNH KÈM nếu Admin thực sự chọn ảnh mới
    if (hinhAnhMoi) {
      dataToSend.append('hinh_anh', hinhAnhMoi) 
    }

    // Dùng PATCH thay vì POST
    axios.patch(`http://127.0.0.1:8000/api/san-pham/${id}/sua/`, dataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      toast.success("✨ Cập nhật sản phẩm thành công!")
      navigate('/admin/san-pham')
    })
    .catch(err => {
      toast.error("❌ Lỗi cập nhật.")
      console.error(err)
    })
  }

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0 text-primary">Chỉnh Sửa Sản Phẩm #{id}</h5>
        <Link to="/admin/san-pham" className="btn btn-sm btn-outline-secondary">
          <i className="fa-solid fa-arrow-left me-1"></i> Quay lại
        </Link>
      </div>

      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="row g-4">
          
          <div className="col-lg-8">
            <div className="mb-3">
              <label className="form-label fw-bold">Tên sản phẩm</label>
              <input type="text" className="form-control" required 
                value={formData.ten_san_pham} onChange={(e) => setFormData({...formData, ten_san_pham: e.target.value})} />
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Loại hàng</label>
                <select className="form-select" required
                  value={formData.loai_hang} onChange={(e) => setFormData({...formData, loai_hang: e.target.value})}>
                  <option value="">-- Chọn loại hàng --</option>
                  {loaiHangs.map(loai => (
                    <option key={loai.id} value={loai.id}>{loai.ten_loai}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Giá bán (VNĐ)</label>
                <input type="number" className="form-control" required
                  value={formData.gia_ban} onChange={(e) => setFormData({...formData, gia_ban: e.target.value})} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Số lượng Tồn kho</label>
                <input type="number" className="form-control" required
                  value={formData.ton_kho} onChange={(e) => setFormData({...formData, ton_kho: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="border rounded-3 p-3 text-center h-100 bg-light">
              <label className="form-label fw-bold d-block mb-3">Hình ảnh Sản phẩm</label>
              
              <div className="bg-white border rounded mb-3 d-flex align-items-center justify-content-center" style={{height: '200px', overflow: 'hidden'}}>
                {preview ? (
                  <img src={preview} alt="Xem trước" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                ) : (
                  <div className="text-muted"><i className="fa-regular fa-image fs-1 mb-2"></i><br/>Chưa có ảnh</div>
                )}
              </div>

              {/* Bỏ required ở đây vì Admin có quyền KHÔNG đổi ảnh mới */}
              <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange} />
              <small className="text-muted d-block mt-2">Bỏ trống nếu muốn giữ nguyên ảnh cũ</small>
            </div>
          </div>

          <div className="col-12 text-end mt-4 border-top pt-4">
            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">
              <i className="fa-solid fa-save me-2"></i> LƯU THAY ĐỔI
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AdminEditProduct