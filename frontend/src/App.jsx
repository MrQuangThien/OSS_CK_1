import { useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import AllProducts from './pages/AllProducts'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Detail from './pages/Detail'
import History from './pages/History'
import Home from './pages/Home'
import Login from './pages/Login'
import OrderDetail from './pages/OrderDetail'
import Register from './pages/Register'
import AdminAddImport from './pages/admin/AdminAddImport'
import AdminAddProduct from './pages/admin/AdminAddProduct'
import AdminCategories from './pages/admin/AdminCategories'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminEditProduct from './pages/admin/AdminEditProduct'
import AdminImportDetail from './pages/admin/AdminImportDetail'
import AdminImports from './pages/admin/AdminImports'
import AdminInventory from './pages/admin/AdminInventory'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminSuppliers from './pages/admin/AdminSuppliers'

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
    localStorage.removeItem('username')
    setUsername(null)
    toast.info('👋 Bạn đã đăng xuất thành công!')
  }

  const handleThemVaoGio = (sanPham) => {
    const spDaCo = gioHang.find(item => item.id === sanPham.id)
    if (spDaCo) {
      setGioHang(gioHang.map(item => item.id === sanPham.id ? { ...item, so_luong: item.so_luong + 1 } : item))
    } else {
      setGioHang([...gioHang, { ...sanPham, so_luong: 1 }])
    }
    toast.success(`🛒 Đã thêm ${sanPham.ten_san_pham} vào giỏ!`, { position: "bottom-right", autoClose: 2000 })
  }

  const handleTangSoLuong = (id) => {
    setGioHang(gioHang.map(item => item.id === id ? { ...item, so_luong: item.so_luong + 1 } : item))
  }

  const handleGiamSoLuong = (id) => {
    setGioHang(gioHang.map(item => item.id === id && item.so_luong > 1 ? { ...item, so_luong: item.so_luong - 1 } : item))
  }

  const handleXoaKhoiGio = (id) => {
    setGioHang(gioHang.filter(item => item.id !== id))
    toast.info('🗑️ Đã xóa sản phẩm khỏi giỏ hàng', { position: "bottom-right", autoClose: 2000 })
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <ToastContainer />

      {/* HEADER: GIAO DIỆN E-COMMERCE HIỆN ĐẠI TONE CAM */}
      <header className="sticky-top bg-white shadow-sm py-3">
        <div className="container d-flex justify-content-between align-items-center">
          
          {/* Logo */}
          <Link to="/" className="fs-3 fw-bold text-orange text-decoration-none d-flex align-items-center gap-2">
            <i className="fa-solid fa-laptop-code"></i>
            <span>Computer<span className="text-dark">Shop</span></span>
          </Link>

          {/* Thanh tìm kiếm nổi bật */}
          {/* Thanh tìm kiếm nổi bật */}
          <div className="search-container">
            <form className="search-box-custom shadow-sm" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="Bạn muốn tìm mua gì hôm nay?..."
                value={tuKhoa} 
                onChange={(e) => setTuKhoa(e.target.value)} 
              />
              <button type="submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>

          {/* Công cụ người dùng */}
          <div className="d-flex align-items-center gap-4">
            
            {/* Giỏ hàng */}
            <Link to="/gio-hang" className="text-dark fw-bold position-relative d-flex align-items-center gap-2 text-decoration-none transition-hover">
              <div className="position-relative">
                <i className="fa-solid fa-cart-shopping fs-4 text-orange"></i>
                {gioHang.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white" style={{fontSize: '0.65rem'}}>
                    {gioHang.length}
                  </span>
                )}
              </div>
              <span className="d-none d-md-block">Giỏ hàng</span>
            </Link>

            {/* Tài khoản */}
            {username ? (
              <div className="dropdown">
                <div className="d-flex align-items-center gap-2 text-dark fw-bold dropdown-toggle" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-circle-user fs-4 text-orange"></i>
                  <span className="d-none d-md-block">Xin chào, {username}</span>
                </div>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 rounded-3">
                  <li><Link to="/lich-su" className="dropdown-item py-2 fw-semibold"><i className="fa-solid fa-clipboard-list text-orange me-2"></i>Đơn hàng của tôi</Link></li>
                  {/* Nếu tài khoản là admin thì mới hiện menu Quản trị */}
                  {username.toLowerCase() === 'admin' && (
                    <li><Link to="/admin" className="dropdown-item py-2 fw-semibold"><i className="fa-solid fa-user-shield text-danger me-2"></i>Trang Quản trị</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={handleLogout} className="dropdown-item py-2 fw-bold text-danger"><i className="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/dang-nhap" className="btn btn-outline-orange fw-bold rounded-pill px-4">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* RUỘT TRANG WEB */}
      <main className="flex-grow-1 pt-4 pb-5">
        <Routes>
          {/* LUỒNG KHACHHANG  */}
          <Route path="/" element={<Home onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/san-pham/:id" element={<Detail onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/gio-hang" element={<Cart gioHang={gioHang} onXoaKhoiGio={handleXoaKhoiGio} onTangSoLuong={handleTangSoLuong} onGiamSoLuong={handleGiamSoLuong} />} />
          <Route path="/lich-su" element={<History />} />
          <Route path="/don-hang/:id" element={<OrderDetail />} />
          <Route path="/tat-ca-san-pham" element={<AllProducts onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/thanh-toan" element={<Checkout gioHang={gioHang} onXoaSachGio={() => setGioHang([])} />} />
          <Route path="/dang-nhap" element={<Login setUsername={setUsername} />} />
          <Route path="/dang-ky" element={<Register />} />
          
          {/* LUỒNG ADMIN  */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="don-hang" element={<AdminOrders />} />
            <Route path="san-pham" element={<AdminProducts />} />
            <Route path="san-pham/them" element={<AdminAddProduct />} />
            <Route path="san-pham/sua/:id" element={<AdminEditProduct />} />
            <Route path="nha-cung-cap" element={<AdminSuppliers />} />
            <Route path="loai-hang" element={<AdminCategories />} />
            <Route path="kho-hang" element={<AdminInventory />} />
            <Route path="nhap-hang" element={<AdminImports />} />
            <Route path="nhap-hang/tao" element={<AdminAddImport />} />
            <Route path="nhap-hang/:id" element={<AdminImportDetail />} />
          </Route>
        </Routes>
      </main>

      {/* FOOTER: GIAO DIỆN TỐI SANG TRỌNG VỚI VIỀN CAM CHUYÊN NGHIỆP */}
      <footer className="bg-dark text-secondary pt-5 pb-3 mt-auto" style={{ borderTop: '5px solid var(--primary-orange)' }}>
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-3 mb-4 mb-md-0">
              <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="fa-solid fa-laptop-code text-orange"></i> ComputerShop
              </h5>
              <p className="small lh-lg">Hệ thống bán lẻ máy tính và phụ kiện công nghệ uy tín hàng đầu. Chúng tôi cam kết mang đến sản phẩm chính hãng 100% với mức giá tốt nhất thị trường.</p>
            </div>
            
            <div className="col-md-3 mb-4 mb-md-0">
              <h6 className="text-white fw-bold mb-3 text-uppercase">Chính sách</h6>
              <ul className="list-unstyled small lh-lg">
                <li><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Chính sách bảo hành</Link></li>
                <li><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Chính sách đổi trả 7 ngày</Link></li>
                <li><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Giao hàng & Lắp đặt tận nơi</Link></li>
                <li><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Bảo mật thông tin khách hàng</Link></li>
              </ul>
            </div>
            
            <div className="col-md-3 mb-4 mb-md-0">
              <h6 className="text-white fw-bold mb-3 text-uppercase">Hỗ trợ khách hàng</h6>
              <ul className="list-unstyled small lh-lg">
                <li><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Hướng dẫn mua hàng Online</Link></li>
                <li><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Tư vấn xây dựng cấu hình PC</Link></li>
                <li><Link to="#" className="text-secondary text-decoration-none footer-link-hover">Tra cứu tình trạng bảo hành</Link></li>
                <li><span className="text-orange fw-bold"><i className="fa-solid fa-phone me-2"></i>Hotline: 1900 1234</span></li>
              </ul>
            </div>
            
            <div className="col-md-3">
              <h6 className="text-white fw-bold mb-3 text-uppercase">Kết nối với chúng tôi</h6>
              <div className="d-flex gap-3">
                <Link to="#" className="text-secondary fs-4 text-decoration-none"><i className="fa-brands fa-facebook hover-orange transition-hover"></i></Link>
                <Link to="#" className="text-secondary fs-4 text-decoration-none"><i className="fa-brands fa-youtube hover-orange transition-hover"></i></Link>
                <Link to="#" className="text-secondary fs-4 text-decoration-none"><i className="fa-brands fa-tiktok hover-orange transition-hover"></i></Link>
                <Link to="#" className="text-secondary fs-4 text-decoration-none"><i className="fa-brands fa-instagram hover-orange transition-hover"></i></Link>
              </div>
              <div className="mt-4">
                <img src="https://images.dmca.com/Badges/dmca-badge-w150-5x1-07.png?ID=1" alt="DMCA Protected" style={{height: '30px', opacity: '0.6'}} />
              </div>
            </div>
          </div>
          
          <hr className="border-secondary opacity-25" />
          
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small">
            <div className="mb-2 mb-md-0 text-center text-md-start">
              © 2026 ComputerShop. All rights reserved.<br/>
              <span className="text-muted">Đồ án môn học: Phát triển phần mềm Mã nguồn mở.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* STYLE BỔ SUNG TRỰC TIẾP CHO FOOTER & HEADER */}
      <style>{`
        .hover-orange:hover { color: var(--primary-orange) !important; }
        .footer-link-hover:hover { color: #fff !important; padding-left: 5px; transition: all 0.3s ease; }
        .transition-hover { transition: all 0.3s ease; }
        .btn-outline-orange { color: var(--primary-orange); border-color: var(--primary-orange); }
        .btn-outline-orange:hover { background-color: var(--primary-orange); color: white; }
      `}</style>
    </div>
  )
}

export default App