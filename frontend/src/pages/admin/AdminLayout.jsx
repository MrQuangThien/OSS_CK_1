import { Link, Outlet, useLocation } from 'react-router-dom'

function AdminLayout() {
  const location = useLocation() // Để lấy đường dẫn hiện tại làm sáng menu

  return (
    <div className="admin-layout">
      {/* 1. SIDEBAR BÊN TRÁI */}
      <aside className="admin-sidebar shadow">
        <Link to="/admin" className="sidebar-brand">
          <i className="fa-solid fa-user-tie me-2"></i> Admin Panel
        </Link>
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>
              <i className="fa-solid fa-gauge-high me-2 w-20px"></i> Tổng quan
            </Link>
          </li>
          <li>
            <Link to="/admin/don-hang" className={location.pathname.includes('/admin/don-hang') ? 'active' : ''}>
              <i className="fa-solid fa-cart-flatbed me-2 w-20px"></i> Quản lý Đơn hàng
            </Link>
          </li>
          <li>
            <Link to="/admin/san-pham" className={location.pathname.includes('/admin/san-pham') ? 'active' : ''}>
              <i className="fa-solid fa-laptop me-2 w-20px"></i> Quản lý Sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/admin/kho-hang" className={location.pathname.includes('/admin/kho-hang') ? 'active' : ''}>
              <i className="fa-solid fa-boxes-stacked me-2 w-20px"></i> Quản lý Nhập Kho
            </Link>
          </li>
        </ul>
      </aside>

      {/* 2. NỘI DUNG CHÍNH BÊN PHẢI */}
      <main className="admin-main">
        {/* Header của Admin */}
        <header className="admin-header shadow-sm">
          <div className="fs-5"><i className="fa-solid fa-bars" style={{cursor: 'pointer'}}></i></div>
          <div className="d-flex align-items-center gap-3">
            <Link to="/" className="btn btn-sm btn-outline-secondary">
              <i className="fa-solid fa-house me-1"></i> Xem Website
            </Link>
            <div className="fw-bold"><i className="fa-solid fa-circle-user text-primary me-2"></i> Xin chào, Quản trị viên</div>
          </div>
        </header>

        {/* Nội dung sẽ thay đổi tùy theo Route (Dashboard, Sản phẩm, Đơn hàng...) */}
        <div className="p-4">
          <Outlet /> 
        </div>
      </main>
    </div>
  )
}

export default AdminLayout