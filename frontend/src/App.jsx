import { useState } from 'react'
import { Link, Route, Routes, useNavigate, useLocation } from 'react-router-dom'
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
import Profile from './pages/Profile'

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
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminEmployees from './pages/admin/AdminEmployees'
import AdminOrderDetail from './pages/admin/AdminOrderDetail'
import AdminPOS from './pages/admin/AdminPOS'
import Contact from './pages/Contact'

function App() {
  const [gioHang, setGioHang] = useState([])
  const [username, setUsername] = useState(localStorage.getItem('username') || null)

  const navigate = useNavigate()
  const location = useLocation() 
  const [tuKhoa, setTuKhoa] = useState("")

  const isAdminRoute = location.pathname.startsWith('/admin')

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
    localStorage.removeItem('role') 
    setUsername(null)
    toast.info('👋 Bạn đã đăng xuất thành công!')
    navigate('/')
  }

  const handleThemVaoGio = (sanPham) => {
    const spDaCo = gioHang.find(item => item.id === sanPham.id)
    if (spDaCo) {
      setGioHang(gioHang.map(item => item.id === sanPham.id ? { ...item, so_luong: item.so_luong + (sanPham.so_luong_mua || 1) } : item))
    } else {
      setGioHang([...gioHang, { ...sanPham, so_luong: (sanPham.so_luong_mua || 1) }])
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

  const userRole = localStorage.getItem('role')

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <ToastContainer />

      {!isAdminRoute && (
        <header className="sticky-top bg-white shadow-sm">
          
          {/* TẦNG 1: TÌM KIẾM, LOGO, GIỎ HÀNG */}
          <div className="py-3 border-bottom border-light-subtle">
            <div className="container d-flex justify-content-between align-items-center">
              
              <Link to="/" className="fs-3 fw-bold text-orange text-decoration-none d-flex align-items-center gap-2">
                <i className="fa-solid fa-laptop-code"></i>
                <span>Computer<span className="text-dark">Shop</span></span>
              </Link>

              <div className="search-container d-none d-md-block w-50 mx-4">
                <form className="search-box-custom shadow-sm" onSubmit={handleSearch}>
                  <input type="text" placeholder="Bạn muốn tìm mua gì hôm nay?..." value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} />
                  <button type="submit" className="bg-orange text-white"><i className="fa-solid fa-magnifying-glass"></i></button>
                </form>
              </div>

              <div className="d-flex align-items-center gap-4">
                <Link to="/gio-hang" className="text-dark fw-bold position-relative d-flex align-items-center gap-2 text-decoration-none transition-hover">
                  <div className="position-relative">
                    <i className="fa-solid fa-cart-shopping fs-4 text-orange"></i>
                    {gioHang.length > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white" style={{fontSize: '0.65rem'}}>
                        {gioHang.length}
                      </span>
                    )}
                  </div>
                  <span className="d-none d-lg-block">Giỏ hàng</span>
                </Link>

                {username ? (
                  <div className="dropdown">
                    <div className="d-flex align-items-center gap-2 text-dark fw-bold dropdown-toggle transition-hover" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                      <i className="fa-solid fa-circle-user fs-4 text-orange"></i>
                      <span className="d-none d-lg-block">Xin chào, {username}</span>
                    </div>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 rounded-3">
                      <li><Link to="/thong-tin-ca-nhan" className="dropdown-item py-2 fw-semibold"><i className="fa-solid fa-address-card text-orange me-2"></i>Thông tin cá nhân</Link></li>
                      <li><Link to="/lich-su" className="dropdown-item py-2 fw-semibold"><i className="fa-solid fa-clipboard-list text-orange me-2"></i>Đơn hàng của tôi</Link></li>
                      {(userRole === 'Admin' || userRole === 'Quản lý' || userRole === 'Nhân viên') && (
                        <li><Link to="/admin" className="dropdown-item py-2 fw-semibold"><i className="fa-solid fa-user-shield text-danger me-2"></i>Trang Quản trị</Link></li>
                      )}
                      <li><hr className="dropdown-divider" /></li>
                      <li><button onClick={handleLogout} className="dropdown-item py-2 fw-bold text-danger"><i className="fa-solid fa-right-from-bracket me-2"></i>Đăng xuất</button></li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/dang-nhap" className="btn btn-outline-orange fw-bold rounded-pill px-4">Đăng nhập</Link>
                )}
              </div>
            </div>
          </div>

          {/* TẦNG 2: THANH MENU ĐIỀU HƯỚNG MỚI THÊM VÀO */}
          <div className="bg-white d-none d-md-block">
            <div className="container">
              <div className="d-flex align-items-center gap-5 py-2">
                <div className="dropdown">
                  <button className="btn btn-orange fw-bold px-4 py-2 border-0 rounded-0 rounded-bottom-3 d-flex align-items-center gap-2 shadow-sm" type="button" data-bs-toggle="dropdown">
                    <i className="fa-solid fa-bars"></i> DANH MỤC SẢN PHẨM
                  </button>
                  <ul className="dropdown-menu shadow border-0 mt-1 rounded-3 w-100">
                    <li><Link className="dropdown-item py-2 fw-semibold" to="/tat-ca-san-pham?category=1"><i className="fa-solid fa-desktop me-2 text-muted"></i>Máy tính bàn (PC)</Link></li>
                    <li><Link className="dropdown-item py-2 fw-semibold" to="/tat-ca-san-pham?category=3"><i className="fa-solid fa-laptop me-2 text-muted"></i>Laptop</Link></li>
                    <li><Link className="dropdown-item py-2 fw-semibold" to="/tat-ca-san-pham?category=2"><i className="fa-solid fa-display me-2 text-muted"></i>Màn hình</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item py-2 fw-bold text-orange" to="/tat-ca-san-pham">Xem tất cả danh mục</Link></li>
                  </ul>
                </div>

                <nav className="d-flex gap-4 fw-bold" style={{fontSize: '0.95rem'}}>
                  <Link to="/" className="text-decoration-none nav-item-custom">TRANG CHỦ</Link>
                  <Link to="/tat-ca-san-pham" className="text-decoration-none nav-item-custom">TẤT CẢ SẢN PHẨM</Link>
                  
                  {/* ĐÃ SỬA: Đính kèm is_new=true và is_hot=true */}
                  <Link to="/tat-ca-san-pham?is_new=true" className="text-decoration-none nav-item-custom">HÀNG MỚI VỀ</Link>
                  <Link to="/tat-ca-san-pham?is_hot=true" className="text-decoration-none nav-item-custom"><i className="fa-solid fa-fire text-danger me-1"></i>KHUYẾN MÃI HOT</Link>
                  
                  <Link to="/lien-he" className="text-decoration-none nav-item-custom">LIÊN HỆ</Link>
                </nav>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* RUỘT TRANG WEB */}
      <main className={`flex-grow-1 ${isAdminRoute ? '' : 'pt-4 pb-5'}`}>
        <Routes>
          <Route path="/" element={<Home onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/san-pham/:id" element={<Detail onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/gio-hang" element={<Cart gioHang={gioHang} onXoaKhoiGio={handleXoaKhoiGio} onTangSoLuong={handleTangSoLuong} onGiamSoLuong={handleGiamSoLuong} />} />
          <Route path="/lich-su" element={<History />} />
          <Route path="/thong-tin-ca-nhan" element={<Profile />} />
          <Route path="/don-hang/:id" element={<OrderDetail />} />
          <Route path="/tat-ca-san-pham" element={<AllProducts onThemVaoGio={handleThemVaoGio} />} />
          <Route path="/thanh-toan" element={<Checkout gioHang={gioHang} onXoaSachGio={() => setGioHang([])} />} />
          <Route path="/dang-nhap" element={<Login setUsername={setUsername} />} />
          <Route path="/dang-ky" element={<Register />} />
          <Route path="/lien-he" element={<Contact />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="don-hang" element={<AdminOrders />} />
            <Route path="pos" element={<AdminPOS />} />
            <Route path="don-hang/:id" element={<AdminOrderDetail />} />
            <Route path="san-pham" element={<AdminProducts />} />
            <Route path="san-pham/them" element={<AdminAddProduct />} />
            <Route path="san-pham/sua/:id" element={<AdminEditProduct />} />
            <Route path="nha-cung-cap" element={<AdminSuppliers />} />
            <Route path="loai-hang" element={<AdminCategories />} />
            <Route path="kho-hang" element={<AdminInventory />} />
            <Route path="nhap-hang" element={<AdminImports />} />
            <Route path="nhap-hang/tao" element={<AdminAddImport />} />
            <Route path="nhap-hang/:id" element={<AdminImportDetail />} />
            <Route path="khach-hang" element={<AdminCustomers />} />
            <Route path="nhan-vien" element={<AdminEmployees />} />
          </Route>
        </Routes>
      </main>

      {/* FOOTER */}
      {!isAdminRoute && (
        <footer className="bg-dark text-secondary pt-5 pb-3 mt-auto" style={{ borderTop: '5px solid var(--primary-orange)' }}>
          <div className="container">
            <div className="row mb-4">
              <div className="col-md-3 mb-4 mb-md-0">
                <h5 className="text-white fw-bold mb-3 d-flex align-items-center gap-2"><i className="fa-solid fa-laptop-code text-orange"></i> ComputerShop</h5>
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
                </div>
              </div>
            </div>
            <hr className="border-secondary opacity-25" />
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small">
              <div className="mb-2 mb-md-0 text-center text-md-start">© 2026 ComputerShop. All rights reserved.<br/><span className="text-muted">Đồ án môn học: Phát triển phần mềm Mã nguồn mở.</span></div>
            </div>
          </div>
        </footer>
      )}

      {/* CSS CSS CSS */}
      <style>{`
        :root { --primary-orange: #f97316; }
        .text-orange { color: var(--primary-orange) !important; }
        .bg-orange { background-color: var(--primary-orange) !important; }
        .btn-orange { background-color: var(--primary-orange); color: white; border: none; transition: 0.3s; }
        .btn-orange:hover { background-color: #ea580c; color: white; }
        .btn-outline-orange { color: var(--primary-orange); border-color: var(--primary-orange); }
        .btn-outline-orange:hover { background-color: var(--primary-orange); color: white; }
        
        .hover-orange:hover { color: var(--primary-orange) !important; }
        .footer-link-hover:hover { color: #fff !important; padding-left: 5px; transition: all 0.3s ease; }
        .transition-hover { transition: all 0.3s ease; }

        /* HIỆU ỨNG GẠCH CHÂN MENU ĐIỀU HƯỚNG MỚI */
        .nav-item-custom {
          color: #374151 !important;
          transition: all 0.2s ease-in-out;
          position: relative;
          padding-bottom: 5px;
        }
        .nav-item-custom:hover {
          color: var(--primary-orange) !important;
        }
        .nav-item-custom::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: var(--primary-orange);
          transition: width 0.3s ease;
        }
        .nav-item-custom:hover::after {
          width: 100%;
        }
      `}</style>
    </div>
  )
}

export default App