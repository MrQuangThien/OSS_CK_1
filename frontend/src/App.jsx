import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import Detail from './pages/Detail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  const [gioHang, setGioHang] = useState([])

  const [username, setUsername] = useState(localStorage.getItem('username') || null)

  const handleLogout = () => {
    localStorage.removeItem('username') // Xóa khỏi bộ nhớ
    setUsername(null) // Reset state về null
    toast.info('👋 Bạn đã đăng xuất thành công!')
  }

  const handleThemVaoGio = (sanPham) => {
    setGioHang([...gioHang, sanPham])
    toast.success(`🛒 Đã thêm ${sanPham.ten_san_pham} vào giỏ!`, { position: "bottom-right", autoClose: 2000 })
  }

  const handleXoaKhoiGio = (index) => {
    setGioHang(gioHang.filter((_, i) => i !== index))
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <ToastContainer />

      {/* HEADER MỚI CỦA BẠN */}
      <header className="sticky-top">
        <div className="container-custom d-flex justify-content-between align-items-center">
          <Link to="/" className="fs-3 fw-bold text-primary text-decoration-none">
            <i className="fa-solid fa-laptop-code"></i> ComputerShop
          </Link>

          <form className="search-box" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Tìm kiếm sản phẩm, thương hiệu..." />
            <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
          </form>

          <div className="d-flex align-items-center gap-4">
            <div className="d-flex align-items-center gap-4">
            <Link to="/gio-hang" className="text-dark fw-bold position-relative d-flex align-items-center gap-2 text-decoration-none">
              <i className="fa-solid fa-cart-shopping fs-4 text-primary"></i> 
              <span>Giỏ hàng</span>
              {gioHang.length > 0 && (
                <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger" style={{marginLeft: '15px'}}>
                  {gioHang.length}
                </span>
              )}
            </Link>
            
            {/* KIỂM TRA: NẾU ĐÃ ĐĂNG NHẬP THÌ HIỆN TÊN, CHƯA THÌ HIỆN NÚT ĐĂNG NHẬP */}
            {username ? (
              <div className="dropdown">
                <div className="d-flex align-items-center gap-2 text-dark fw-bold dropdown-toggle" data-bs-toggle="dropdown" style={{cursor: 'pointer'}}>
                  <i className="fa-solid fa-circle-user fs-4 text-success"></i>
                  <span>Xin chào, {username}</span>
                </div>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 rounded-3">
                  <li><Link to="#" className="dropdown-item py-2 fw-semibold"><i className="fa-solid fa-clipboard-list text-primary me-2"></i>Đơn hàng của tôi</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={handleLogout} className="dropdown-item py-2 fw-bold text-danger"><i className="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/dang-nhap" className="text-dark fw-bold d-flex align-items-center gap-2 text-decoration-none">
                <i className="fa-regular fa-user fs-4"></i> <span>Đăng nhập</span>
              </Link>
            )}

          </div>
          </div>
        </div>
      </header>

      {/* RUỘT TRANG WEB */}
      <main className="flex-grow-1 pt-4 pb-5">
        <Routes>
          <Route path="/" element={<Home onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/san-pham/:id" element={<Detail onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/gio-hang" element={<Cart gioHang={gioHang} onXoaKhoiGio={handleXoaKhoiGio} onXoaSachGio={() => setGioHang([])} />} />
          <Route path="/dang-nhap" element={<Login setUsername={setUsername} />} />
          <Route path="/dang-ky" element={<Register />} />
        </Routes>
      </main>

      {/* FOOTER MỚI CỦA BẠN */}
      <footer>
        <div className="container-custom">
          <div className="row mb-4">
            <div className="col-md-3 footer-col">
              <h3>Về ComputerShop</h3>
              <p className="text-secondary">Hệ thống bán lẻ máy tính uy tín hàng đầu. Cam kết chính hãng 100%.</p>
            </div>
            <div className="col-md-3 footer-col">
              <h3>Chính sách</h3>
              <ul>
                <li><Link to="#">Chính sách bảo hành</Link></li>
                <li><Link to="#">Chính sách đổi trả</Link></li>
                <li><Link to="#">Giao hàng & Lắp đặt</Link></li>
              </ul>
            </div>
            <div className="col-md-3 footer-col">
              <h3>Hỗ trợ</h3>
              <ul>
                <li><Link to="#">Hướng dẫn mua hàng</Link></li>
                <li><Link to="#">Tư vấn cấu hình</Link></li>
                <li><Link to="#">Tra cứu bảo hành</Link></li>
              </ul>
            </div>
            <div className="col-md-3 footer-col">
              <h3>Kết nối</h3>
              <div className="d-flex gap-3 fs-3">
                <Link to="#" className="text-primary"><i className="fa-brands fa-facebook"></i></Link>
                <Link to="#" className="text-danger"><i className="fa-brands fa-youtube"></i></Link>
                <Link to="#" className="text-info"><i className="fa-brands fa-tiktok"></i></Link>
              </div>
            </div>
          </div>
          <div className="copyright">© 2026 ComputerShop. All rights reserved. Nhóm OSS_CK.</div>
        </div>
      </footer>
    </div>
  )
}

export default App