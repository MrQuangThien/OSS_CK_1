import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function AdminImportDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    axios.get(`https://computershop-api-gbkm.onrender.com/api/phieu-nhap/${id}/`).then(res => setData(res.data))
  }, [id])

  if (!data) return <div className="text-center mt-5"><div className="spinner-border"></div></div>

  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="d-flex justify-content-between mb-4">
        <h4 className="fw-bold">Chi Tiết Phiếu Nhập #PN-{id}</h4>
        <Link to="/admin/nhap-hang" className="btn btn-secondary btn-sm">Quay lại</Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <p className="mb-1 text-muted">Nhà cung cấp:</p>
          <h5 className="fw-bold text-primary">{data.nha_cung_cap}</h5>
        </div>
        <div className="col-md-6 text-md-end">
          <p className="mb-1 text-muted">Ngày nhập:</p>
          <h5 className="fw-bold">{data.ngay_nhap}</h5>
        </div>
      </div>

      <table className="table table-striped border">
        <thead className="table-dark">
          <tr>
            <th>Sản phẩm</th>
            <th className="text-center">Số lượng</th>
            <th className="text-end">Giá nhập</th>
            <th className="text-end">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td>{item.ten_sp}</td>
              <td className="text-center">{item.so_luong}</td>
              <td className="text-end">{item.gia_nhap.toLocaleString()} ₫</td>
              <td className="text-end fw-bold">{item.thanh_tien.toLocaleString()} ₫</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" className="text-end fw-bold fs-5">TỔNG CỘNG:</td>
            <td className="text-end fw-bold fs-5 text-danger">{data.tong_tien.toLocaleString()} ₫</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

export default AdminImportDetail