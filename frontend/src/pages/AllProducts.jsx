import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

function AllProducts({ onThemVaoGio }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sanPhams, setSanPhams] = useState([])
  const [loaiHangs, setLoaiHangs] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. LẤY CÁC ĐIỀU KIỆN LỌC TỪ URL (Thêm is_new và is_hot)
  const keyword = searchParams.get('keyword') || ''
  const categoryId = searchParams.get('category') || ''
  const sortOption = searchParams.get('sort') || ''
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''
  const isNew = searchParams.get('is_new') === 'true'
  const isHot = searchParams.get('is_hot') === 'true'

  const [formMinPrice, setFormMinPrice] = useState(minPrice)
  const [formMaxPrice, setFormMaxPrice] = useState(maxPrice)

  useEffect(() => {
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/san-pham/'),
      axios.get('http://127.0.0.1:8000/api/loai-hang/')
    ]).then(([resSP, resLH]) => {
      setSanPhams(resSP.data)
      setLoaiHangs(resLH.data)
      setLoading(false)
    }).catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setFormMinPrice(searchParams.get('min_price') || '')
    setFormMaxPrice(searchParams.get('max_price') || '')
  }, [searchParams])

  // 2. LOGIC LỌC DỮ LIỆU
  let filteredProducts = sanPhams.filter(sp => {
    let isMatch = true
    if (keyword && !sp.ten_san_pham.toLowerCase().includes(keyword.toLowerCase())) isMatch = false
    if (categoryId && sp.loai_hang.toString() !== categoryId) isMatch = false
    if (minPrice && Number(sp.gia_ban) < Number(minPrice)) isMatch = false
    if (maxPrice && Number(sp.gia_ban) > Number(maxPrice)) isMatch = false
    
    // Đã thêm logic lọc theo Nhãn
    if (isNew && !sp.la_san_pham_moi) isMatch = false
    if (isHot && !sp.la_san_pham_noi_bat) isMatch = false
    
    return isMatch
  })

  // 3. LOGIC SẮP XẾP
  if (sortOption === 'price_asc') {
    filteredProducts.sort((a, b) => Number(a.gia_ban) - Number(b.gia_ban))
  } else if (sortOption === 'price_desc') {
    filteredProducts.sort((a, b) => Number(b.gia_ban) - Number(a.gia_ban))
  }

  // Cập nhật thanh URL
  const updateFilter = (key, value) => {
    if (value) searchParams.set(key, value)
    else searchParams.delete(key)
    setSearchParams(searchParams)
  }

  // Xử lý riêng cho Checkbox (Trạng thái)
  const handleCheckboxChange = (key, isChecked) => {
    if (isChecked) searchParams.set(key, 'true')
    else searchParams.delete(key)
    setSearchParams(searchParams)
  }

  const handlePriceFilter = (e) => {
    e.preventDefault()
    updateFilter('min_price', formMinPrice)
    updateFilter('max_price', formMaxPrice)
  }

  const xoaLoc = () => {
    setSearchParams({}) // Xóa sạch URL là tự reset hết
  }

  if (loading) return <div className="text-center mt-5 py-5"><div className="spinner-border text-orange"></div></div>

  // Xác định Tiêu đề hiển thị cho mượt
  const currentCategoryName = categoryId ? loaiHangs.find(c => c.id.toString() === categoryId)?.ten_loai : null;
  let pageTitle = 'Tất cả sản phẩm';
  if (keyword) pageTitle = <span>Kết quả cho: <span className="text-orange">"{keyword}"</span></span>;
  else if (currentCategoryName) pageTitle = currentCategoryName;
  else if (isHot && !isNew) pageTitle = 'Khuyến mãi HOT';
  else if (isNew && !isHot) pageTitle = 'Hàng mới về';

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        
        {/* CỘT TRÁI: BỘ LỌC */}
        <div className="col-lg-3 mb-4">
          <div className="filter-sidebar position-sticky bg-white p-4 rounded-4 shadow-sm border border-light-subtle" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h5 className="fw-bold mb-0 text-dark"><i className="fa-solid fa-filter text-orange me-2"></i>BỘ LỌC</h5>
              <button onClick={xoaLoc} className="btn btn-sm btn-link text-decoration-none small text-danger fw-bold transition-hover p-0">
                <i className="fa-solid fa-rotate-right me-1"></i>Xóa lọc
              </button>
            </div>

            {/* Trạng thái (Hàng Mới / HOT) */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark small text-uppercase mb-3">Theo Trạng Thái</h6>
              <div className="form-check mb-2 custom-checkbox">
                <input className="form-check-input shadow-none cursor-pointer" type="checkbox" id="check_new"
                  checked={isNew} onChange={(e) => handleCheckboxChange('is_new', e.target.checked)} />
                <label className="form-check-label fw-semibold text-secondary cursor-pointer" htmlFor="check_new">Hàng mới về</label>
              </div>
              <div className="form-check mb-2 custom-checkbox">
                <input className="form-check-input shadow-none cursor-pointer" type="checkbox" id="check_hot"
                  checked={isHot} onChange={(e) => handleCheckboxChange('is_hot', e.target.checked)} />
                <label className="form-check-label fw-semibold text-secondary cursor-pointer" htmlFor="check_hot">Khuyến mãi HOT</label>
              </div>
            </div>

            {/* Lọc danh mục */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark small text-uppercase mb-3">Theo Danh Mục</h6>
              <div className="custom-scroll mb-3">
                <div className="form-check mb-2 custom-radio">
                  <input className="form-check-input shadow-none cursor-pointer" type="radio" name="category" id="cat_all"
                    checked={categoryId === ''} onChange={() => updateFilter('category', '')} />
                  <label className="form-check-label fw-semibold text-secondary cursor-pointer" htmlFor="cat_all">Tất cả sản phẩm</label>
                </div>
                {loaiHangs.map(loai => (
                  <div className="form-check mb-2 custom-radio" key={loai.id}>
                    <input className="form-check-input shadow-none cursor-pointer" type="radio" name="category" id={`cat_${loai.id}`}
                      checked={categoryId === loai.id.toString()} onChange={() => updateFilter('category', loai.id.toString())} />
                    <label className="form-check-label fw-semibold text-secondary cursor-pointer" htmlFor={`cat_${loai.id}`}>{loai.ten_loai}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="mb-4">
              <h6 className="fw-bold text-dark small text-uppercase mb-3">Sắp Xếp</h6>
              <select className="form-select shadow-none border-light-subtle rounded-3 cursor-pointer" value={sortOption} onChange={(e) => updateFilter('sort', e.target.value)}>
                <option value="">Mới nhất (Mặc định)</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao xuống Thấp</option>
              </select>
            </div>

            {/* Lọc theo giá */}
            <form onSubmit={handlePriceFilter} className="mb-4">
              <h6 className="fw-bold text-dark small text-uppercase mb-3">Khoảng Giá (VNĐ)</h6>
              <div className="row g-2 align-items-center">
                <div className="col-12">
                  <input type="number" className="form-control shadow-none mb-2 border-light-subtle rounded-3" placeholder="Giá TỪ..." 
                    value={formMinPrice} onChange={(e) => setFormMinPrice(e.target.value)} />
                </div>
                <div className="col-12">
                  <input type="number" className="form-control shadow-none mb-3 border-light-subtle rounded-3" placeholder="Giá ĐẾN..." 
                    value={formMaxPrice} onChange={(e) => setFormMaxPrice(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-outline-secondary w-100 fw-bold rounded-3 transition-hover">LỌC THEO GIÁ</button>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-4 shadow-sm mb-4 border border-light-subtle">
            <h5 className="fw-bold m-0 text-dark">
              {pageTitle}
            </h5>
            <div className="text-muted small">Hiển thị <strong className="text-dark">{filteredProducts.length}</strong> sản phẩm</div>
          </div>

          <div className="row g-4">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(sp => (
                <div className="col-md-6 col-xl-4" key={sp.id}>
                  <ProductCard sp={sp} onThemVaoGio={onThemVaoGio} />
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '15px' }} className="shadow-sm border border-light-subtle mt-2">
                <i className="fa-solid fa-box-open text-muted mb-3" style={{ fontSize: '5rem', opacity: 0.3 }}></i>
                <h4 className="text-dark fw-bold mb-2">Không tìm thấy sản phẩm!</h4>
                <p className="text-muted">Vui lòng thử lại với các tiêu chí lọc khác hoặc xóa bộ lọc.</p>
                <button onClick={xoaLoc} className="btn btn-orange mt-3 px-4 rounded-pill fw-bold">Xóa bộ lọc</button>
              </div>
            )}
          </div>
        </div>

      </div>

      <style>{`
        .custom-radio .form-check-input:checked, .custom-checkbox .form-check-input:checked { background-color: var(--primary-orange); border-color: var(--primary-orange); }
        .transition-hover:hover { color: var(--primary-orange) !important; border-color: var(--primary-orange) !important; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  )
}

export default AllProducts