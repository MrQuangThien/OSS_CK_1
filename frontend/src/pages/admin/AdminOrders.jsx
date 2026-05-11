import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminOrders() {
  const [orders, setOrders] = useState([])

  const fetchOrders = () => {
    axios.get('http://127.0.0.1:8000/api/lich-su-don-hang/').then(res => setOrders(res.data))
  }

  useEffect(() => { fetchOrders() }, [])

  const handleStatusChange = (id, newStatus) => {
    axios.patch(`http://127.0.0.1:8000/api/don-hang/${id}/status/`, { trang_thai: newStatus })
      .then(() => {
        toast.success("Đã cập nhật trạng thái!");
        fetchOrders(); // Tải lại danh sách
      })
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 fw-bold fs-5">Quản lý Đơn hàng</div>
      <div className="card-body p-0">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th className="ps-4">Mã ĐH</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th className="pe-4 text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="ps-4 fw-bold">#{order.id}</td>
                <td>{order.khach_hang?.ho_ten || "Khách vãng lai"}</td>
                <td className="fw-bold text-danger">{Number(order.tong_tien).toLocaleString()} ₫</td>
                <td>
                  <select 
                    className="form-select form-select-sm w-auto"
                    value={order.trang_thai}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
                <td className="pe-4 text-end">
                  <button className="btn btn-sm btn-outline-primary">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminOrders