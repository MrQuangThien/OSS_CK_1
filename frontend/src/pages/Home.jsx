import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard' // <-- 1. IMPORT COMPONENT Ở ĐÂY

function Home({ onThemVaoGio }) {
  const [sanPhams, setSanPhams] = useState([])
  const [loaiHangs, setLoaiHangs] = useState([])
  const [loaiDangChon, setLoaiDangChon] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/san-pham/').then(res => setSanPhams(res.data))
    axios.get('http://127.0.0.1:8000/api/loai-hang/').then(res => setLoaiHangs(res.data))
  }, [])

  const sanPhamHienThi = loaiDangChon ? sanPhams.filter(sp => sp.ten_loai === loaiDangChon) : sanPhams

  return (
    <div className="container-custom">
      
      {/* HERO SECTION (Danh mục & Banner) */}
      <div className="hero-section mt-4">
        <div className="category-sidebar">
          <div className="fs-5 fw-bold mb-3 pb-2 border-bottom text-primary">
            <i className="fa-solid fa-bars me-2"></i> DANH MỤC
          </div>
          <ul className="cat-list">
            <li className={loaiDangChon === null ? 'active' : ''} onClick={() => setLoaiDangChon(null)}>
              <i className="fa-solid fa-border-all me-2"></i> Tất cả sản phẩm
            </li>
            {loaiHangs.map(loai => (
              <li key={loai.id} className={loaiDangChon === loai.ten_loai ? 'active' : ''} onClick={() => setLoaiDangChon(loai.ten_loai)}>
                <i className="fa-solid fa-angle-right me-2 text-muted"></i> {loai.ten_loai}
              </li>
            ))}
          </ul>
        </div>

        <div className="banner-slider">
          <img src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Banner" />
          <div className="banner-content">
            <h1 className="fw-bold mb-3 display-5">Đại tiệc công nghệ</h1>
            <p className="fs-4 mb-4">Giảm giá SỐC cho Laptop Gaming & Văn phòng</p>
            <button className="btn-banner fs-5 border-0 shadow" onClick={() => setLoaiDangChon(null)}>Mua ngay hôm nay</button>
          </div>
        </div>
      </div>

      {/* SECTION SẢN PHẨM */}
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-2 mt-5">
        <h3 className="fw-bold text-uppercase m-0" style={{borderLeft: '5px solid #0d6efd', paddingLeft: '12px'}}>
          {loaiDangChon ? `Sản phẩm: ${loaiDangChon}` : 'TẤT CẢ SẢN PHẨM'}
        </h3>
        <span className="text-secondary fw-bold">{sanPhamHienThi.length} sản phẩm</span>
      </div>

      {/* LƯỚI SẢN PHẨM (ĐÃ DÙNG COMPONENT MỚI) */}
      <div className="row g-4 mb-5">
        {sanPhamHienThi.length === 0 ? (
          <div className="col-12 text-center py-5 text-muted">
            <i className="fa-solid fa-box-open mb-3" style={{fontSize: '60px'}}></i>
            <h4>Không tìm thấy sản phẩm nào!</h4>
          </div>
        ) : (
          sanPhamHienThi.map((sp) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={sp.id}>
              
              {/* <-- 2. GỌI COMPONENT PRODUCT CARD RA ĐÂY --> */}
              <ProductCard sp={sp} onThemVaoGio={onThemVaoGio} />
              
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default Home