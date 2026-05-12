import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
// Import CKEditor 5
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loaiHangs, setLoaiHangs] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    ten_san_pham: '', loai_hang: '', gia_ban: '', ton_kho: '',
    mo_ta_ngan: '', mo_ta_chi_tiet: '',
    la_san_pham_moi: false, la_san_pham_noi_bat: false
  })
  
  const [hinhAnh, setHinhAnh] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    // Lấy danh mục
    axios.get('https://computershop-api-gbkm.onrender.com/api/loai-hang/').then(res => setLoaiHangs(res.data))
    
    // Lấy thông tin sản phẩm cần sửa
    axios.get(`https://computershop-api-gbkm.onrender.com/api/san-pham/${id}/`)
      .then(res => {
        const data = res.data;
        setFormData({
          ten_san_pham: data.ten_san_pham,
          loai_hang: data.loai_hang?.id || data.loai_hang,
          gia_ban: data.gia_ban,
          ton_kho: data.ton_kho,
          mo_ta_ngan: data.mo_ta_ngan || '',
          mo_ta_chi_tiet: data.mo_ta_chi_tiet || '',
          la_san_pham_moi: data.la_san_pham_moi,
          la_san_pham_noi_bat: data.la_san_pham_noi_bat
        })
        
        if (data.hinh_anh) {
          let cleanPath = data.hinh_anh.startsWith('http') ? data.hinh_anh : `https://computershop-api-gbkm.onrender.com${data.hinh_anh.startsWith('/media/') ? data.hinh_anh : '/media' + data.hinh_anh}`
          setPreview(cleanPath)
        }
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
      setHinhAnh(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const dataToSend = new FormData()
    
    // ĐOẠN ĐƯỢC SỬA: Phân loại dữ liệu trước khi gửi
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'boolean') {
        // Ép kiểu Boolean thành chuỗi 'True' hoặc 'False' chuẩn của Python
        dataToSend.append(key, formData[key] ? 'True' : 'False')
      } else {
        dataToSend.append(key, formData[key])
      }
    })
    
    if (hinhAnh) dataToSend.append('hinh_anh', hinhAnh)

    axios.patch(`https://computershop-api-gbkm.onrender.com/api/san-pham/${id}/sua/`, dataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => {
      toast.success("🎉 Đã cập nhật sản phẩm!")
      navigate('/admin/san-pham')
    })
    .catch(() => toast.error("❌ Cập nhật thất bại."))
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>

  return (
    <div>
      {/* CSS fix chiều cao cho CKEditor và Sticky Column */}
      <style>{`
        .ck-editor__editable_inline { min-height: 400px; }
        .sticky-column { position: sticky; top: 90px; }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold m-0"><i className="fa-solid fa-pen-to-square me-2 text-info"></i>Sửa Cập Nhật Sản Phẩm</h3>
          <div className="d-flex gap-2">
            <Link to="/admin/san-pham" className="btn btn-light border px-4 fw-bold shadow-sm">HỦY</Link>
            <button type="submit" className="btn btn-info text-white px-4 fw-bold shadow-sm">
              <i className="fa-solid fa-save me-2"></i>CẬP NHẬT
            </button>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          
          {/* ================= CỘT TRÁI: DỮ LIỆU VĂN BẢN ================= */}
          <div className="col-lg-8">
            {/* Nhóm 1: Thông tin cơ bản */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white py-3 border-bottom">
                <h6 className="fw-bold m-0 text-uppercase text-secondary">1. Thông tin chung & Phân loại</h6>
              </div>
              <div className="card-body p-4 row g-3">
                <div className="col-md-12">
                  <label className="form-label fw-bold small">TÊN SẢN PHẨM <span className="text-danger">*</span></label>
                  <input type="text" className="form-control px-3 py-2" required placeholder="Nhập tên sản phẩm..."
                    value={formData.ten_san_pham} onChange={e => setFormData({...formData, ten_san_pham: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">DANH MỤC <span className="text-danger">*</span></label>
                  <select className="form-select px-3 py-2" required value={formData.loai_hang} onChange={e => setFormData({...formData, loai_hang: e.target.value})}>
                    <option value="">-- Chọn danh mục --</option>
                    {loaiHangs.map(loai => <option key={loai.id} value={loai.id}>{loai.ten_loai}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">GIÁ BÁN (VNĐ) <span className="text-danger">*</span></label>
                  <input type="number" className="form-control px-3 py-2" required min="0"
                    value={formData.gia_ban} onChange={e => setFormData({...formData, gia_ban: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">TỒN KHO <span className="text-danger">*</span></label>
                  <input type="number" className="form-control px-3 py-2" required min="0"
                    value={formData.ton_kho} onChange={e => setFormData({...formData, ton_kho: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Nhóm 2: Nội dung bài viết */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white py-3 border-bottom">
                <h6 className="fw-bold m-0 text-uppercase text-secondary">2. Nội dung & Cấu hình</h6>
              </div>
              <div className="card-body p-4">
                <div className="mb-4">
                  <label className="form-label fw-bold small text-primary"><i className="fa-solid fa-list-check me-2"></i>MÔ TẢ CẤU HÌNH NGẮN</label>
                  <textarea className="form-control px-3 py-2 bg-light border-0" rows="4" placeholder="Nhập tóm tắt thông số..."
                    value={formData.mo_ta_ngan} onChange={e => setFormData({...formData, mo_ta_ngan: e.target.value})}></textarea>
                </div>
                
                <div className="mb-0">
                  <label className="form-label fw-bold small text-primary"><i className="fa-solid fa-pen-nib me-2"></i>BÀI VIẾT MÔ TẢ CHI TIẾT</label>
                  <div className="border rounded">
                    <CKEditor
                      editor={ClassicEditor}
                      data={formData.mo_ta_chi_tiet}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setFormData({ ...formData, mo_ta_chi_tiet: data });
                      }}
                      config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'undo', 'redo']
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CỘT PHẢI: ẢNH & TRẠNG THÁI (STICKY) ================= */}
          <div className="col-lg-4 sticky-column">
            
            {/* Nhóm 3: Trạng thái hiển thị */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white py-3 border-bottom">
                <h6 className="fw-bold m-0 text-uppercase text-secondary">3. Trạng thái hiển thị</h6>
              </div>
              <div className="card-body p-4">
                <div className="form-check form-switch mb-3 p-3 border rounded bg-light d-flex align-items-center">
                  <input className="form-check-input mt-0 ms-0 me-3" type="checkbox" role="switch" style={{width: '40px', height: '20px'}}
                    checked={formData.la_san_pham_moi} onChange={e => setFormData({...formData, la_san_pham_moi: e.target.checked})} />
                  <label className="form-check-label fw-bold text-success mb-0">Hàng Mới Về</label>
                </div>

                <div className="form-check form-switch p-3 border rounded bg-light d-flex align-items-center border-danger border-opacity-25">
                  <input className="form-check-input mt-0 ms-0 me-3 bg-danger border-danger" type="checkbox" role="switch" style={{width: '40px', height: '20px'}}
                    checked={formData.la_san_pham_noi_bat} onChange={e => setFormData({...formData, la_san_pham_noi_bat: e.target.checked})} />
                  <label className="form-check-label fw-bold text-danger mb-0">Sản phẩm HOT</label>
                </div>
              </div>
            </div>

            {/* Nhóm 4: Quản lý hình ảnh */}
            <div className="card border-0 shadow-sm rounded-4 mb-4">
              <div className="card-header bg-white py-3 border-bottom">
                <h6 className="fw-bold m-0 text-uppercase text-secondary">4. Hình ảnh đại diện</h6>
              </div>
              <div className="card-body p-4">
                <div className="mb-0">
                  {preview && (
                    <div className="mb-3 text-center border rounded bg-light p-2 position-relative">
                      <img src={preview} style={{height: '180px', width: '100%', objectFit: 'contain'}} alt="Preview" />
                    </div>
                  )}
                  <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                  <small className="text-muted d-block mt-2">Bỏ trống nếu muốn giữ nguyên ảnh cũ.</small>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminEditProduct
