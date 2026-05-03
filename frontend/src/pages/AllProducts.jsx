import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

function AllProducts({ onThemVaoGio }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sanPhams, setSanPhams] = useState([])
  const [loaiHangs, setLoaiHangs] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Lấy các điều kiện lọc từ URL (Thanh địa chỉ)
  const keyword = searchParams.get('keyword') || ''
  const categoryId = searchParams.get('category') || ''
  const sortOption = searchParams.get('sort') || ''
  const minPrice = searchParams.get('min_price') || ''
  const maxPrice = searchParams.get('max_price') || ''

  // State cục bộ cho input nhập giá
  const [formMinPrice, setFormMinPrice] = useState(minPrice)
  const [formMaxPrice, setFormMaxPrice] = useState(maxPrice)

  useEffect(() => {
    // Gọi API lấy dữ liệu Danh mục và Sản phẩm
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/san-pham/'),
      axios.get('http://127.0.0.1:8000/api/loai-hang/')
    ]).then(([resSP, resLH]) => {
      setSanPhams(resSP.data)
      setLoaiHangs(resLH.data)
      setLoading(false)
    }).catch(err => console.error(err))
  }, [])

  // 2. Logic Lọc dữ liệu (Chạy ngay trên React cực nhanh)
  let filteredProducts = sanPhams.filter(sp => {
    let isMatch = true
    // Lọc theo từ khóa tìm kiếm
    if (keyword && !sp.ten_san_pham.toLowerCase().includes(keyword.toLowerCase())) isMatch = false
    // Lọc theo danh mục
    if (categoryId && sp.loai_hang.toString() !== categoryId) isMatch = false
    // Lọc theo khoảng giá
    if (minPrice && Number(sp.gia_ban) < Number(minPrice)) isMatch = false
    if (maxPrice && Number(sp.gia_ban) > Number(maxPrice)) isMatch = false
    return isMatch
  })

  // 3. Logic Sắp xếp
  if (sortOption === 'price_asc') {
    filteredProducts.sort((a, b) => Number(a.gia_ban) - Number(b.gia_ban))
  } else if (sortOption === 'price_desc') {
    filteredProducts.sort((a, b) => Number(b.gia_ban) - Number(a.gia_ban))
  }

  // Cập nhật thanh URL khi người dùng bấm Lọc
  const updateFilter = (key, value) => {
    if (value) searchParams.set(key, value)
    else searchParams.delete(key)
    setSearchParams(searchParams)
  }

  const handlePriceFilter = (e) => {
    e.preventDefault()
    updateFilter('min_price', formMinPrice)
    updateFilter('max_price', formMaxPrice)
  }

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>

  return (
    <div className="container mt-4 mb-5">
      <div className="row">
        {/* CỘT TRÁI: BỘ LỌC */}
        <div className="col-lg-3 mb-4">
          <div className="filter-sidebar position-sticky" style={{ top: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0"><i className="fa-solid fa-filter text-primary me-2"></i>BỘ LỌC</h4>
              <Link to="/tat-ca-san-pham" className="text-decoration-none small text-danger fw-bold">
                <i className="fa-solid fa-rotate-right me-1"></i>Xóa lọc
              </Link>
            </div>

            {/* Lọc danh mục */}
            <div className="mb-4">
              <div className="filter-title">Theo Danh Mục</div>
              <div className="custom-scroll mb-3">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="category" id="cat_all"
                    checked={categoryId === ''} onChange={() => updateFilter('category', '')} />
                  <label className="form-check-label" style={{ cursor: 'pointer' }} htmlFor="cat_all">Tất cả sản phẩm</label>
                </div>
                {loaiHangs.map(loai => (
                  <div className="form-check mb-2" key={loai.id}>
                    <input className="form-check-input" type="radio" name="category" id={`cat_${loai.id}`}
                      checked={categoryId === loai.id.toString()} onChange={() => updateFilter('category', loai.id.toString())} />
                    <label className="form-check-label" style={{ cursor: 'pointer' }} htmlFor={`cat_${loai.id}`}>{loai.ten_loai}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="mb-4">
              <div className="filter-title">Sắp Xếp</div>
              <select className="form-select form-select-sm" value={sortOption} onChange={(e) => updateFilter('sort', e.target.value)}>
                <option value="">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao xuống Thấp</option>
              </select>
            </div>

            {/* Lọc theo giá */}
            <form onSubmit={handlePriceFilter} className="mb-4">
              <div className="filter-title">Khoảng Giá (VNĐ)</div>
              <div className="row g-2 align-items-center">
                <div className="col-12">
                  <input type="number" className="form-control form-control-sm mb-2" placeholder="Giá TỪ..." 
                    value={formMinPrice} onChange={(e) => setFormMinPrice(e.target.value)} />
                </div>
                <div className="col-12">
                  <input type="number" className="form-control form-control-sm" placeholder="Giá ĐẾN..." 
                    value={formMaxPrice} onChange={(e) => setFormMaxPrice(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn filter-btn mt-3 border-0">LỌC THEO GIÁ</button>
            </form>
          </div>
        </div>

        {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mb-4 border">
            <h5 className="fw-bold mb-0">
              {keyword ? <span>Kết quả cho: <span className="text-primary">"{keyword}"</span></span>
               : categoryId ? 'Sản phẩm theo danh mục' : 'Tất cả sản phẩm'}
            </h5>
            <div className="text-muted small">Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm</div>
          </div>

          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(sp => (
                <ProductCard key={sp.id} sp={sp} onThemVaoGio={onThemVaoGio} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px' }} className="shadow-sm border">
                <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" style={{ width: '120px', opacity: 0.5, marginBottom: '20px' }} alt="Not found" />
                <h4 className="text-muted fw-bold">Không tìm thấy sản phẩm!</h4>
                <p className="text-muted">Vui lòng thử lại với các tiêu chí lọc khác hoặc xóa bộ lọc.</p>
                <Link to="/tat-ca-san-pham" className="btn btn-outline-primary mt-3">Xóa bộ lọc</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default AllProducts