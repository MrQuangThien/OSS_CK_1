import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Login({ setUsername }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Gửi dữ liệu xuống API đăng nhập của Django
    axios.post('http://127.0.0.1:8000/api/login/', formData)
      .then(response => {
        toast.success('🎉 ' + response.data.message)
        
        localStorage.setItem('username', response.data.user.username)
        
        // THÊM DÒNG NÀY ĐỂ BÁO CHO APP.JSX CẬP NHẬT GIAO DIỆN HEADER
        setUsername(response.data.user.username)
        
        navigate('/') 
      })
      .catch(error => {
        if (error.response && error.response.data) {
          toast.error('❌ ' + error.response.data.error)
        }
      })
  }

  return (
    <div className="login-wrapper bg-light">
      <div className="login-card">
        
        {/* Cột hình ảnh bên trái */}
        <div className="login-image d-none d-md-block">
          <div className="login-image-text">
            <h3 className="fw-bold mb-2">ComputerShop</h3>
            <p className="mb-0">Khám phá thế giới công nghệ đỉnh cao với mức giá tốt nhất thị trường.</p>
          </div>
        </div>
        
        {/* Cột Form bên phải */}
        <div className="login-form-container">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{color: '#212529'}}>Mừng bạn trở lại! 👋</h2>
            <p className="text-muted">Vui lòng đăng nhập để tiếp tục mua sắm</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold text-dark" style={{fontSize: '0.9rem'}}>Tên đăng nhập</label>
              <div className="input-group">
                <span className="input-group-text border-end-0 text-muted bg-transparent"><i className="fa-regular fa-envelope"></i></span>
                <input 
                  type="text" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Nhập tên đăng nhập của bạn..." 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required 
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label fw-bold text-dark" style={{fontSize: '0.9rem'}}>Mật khẩu</label>
              <div className="input-group">
                <span className="input-group-text border-end-0 text-muted bg-transparent"><i className="fa-solid fa-lock"></i></span>
                <input 
                  type="password" 
                  className="form-control border-start-0 ps-0" 
                  placeholder="Nhập mật khẩu..." 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>
            
            <div className="d-flex justify-content-between align-items-center mb-4" style={{fontSize: '0.9rem'}}>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label text-muted" htmlFor="remember">Ghi nhớ tôi</label>
              </div>
              <Link to="#" className="text-decoration-none fw-bold" style={{color: '#0d6efd'}}>Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="btn-login mb-4">ĐĂNG NHẬP</button>
            
            <div className="text-center mt-4" style={{fontSize: '0.95rem'}}>
              Chưa có tài khoản? <Link to="/dang-ky" className="text-decoration-none fw-bold" style={{color: '#ff4757'}}>Đăng ký ngay</Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Login