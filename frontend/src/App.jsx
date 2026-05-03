import { useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Home from './pages/Home'
import Detail from './pages/Detail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import History from './pages/History'
import OrderDetail from './pages/OrderDetail'
import AllProducts from './pages/AllProducts'

function App() {
  const [gioHang, setGioHang] = useState([])
  const [username, setUsername] = useState(localStorage.getItem('username') || null)

  const navigate = useNavigate()
  const [tuKhoa, setTuKhoa] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    if (tuKhoa.trim()) {
      navigate(`/tat-ca-san-pham?keyword=${encodeURIComponent(tuKhoa)}`)
    } else {
      navigate(`/tat-ca-san-pham`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('username') // Xóa khỏi bộ nhớ
    setUsername(null) // Reset state về null
    toast.info('👋 Bạn đã đăng xuất thành công!')
  }

  const handleThemVaoGio = (sanPham) => {
    const spDaCo = gioHang.find(item => item.id === sanPham.id)
    if (spDaCo) {
      // Nếu đã có trong giỏ, chỉ tăng số lượng lên 1
      setGioHang(gioHang.map(item => item.id === sanPham.id ? {...item, so_luong: item.so_luong + 1} : item))
    } else {
      // Nếu chưa có, thêm mới với số lượng là 1
      setGioHang([...gioHang, {...sanPham, so_luong: 1}])
    }
    toast.success(`🛒 Đã thêm ${sanPham.ten_san_pham} vào giỏ!`, { position: "bottom-right", autoClose: 2000 })
  }

  const handleTangSoLuong = (id) => {
    setGioHang(gioHang.map(item => item.id === id ? {...item, so_luong: item.so_luong + 1} : item))
  }

  const handleGiamSoLuong = (id) => {
    setGioHang(gioHang.map(item => item.id === id && item.so_luong > 1 ? {...item, so_luong: item.so_luong - 1} : item))
  }

  const handleXoaKhoiGio = (id) => {
    setGioHang(gioHang.filter(item => item.id !== id))
    toast.info('🗑️ Đã xóa sản phẩm khỏi giỏ hàng', { position: "bottom-right", autoClose: 2000 })
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

          <form className="search-box" onSubmit={handleSearch}>
            <input type="text" placeholder="Tìm kiếm sản phẩm, thương hiệu..." 
                   value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />
            <button type="submit"><i className="fa-solid fa-magnifying-glass"></i></button>
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
                  <li><Link to="/lich-su" className="dropdown-item py-2 fw-semibold"><i className="fa-solid fa-clipboard-list text-primary me-2"></i>Đơn hàng của tôi</Link></li>
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
          <Route path="/gio-hang" element={<Cart gioHang={gioHang} onXoaKhoiGio={handleXoaKhoiGio} onTangSoLuong={handleTangSoLuong} onGiamSoLuong={handleGiamSoLuong} />} />
          <Route path="/lich-su" element={<History />} />
          <Route path="/don-hang/:id" element={<OrderDetail />} />
          <Route path="/tat-ca-san-pham" element={<AllProducts onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/thanh-toan" element={<Checkout gioHang={gioHang} onXoaSachGio={() => setGioHang([])} />} />
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