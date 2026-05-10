import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function AdminAddImport() {
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  
  const [nhaCungCap, setNhaCungCap] = useState('')
  const [rows, setRows] = useState([{ san_pham_id: '', so_luong: 1, gia_nhap: 0 }])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/nha-cung-cap/').then(res => setSuppliers(res.data))
    axios.get('http://127.0.0.1:8000/api/san-pham/').then(res => setProducts(res.data))
  }, [])

  const addRow = () => setRows([...rows, { san_pham_id: '', so_luong: 1, gia_nhap: 0 }])
  
  const removeRow = (index) => {
    if (rows.length > 1) setRows(rows.filter((_, i) => i !== index))
  }

  const updateRow = (index, field, value) => {
    const newRows = [...rows]
    newRows[index][field] = value
    setRows(newRows)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/phieu-nhap/tao/', {
      nha_cung_cap: nhaCungCap,
      chi_tiet: rows
    }).then(res => {
      toast.success("Đã nhập kho và cập nhật số lượng tồn!")
      navigate('/admin/nhap-hang')
    })
  }

  return (
    <div className="card shadow-sm border-0 p-4">
      <h4 className="fw-bold mb-4">Lập Phiếu Nhập Kho</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 col-md-4">
          <label className="form-label fw-bold">Nhà Cung Cấp</label>
          <select className="form-select" required value={nhaCungCap} onChange={e => setNhaCungCap(e.target.value)}>
            <option value="">-- Chọn nhà cung cấp --</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.ten_nha_cung_cap}</option>)}
          </select>
        </div>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Sản phẩm</th>
              <th style={{width: '15%'}}>Số lượng</th>
              <th style={{width: '20%'}}>Giá nhập (₫)</th>
              <th style={{width: '5%'}}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select className="form-select" required value={row.san_pham_id} 
                    onChange={e => updateRow(index, 'san_pham_id', e.target.value)}>
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.ten_san_pham}</option>)}
                  </select>
                </td>
                <td>
                  <input type="number" className="form-control" min="1" value={row.so_luong}
                    onChange={e => updateRow(index, 'so_luong', e.target.value)} />
                </td>
                <td>
                  <input type="number" className="form-control" value={row.gia_nhap}
                    onChange={e => updateRow(index, 'gia_nhap', e.target.value)} />
                </td>
                <td>
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeRow(index)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" className="btn btn-outline-primary mb-4" onClick={addRow}>
          <i className="fa-solid fa-plus me-2"></i>Thêm dòng sản phẩm
        </button>

        <div className="text-end border-top pt-3">
          <button type="submit" className="btn btn-success px-5 fw-bold">HOÀN TẤT NHẬP KHO</button>
        </div>
      </form>
    </div>
  )
}

export default AdminAddImport