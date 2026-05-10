import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminAddProduct() {
  const navigate = useNavigate()
  const [loaiHangs, setLoaiHangs] = useState([])
  
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    ten_san_pham: '',
    loai_hang: '',
    gia_ban: '',
    ton_kho: '',
  })
  
  // State lưu file ảnh và URL xem trước
  const [hinhAnh, setHinhAnh] = useState(null)
  const [preview, setPreview] = useState(null)

  // Tự động tải danh sách Loại Hàng để đưa vào thẻ Select
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/loai-hang/')
      .then(res => setLoaiHangs(res.data))
      .catch(err => console.error("Lỗi lấy danh mục:", err))
  }, [])

  // Xử lý khi người dùng chọn ảnh
  // Xử lý khi người dùng chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setHinhAnh(file) // Vẫn lưu file gốc để gửi lên Django
      
      // Dùng FileReader để ép trình duyệt hiện ảnh Preview chắc chắn 100%
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result) // Đưa chuỗi hình ảnh vào State
      }
      reader.readAsDataURL(file)
    } else {
      setHinhAnh(null)
      setPreview(null)
    }
  }

  // Xử lý gửi dữ liệu lên Django
  const handleSubmit = (e) => {
    e.preventDefault()

    // BẮT BUỘC DÙNG FormData KHI GỬI FILE
    const dataToSend = new FormData()
    dataToSend.append('ten_san_pham', formData.ten_san_pham)
    dataToSend.append('loai_hang', formData.loai_hang)
    dataToSend.append('gia_ban', formData.gia_ban)
    dataToSend.append('ton_kho', formData.ton_kho)
    
    if (hinhAnh) {
      dataToSend.append('hinh_anh', hinhAnh) // Đính kèm file ảnh
    }

    // Gửi đi bằng Axios
    axios.post('http://127.0.0.1:8000/api/san-pham/them/', dataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' } // Nhắc Django đây là form chứa file
    })
    .then(res => {
      toast.success("🎉 Thêm sản phẩm thành công!")
      navigate('/admin/san-pham') // Chuyển hướng về trang danh sách
    })
    .catch(err => {
      toast.error("❌ Có lỗi xảy ra khi thêm sản phẩm.")
      console.error(err)
    })
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">Thêm Sản Phẩm Mới</h5>
        <Link to="/admin/san-pham" className="btn btn-sm btn-outline-secondary">
          <i className="fa-solid fa-arrow-left me-1"></i> Quay lại
        </Link>
      </div>

      <div className="card-body p-4">
        <form onSubmit={handleSubmit} className="row g-4">
          
          {/* CỘT TRÁI: THÔNG TIN CHỮ */}
          <div className="col-lg-8">
            <div className="mb-3">
              <label className="form-label fw-bold">Tên sản phẩm</label>
              <input type="text" className="form-control" required placeholder="Nhập tên sản phẩm..."
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
                <input type="number" className="form-control" required placeholder="0"
                  value={formData.gia_ban} onChange={(e) => setFormData({...formData, gia_ban: e.target.value})} />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Số lượng Tồn kho</label>
                <input type="number" className="form-control" required placeholder="0"
                  value={formData.ton_kho} onChange={(e) => setFormData({...formData, ton_kho: e.target.value})} />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: UP ẢNH */}
          <div className="col-lg-4">
            <div className="border rounded-3 p-3 text-center h-100 bg-light">
              <label className="form-label fw-bold d-block mb-3">Hình ảnh Sản phẩm</label>
              
              {/* Khung xem trước ảnh */}
              <div className="bg-white border rounded mb-3 d-flex align-items-center justify-content-center" style={{height: '200px', overflow: 'hidden'}}>
                {preview ? (
                  <img src={preview} alt="Xem trước" style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
                ) : (
                  <div className="text-muted"><i className="fa-regular fa-image fs-1 mb-2"></i><br/>Chưa có ảnh</div>
                )}
              </div>

              <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange} required />
            </div>
          </div>

          <div className="col-12 text-end mt-4 border-top pt-4">
            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">
              <i className="fa-solid fa-save me-2"></i> LƯU SẢN PHẨM
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AdminAddProduct