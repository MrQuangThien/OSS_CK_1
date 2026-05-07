import { Link } from 'react-router-dom'

function AdminDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-4">Bảng điều khiển</h2>

      {/* 4 Thẻ Thống Kê */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-6">
          <div className="stat-card bg-info-custom position-relative">
            <div className="inner">
              <h3>150</h3>
              <p>Đơn hàng mới</p>
            </div>
            <i className="fa-solid fa-bag-shopping stat-icon"></i>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="stat-card bg-success-custom position-relative">
            <div className="inner">
              <h3>53%</h3>
              <p>Tỷ lệ chuyển đổi</p>
            </div>
            <i className="fa-solid fa-chart-column stat-icon"></i>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="stat-card bg-warning-custom position-relative">
            <div className="inner">
              <h3>44</h3>
              <p>Khách hàng đăng ký</p>
            </div>
            <i className="fa-solid fa-user-plus stat-icon"></i>
          </div>
        </div>

        <div className="col-lg-3 col-6">
          <div className="stat-card bg-danger-custom position-relative">
            <div className="inner">
              <h3>12</h3>
              <p>Sản phẩm sắp hết</p>
            </div>
            <i className="fa-solid fa-triangle-exclamation stat-icon"></i>
          </div>
        </div>
      </div>

      {/* Bảng Đơn hàng gần đây (Mock data hiển thị tạm) */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 fw-bold">
          <i className="fa-solid fa-clock-rotate-left text-primary me-2"></i>Đơn hàng vừa cập nhật
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Mã ĐH</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th className="pe-4"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="ps-4 fw-bold">#1004</td>
                <td>Nguyễn Văn A</td>
                <td className="text-danger fw-bold">25.000.000 ₫</td>
                <td><span className="badge bg-warning text-dark">Chờ xử lý</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-primary">Xử lý</button></td>
              </tr>
              <tr>
                <td className="ps-4 fw-bold">#1003</td>
                <td>Trần Thị B</td>
                <td className="text-danger fw-bold">12.500.000 ₫</td>
                <td><span className="badge bg-success">Đã giao</span></td>
                <td className="text-end pe-4"><button className="btn btn-sm btn-primary">Xem</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard