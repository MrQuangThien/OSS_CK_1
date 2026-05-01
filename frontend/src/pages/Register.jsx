import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirm_password) {
      toast.error('Mật khẩu xác nhận không khớp!')
      return 
    }

    // Gửi dữ liệu xuống API đăng ký của Django
    axios.post('http://127.0.0.1:8000/api/register/', formData)
      .then(response => {
        toast.success('🎉 ' + response.data.message)
        navigate('/dang-nhap') 
      })
      .catch(error => {
        // Bắt lỗi nếu trùng tên đăng nhập
        if (error.response && error.response.data) {
          toast.error('❌ ' + error.response.data.error)
        } else {
          toast.error('Có lỗi xảy ra!')
        }
      })
  }

  return (
    <div className="login-wrapper bg-light">
      <div className="login-card register-card">
        <div className="login-form-container">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{color: '#212529'}}>Đăng Ký Tài Khoản</h2>
            <p className="text-muted">Trở thành thành viên của ComputerShop</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Tên đăng nhập</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input 
                type="email" 
                className="form-control" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label fw-bold">Mật khẩu</label>
              <input 
                type="password" 
                className="form-control" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Xác nhận mật khẩu</label>
              <input 
                type="password" 
                className="form-control" 
                value={formData.confirm_password}
                onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                required 
              />
            </div>

            <button type="submit" className="btn-login mb-3">TẠO TÀI KHOẢN</button>
            
            <div className="text-center mt-3">
              Đã có tài khoản? <Link to="/dang-nhap" className="text-decoration-none fw-bold" style={{color: '#0d6efd'}}>Đăng nhập</Link>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  )
}

export default Register