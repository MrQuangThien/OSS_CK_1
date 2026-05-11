import { Link, Outlet, useLocation, Navigate } from 'react-router-dom'

function AdminLayout() {
  const location = useLocation()
  const path = location.pathname

  // LẤY QUYỀN HẠN CỦA NGƯỜI ĐANG ĐĂNG NHẬP
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  // TRẠM GÁC: Nếu chưa đăng nhập HOẶC chỉ là Khách hàng -> Đá văng ra trang đăng nhập
  if (!role || role === 'Khách hàng') {
    return <Navigate to="/dang-nhap" replace />
  }

  const isActive = (matchString) => path.includes(matchString) ? 'active' : ''
  const isMenuOpen = (matchArray) => matchArray.some(str => path.includes(str)) ? 'show' : ''
  const isParentActive = (matchArray) => matchArray.some(str => path.includes(str)) ? 'active' : ''

  return (
    <>
      <div className="sidebar" style={{ minHeight: '100vh' }}>
        <div className="sidebar-brand">
          <i className="fa-solid fa-user-shield text-primary me-2"></i> ADMIN PANEL
        </div>

        <ul className="sidebar-menu">
          <li>
            <Link to="/admin" className={path === '/admin' ? 'active' : ''}>
              <i className="fa-solid fa-chart-pie icon-main"></i> Thống kê báo cáo
            </Link>
          </li>

          <li>
            <Link to="/admin/don-hang" className={isActive('/admin/don-hang')}>
              <i className="fa-solid fa-cart-flatbed icon-main"></i> Quản lý Đơn hàng
            </Link>
          </li>

          {/* CHẶN QUYỀN: CHỈ ADMIN VÀ QUẢN LÝ MỚI THẤY MENU TÀI KHOẢN */}
          {(role === 'Admin' || role === 'Quản lý') && (
            <li>
              <div className={`menu-toggle ${isParentActive(['/khach-hang', '/nhan-vien'])}`} data-bs-toggle="collapse" data-bs-target="#menuNhanSu" aria-expanded={isMenuOpen(['/khach-hang', '/nhan-vien']) ? 'true' : 'false'}>
                <i className="fa-solid fa-users icon-main"></i> Tài Khoản
                <i className="fa-solid fa-chevron-down dropdown-toggle-icon"></i>
              </div>
              <ul className={`collapse sidebar-submenu ${isMenuOpen(['/khach-hang', '/nhan-vien'])}`} id="menuNhanSu">
                <li>
                  <Link to="/admin/khach-hang" className={isActive('/khach-hang')}>
                    <i className="fa-solid fa-user-tag"></i> Danh sách Khách hàng
                  </Link>
                </li>
                <li>
                  <Link to="/admin/nhan-vien" className={isActive('/nhan-vien')}>
                    <i className="fa-solid fa-user-tie"></i> Quản lý Nhân viên
                  </Link>
                </li>
              </ul>
            </li>
          )}

          <li>
            <div className={`menu-toggle ${isParentActive(['/san-pham', '/loai-hang'])}`} data-bs-toggle="collapse" data-bs-target="#menuSanPham" aria-expanded={isMenuOpen(['/san-pham', '/loai-hang']) ? 'true' : 'false'}>
              <i className="fa-solid fa-laptop icon-main"></i> Hàng hóa
              <i className="fa-solid fa-chevron-down dropdown-toggle-icon"></i>
            </div>
            <ul className={`collapse sidebar-submenu ${isMenuOpen(['/san-pham', '/loai-hang'])}`} id="menuSanPham">
              <li>
                <Link to="/admin/san-pham" className={isActive('/san-pham')}>
                  <i className="fa-solid fa-list"></i> Danh sách Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/admin/loai-hang" className={isActive('/loai-hang')}>
                  <i className="fa-solid fa-tags"></i> Loại hàng (Danh mục)
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <div className={`menu-toggle ${isParentActive(['/kho-hang', '/nhap-hang', '/nha-cung-cap'])}`} data-bs-toggle="collapse" data-bs-target="#menuKhoHang" aria-expanded={isMenuOpen(['/kho-hang', '/nhap-hang', '/nha-cung-cap']) ? 'true' : 'false'}>
              <i className="fa-solid fa-warehouse icon-main"></i> Quản lý Kho
              <i className="fa-solid fa-chevron-down dropdown-toggle-icon"></i>
            </div>
            <ul className={`collapse sidebar-submenu ${isMenuOpen(['/kho-hang', '/nhap-hang', '/nha-cung-cap'])}`} id="menuKhoHang">
              <li>
                <Link to="/admin/nha-cung-cap" className={isActive('/nha-cung-cap')}>
                  <i className="fa-solid fa-building"></i> Quản lý Nhà Cung Cấp
                </Link>
              </li>
              <li>
                <Link to="/admin/kho-hang" className={isActive('/kho-hang')}>
                  <i className="fa-solid fa-boxes-stacked"></i> Tồn kho hiện tại
                </Link>
              </li>
              <li>
                <Link to="/admin/nhap-hang" className={isActive('/nhap-hang')}>
                  <i className="fa-solid fa-file-invoice"></i> Lịch sử Nhập hàng
                </Link>
              </li>
            </ul>
          </li>

        </ul>
      </div>

      <div className="main-content" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <div className="top-navbar bg-white shadow-sm px-4 py-3 d-flex justify-content-between mb-4">
          <h4 className="mb-0 fw-bold text-dark">Hệ thống Quản trị</h4>
          <div className="d-flex align-items-center">
            <span className="me-3 text-muted d-flex align-items-center">
              Xin chào, <strong className="text-primary ms-1">{username}</strong>
              <span className={`badge ms-2 ${role === 'Admin' ? 'bg-danger' : role === 'Quản lý' ? 'bg-warning text-dark' : 'bg-success'}`}>
                {role}
              </span>
            </span>
            <Link to="/" className="btn btn-sm btn-outline-primary fw-bold">
              <i className="fa-solid fa-store me-1"></i> Xem Website
            </Link>
          </div>
        </div>

        <div className="px-4 pb-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AdminLayout