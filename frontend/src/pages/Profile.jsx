import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function Profile() {
  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const [loading, setLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    ho_ten: '',
    so_dien_thoai: '',
    email: '',
    dia_chi: ''
  })

  // Nếu chưa đăng nhập thì đuổi ra trang đăng nhập
  useEffect(() => {
    if (!username) {
      toast.warning("Vui lòng đăng nhập để xem thông tin!")
      navigate('/dang-nhap')
      return
    }

    // Lấy thông tin cá nhân
    axios.post('https://computershop-api-gbkm.onrender.com/api/thong-tin-ca-nhan/', { username: username, action: 'get' })
      .then(res => {
        setFormData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [username, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Gửi yêu cầu cập nhật
    axios.post('https://computershop-api-gbkm.onrender.com/api/thong-tin-ca-nhan/', { 
      username: username, 
      action: 'update',
      ...formData
    })
      .then(res => {
        toast.success("🎉 " + res.data.message)
      })
      .catch(err => toast.error("❌ Có lỗi xảy ra khi cập nhật!"))
  }

  if (loading) return <div className="text-center py-5 mt-5"><div className="spinner-border text-orange"></div></div>

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {/* Header Card */}
            <div className="bg-light p-4 text-center border-bottom">
              <div className="d-inline-flex justify-content-center align-items-center bg-white rounded-circle shadow-sm mb-3" style={{width: '80px', height: '80px'}}>
                <i className="fa-solid fa-user-astronaut fs-1 text-orange"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">Hồ Sơ Cá Nhân</h3>
              <p className="text-muted mb-0 small">Quản lý thông tin để việc mua sắm diễn ra nhanh chóng hơn</p>
            </div>

            {/* Body Card */}
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">TÀI KHOẢN (KHÔNG ĐỔI)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="fa-solid fa-user text-muted"></i></span>
                      <input type="text" className="form-control bg-light border-start-0" value={username} disabled />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">HỌ VÀ TÊN</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-white border-end-0"><i className="fa-regular fa-id-badge text-muted"></i></span>
                      <input type="text" className="form-control border-start-0 px-0" placeholder="Nhập họ và tên..."
                        value={formData.ho_ten} onChange={e => setFormData({...formData, ho_ten: e.target.value})} />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">SỐ ĐIỆN THOẠI</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-white border-end-0"><i className="fa-solid fa-phone text-muted"></i></span>
                      <input type="tel" className="form-control border-start-0 px-0" placeholder="Nhập số điện thoại..."
                        value={formData.so_dien_thoai} onChange={e => setFormData({...formData, so_dien_thoai: e.target.value})} />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-muted">EMAIL LIÊN HỆ</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-white border-end-0"><i className="fa-regular fa-envelope text-muted"></i></span>
                      <input type="email" className="form-control border-start-0 px-0" placeholder="Nhập địa chỉ email..."
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">ĐỊA CHỈ GIAO HÀNG MẶC ĐỊNH</label>
                    <div className="input-group shadow-sm rounded-3">
                      <span className="input-group-text bg-white border-end-0 align-items-start pt-2"><i className="fa-solid fa-location-dot text-muted"></i></span>
                      <textarea className="form-control border-start-0 px-0" rows="3" placeholder="Nhập số nhà, tên đường, xã/phường..."
                        value={formData.dia_chi} onChange={e => setFormData({...formData, dia_chi: e.target.value})}></textarea>
                    </div>
                  </div>

                  <div className="col-12 mt-5 text-center">
                    <button type="submit" className="btn btn-orange px-5 py-3 fw-bold rounded-pill shadow-sm">
                      <i className="fa-solid fa-floppy-disk me-2"></i> LƯU THAY ĐỔI
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile