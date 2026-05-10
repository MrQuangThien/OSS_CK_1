import { Link, Outlet, useLocation } from 'react-router-dom'

function AdminLayout() {
  const location = useLocation()
  const path = location.pathname

  // Hàm hỗ trợ kiểm tra menu có đang được chọn hay không
  const isActive = (matchString) => path.includes(matchString) ? 'active' : ''
  
  // Hàm kiểm tra menu cha có nên mở ra không
  const isMenuOpen = (matchArray) => matchArray.some(str => path.includes(str)) ? 'show' : ''
  const isParentActive = (matchArray) => matchArray.some(str => path.includes(str)) ? 'active' : ''

  return (
    <>
      {/* SIDEBAR BÊN TRÁI */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <i className="fa-solid fa-user-shield text-primary me-2"></i> ADMIN PANEL
        </div>

        <ul className="sidebar-menu">
          {/* 1. Thống kê báo cáo */}
          <li>
            <Link to="/admin" className={path === '/admin' ? 'active' : ''}>
              <i className="fa-solid fa-chart-pie icon-main"></i> Thống kê báo cáo
            </Link>
          </li>

          {/* 2. Quản lý Đơn hàng */}
          <li>
            <Link to="/admin/don-hang" className={isActive('/admin/don-hang')}>
              <i className="fa-solid fa-cart-flatbed icon-main"></i> Quản lý Đơn hàng
            </Link>
          </li>

          {/* 3. Tài Khoản (Có Submenu) */}
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

          {/* 4. Hàng Hóa (Có Submenu) */}
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

          {/* 5. Quản lý Kho (Có Submenu) */}
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

      {/* NỘI DUNG CHÍNH BÊN PHẢI */}
      <div className="main-content">
        <div className="top-navbar">
          <h4 className="mb-0 fw-bold text-dark">Hệ thống Quản trị</h4>
          <div className="d-flex align-items-center">
            {/* Tạm thời gán chữ Admin, sau này bạn có thể thay bằng State Username giống bên trang chủ */}
            <span className="me-3 text-muted">Xin chào, <strong className="text-primary">Admin</strong></span>
            <Link to="/" className="btn btn-sm btn-outline-primary fw-bold" target="_blank">
              <i className="fa-solid fa-store me-1"></i> Xem Website
            </Link>
          </div>
        </div>

        {/* Chỗ này sẽ render các trang như Dashboard, Sản phẩm, Đơn hàng... */}
        <Outlet />
      </div>
    </>
  )
}

export default AdminLayout