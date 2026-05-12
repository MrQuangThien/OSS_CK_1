import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function AdminPOS() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [cart, setCart] = useState([])
  const [tuKhoa, setTuKhoa] = useState("")
  const [currentCategory, setCurrentCategory] = useState("all")

  // Thông tin khách
  const [khach, setKhach] = useState({ ho_ten: '', so_dien_thoai: '', dia_chi: '', ghi_chu: '' })

  useEffect(() => {
    Promise.all([
      axios.get('https://computershop-api-gbkm.onrender.com/api/san-pham/'),
      axios.get('https://computershop-api-gbkm.onrender.com/api/loai-hang/')
    ]).then(([resProducts, resCategories]) => {
      setProducts(resProducts.data)
      setCategories(resCategories.data)
    })
  }, [])

  const addToCart = (sp) => {
    if (sp.ton_kho <= 0) {
      toast.warning("Sản phẩm đã hết hàng!")
      return
    }
    const existing = cart.find(item => item.id === sp.id)
    if (existing) {
      if (existing.so_luong < sp.ton_kho) {
        setCart(cart.map(item => item.id === sp.id ? { ...item, so_luong: item.so_luong + 1 } : item))
      } else {
        toast.warning("Vượt quá số lượng tồn kho!")
      }
    } else {
      setCart([...cart, { ...sp, so_luong: 1 }])
    }
  }

  const updateQty = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.so_luong + delta
          if (newQty <= 0) return null // Sẽ bị filter
          if (newQty > item.ton_kho) { toast.warning("Vượt tồn kho!"); return item }
          return { ...item, so_luong: newQty }
        }
        return item
      }).filter(Boolean)
    })
  }

  const addNote = (note) => {
    setKhach(prev => ({ ...prev, ghi_chu: prev.ghi_chu ? prev.ghi_chu + ' | ' + note : note }))
  }

  const checkout = () => {
    if (cart.length === 0) return toast.error("Giỏ hàng trống!")
    
    const tongTien = cart.reduce((total, item) => total + (Number(item.gia_ban) * item.so_luong), 0)
    
    // Gửi payload y hệt API đặt hàng
    const payload = {
      khach_hang: {
        ho_ten: khach.ho_ten || 'Khách lẻ',
        so_dien_thoai: khach.so_dien_thoai || '0000000000',
        dia_chi: khach.dia_chi || 'Tại cửa hàng',
      },
      san_phams: cart,
      tong_tien: tongTien
    }

    axios.post('https://computershop-api-gbkm.onrender.com/api/dat-hang/', payload)
      .then(res => {
        toast.success("🎉 Chốt đơn thành công!")
        navigate('/admin/don-hang')
      })
      .catch(err => toast.error("Có lỗi khi tạo đơn!"))
  }

  // Lọc sản phẩm
  const filteredProducts = products.filter(sp => {
    const matchKey = sp.ten_san_pham.toLowerCase().includes(tuKhoa.toLowerCase())
    const matchCat = currentCategory === 'all' || sp.loai_hang === parseInt(currentCategory)
    return matchKey && matchCat
  })

  const tongTien = cart.reduce((total, item) => total + (Number(item.gia_ban) * item.so_luong), 0)

  // Hàm fix ảnh
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `https://computershop-api-gbkm.onrender.com${cleanPath}`;
  };

  return (
    <div className="row" style={{ height: 'calc(100vh - 120px)', minHeight: '600px' }}>
      
      {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
      <div className="col-lg-7 col-xl-8 h-100 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3 bg-white p-3 rounded-3 shadow-sm border">
          <h4 className="fw-bold m-0"><i className="fa-solid fa-store text-primary me-2"></i>Bán Hàng</h4>
          <div className="input-group w-50">
            <span className="input-group-text bg-light border-end-0"><i className="fa-solid fa-magnifying-glass text-muted"></i></span>
            <input type="text" className="form-control border-start-0 bg-light shadow-none" placeholder="Tìm tên sản phẩm..."
              value={tuKhoa} onChange={e => setTuKhoa(e.target.value)} />
          </div>
        </div>
        
        <div className="d-flex overflow-auto gap-2 pb-2 mb-2 px-1" style={{ scrollbarWidth: 'none' }}>
          <button className={`btn rounded-pill fw-bold btn-sm px-4 shadow-sm ${currentCategory === 'all' ? 'btn-primary' : 'btn-light border'}`} onClick={() => setCurrentCategory('all')}>Tất cả</button>
          {categories.map(cat => (
            <button key={cat.id} className={`btn rounded-pill fw-bold btn-sm px-4 shadow-sm text-nowrap ${currentCategory === cat.id.toString() ? 'btn-primary' : 'btn-light border'}`} onClick={() => setCurrentCategory(cat.id.toString())}>{cat.ten_loai}</button>
          ))}
        </div>
        
        <div className="flex-grow-1 overflow-auto pe-2 pb-5">
          <div className="row g-3">
            {filteredProducts.map(sp => (
              <div className="col-6 col-md-4 col-xl-3" key={sp.id}>
                <div className="card h-100 border rounded-4 shadow-sm" style={{ cursor: 'pointer', transition: '0.2s' }} onClick={() => addToCart(sp)}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#0d6efd'} onMouseOut={(e) => e.currentTarget.style.borderColor = '#dee2e6'}>
                  <div className="bg-light d-flex align-items-center justify-content-center p-3 rounded-top-4" style={{ height: '120px' }}>
                    <img src={getImageUrl(sp.hinh_anh)} style={{ maxHeight: '100%', maxWidth: '100%', mixBlendMode: 'multiply' }} alt="" />
                  </div>
                  <div className="card-body p-2 text-center d-flex flex-column justify-content-between">
                    <div className="fw-bold text-dark small mb-1 text-truncate" title={sp.ten_san_pham}>{sp.ten_san_pham}</div>
                    <div className="text-danger fw-bold">{Number(sp.gia_ban).toLocaleString()} ₫</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: HÓA ĐƠN & THANH TOÁN */}
      <div className="col-lg-5 col-xl-4 h-100">
        <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden d-flex flex-column">
          
          <div className="p-3 bg-white border-bottom">
            <div className="d-flex align-items-center mb-2"><i className="fa-solid fa-user-tag text-primary me-2"></i><span className="fw-bold text-uppercase small">Thông tin khách hàng</span></div>
            <input type="text" className="form-control form-control-sm mb-2 fw-bold text-primary bg-light shadow-none" placeholder="Tên khách (Mặc định: Khách lẻ)"
              value={khach.ho_ten} onChange={e => setKhach({...khach, ho_ten: e.target.value})} />
            <div className="row g-2 mb-2">
              <div className="col-5"><input type="text" className="form-control form-control-sm bg-light shadow-none" placeholder="Số điện thoại" value={khach.so_dien_thoai} onChange={e => setKhach({...khach, so_dien_thoai: e.target.value})} /></div>
              <div className="col-7"><input type="text" className="form-control form-control-sm bg-light shadow-none" placeholder="Địa chỉ giao hàng" value={khach.dia_chi} onChange={e => setKhach({...khach, dia_chi: e.target.value})} /></div>
            </div>
            <textarea className="form-control form-control-sm bg-light shadow-none" rows="2" placeholder="Ghi chú đơn..." value={khach.ghi_chu} onChange={e => setKhach({...khach, ghi_chu: e.target.value})}></textarea>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-sm btn-outline-info flex-fill fw-bold" style={{fontSize: '0.75rem'}} onClick={() => addNote('YÊU CẦU KỸ THUẬT LẮP RÁP HOÀN CHỈNH.')}>Báo Kỹ thuật Lắp</button>
              <button className="btn btn-sm btn-outline-secondary flex-fill fw-bold" style={{fontSize: '0.75rem'}} onClick={() => addNote('GIAO NGUYÊN KIỆN - KHÁCH TỰ LẮP.')}>Khách tự lắp</button>
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto bg-light p-2">
            {cart.length === 0 ? (
              <div className="text-center text-muted mt-5 opacity-50">
                <i className="fa-solid fa-cart-shopping fs-1 mb-2"></i><br/><span className="fw-bold">Chưa có sản phẩm</span>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="bg-white border rounded-3 p-2 mb-2 shadow-sm d-flex justify-content-between align-items-center">
                  <div style={{ width: '55%', paddingRight: '10px' }}>
                    <div className="fw-bold text-dark text-truncate small">{item.ten_san_pham}</div>
                    <div className="text-danger fw-bold small mt-1">{Number(item.gia_ban).toLocaleString()} ₫</div>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <button className="btn btn-sm btn-light border" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => updateQty(item.id, -1)}><i className="fa-solid fa-minus" style={{fontSize: '10px'}}></i></button>
                    <span className="fw-bold text-center" style={{ width: '25px', fontSize: '0.9rem' }}>{item.so_luong}</span>
                    <button className="btn btn-sm btn-light border" style={{ width: '28px', height: '28px', padding: 0 }} onClick={() => updateQty(item.id, 1)}><i className="fa-solid fa-plus" style={{fontSize: '10px'}}></i></button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-white border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-bold text-muted text-uppercase">Khách cần trả:</span>
              <h3 className="fw-bold text-danger m-0">{tongTien.toLocaleString()} ₫</h3>
            </div>
            <button className="btn btn-primary w-100 fw-bold py-3 fs-5 rounded-3" onClick={checkout} disabled={cart.length === 0}>
              <i className="fa-solid fa-money-check-dollar me-2"></i>Thanh Toán
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPOS