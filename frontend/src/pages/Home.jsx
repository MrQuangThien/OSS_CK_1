import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Home({ onThemVaoGio }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('http://127.0.0.1:8000/api/san-pham/'),
      axios.get('http://127.0.0.1:8000/api/loai-hang/')
    ]).then(([resProducts, resCategories]) => {
      setProducts(resProducts.data);
      setCategories(resCategories.data);
      setLoading(false);
    }).catch(err => console.error(err));
  }, []);

  if (loading) return <div className="text-center mt-5 py-5"><div className="spinner-border text-orange"></div></div>;

  const sanPhamMoi = products.filter(sp => sp.la_san_pham_moi);
  const sanPhamNoiBat = products.filter(sp => sp.la_san_pham_noi_bat);

  const getCategoryIcon = (name) => {
    if (!name) return 'fa-box';
    const lower = name.toLowerCase();
    if (lower.includes('laptop')) return 'fa-laptop';
    if (lower.includes('pc') || lower.includes('máy tính')) return 'fa-desktop';
    if (lower.includes('màn hình') || lower.includes('screen')) return 'fa-display';
    if (lower.includes('chuột') || lower.includes('mouse')) return 'fa-computer-mouse';
    if (lower.includes('phím') || lower.includes('keyboard')) return 'fa-keyboard';
    if (lower.includes('tai nghe') || lower.includes('headphone')) return 'fa-headphones';
    if (lower.includes('tản nhiệt') || lower.includes('fan')) return 'fa-fan';
    if (lower.includes('ram') || lower.includes('ssd') || lower.includes('hdd') || lower.includes('ổ cứng')) return 'fa-memory';
    return 'fa-microchip'; 
  };

  return (
    <div className="container py-4">
      
      {/* 1. BANNER CHÍNH (SLIDER BẰNG HÌNH ẢNH ĐÃ FIX KÍCH THƯỚC) */}
      <div className="row mb-5">
        <div className="col-12">
          <div id="bannerSlider" className="carousel slide rounded-4 overflow-hidden shadow-sm" data-bs-ride="carousel" data-bs-interval="3000">
            
            <div className="carousel-inner">
              <div className="carousel-item active">
                <Link to="/tat-ca-san-pham?is_hot=true">
                  <img 
                    src="/banner5.png"
                    // ĐÃ SỬA: Thay thế style inline bằng class banner-img
                    className="d-block w-100 banner-img" 
                    alt="Mùa Tựu Trường" 
                  />
                </Link>
              </div>

              <div className="carousel-item">
                <Link to="/tat-ca-san-pham">
                  <img 
                    src="/banner4.png"
                    // ĐÃ SỬA: Thay thế style inline bằng class banner-img
                    className="d-block w-100 banner-img" 
                    alt="Khuyến mãi khác" 
                  />
                </Link>
              </div>
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#bannerSlider" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Trước</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#bannerSlider" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Sau</span>
            </button>
            
          </div>
        </div>
      </div>

      {/* 2. CHÍNH SÁCH BÁN HÀNG */}
      <div className="row text-center mb-5 border-bottom pb-4">
        <div className="col-md-3"><i className="fa-solid fa-truck-fast text-orange fs-2 mb-2"></i><h6 className="fw-bold">Miễn phí vận chuyển</h6><small className="text-muted">Cho đơn từ 500.000đ</small></div>
        <div className="col-md-3"><i className="fa-solid fa-rotate-left text-orange fs-2 mb-2"></i><h6 className="fw-bold">Đổi trả dễ dàng</h6><small className="text-muted">Trong vòng 7 ngày</small></div>
        <div className="col-md-3"><i className="fa-solid fa-shield-halved text-orange fs-2 mb-2"></i><h6 className="fw-bold">Thanh toán an toàn</h6><small className="text-muted">Bảo mật 100%</small></div>
        <div className="col-md-3"><i className="fa-solid fa-headset text-orange fs-2 mb-2"></i><h6 className="fw-bold">Hỗ trợ 24/7</h6><small className="text-muted">Hotline: 1900 1234</small></div>
      </div>

      {/* 3. DANH MỤC NỔI BẬT */}
      <div className="mb-5">
        <h4 className="fw-bold mb-4 text-dark">Danh mục nổi bật</h4>
        <div className="d-flex justify-content-between flex-nowrap overflow-auto pb-3 gap-3 w-100 custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {categories.slice(0, 7).map(cat => (
            <Link to={`/tat-ca-san-pham?category=${cat.id}`} key={cat.id} className="text-decoration-none text-dark text-center cate-item" style={{ minWidth: '100px' }}>
              <div className="shadow-sm mx-auto mb-3 d-flex justify-content-center align-items-center bg-white rounded-circle border icon-circle transition-hover" style={{width: '85px', height: '85px'}}>
                <i className={`fa-solid ${getCategoryIcon(cat.ten_loai)} text-orange fs-3`}></i>
              </div>
              <span className="fw-bold small text-truncate d-block px-1 cate-text">{cat.ten_loai}</span>
            </Link>
          ))}
          {categories.length > 7 && (
            <Link to="/tat-ca-san-pham" className="text-decoration-none text-dark text-center cate-item" style={{ minWidth: '100px' }}>
              <div className="shadow-sm mx-auto mb-3 d-flex justify-content-center align-items-center bg-light rounded-circle border border-secondary border-opacity-25 icon-circle transition-hover" style={{width: '85px', height: '85px'}}>
                <i className="fa-solid fa-arrow-right text-muted fs-3"></i>
              </div>
              <span className="fw-bold small text-muted d-block px-1 cate-text">Xem tất cả</span>
            </Link>
          )}
        </div>
      </div>

      {/* 4. SẢN PHẨM MỚI NHẤT */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h4 className="fw-bold mb-0">Sản phẩm công nghệ mới</h4>
          <Link to="/tat-ca-san-pham?is_new=true" className="text-orange text-decoration-none fw-bold small">Xem tất cả <i className="fa-solid fa-chevron-right"></i></Link>
        </div>
        <div className="row g-4">
          {sanPhamMoi.slice(0, 4).map(sp => (
            <div key={sp.id} className="col-md-3">
              <ProductCard sp={sp} onThemVaoGio={onThemVaoGio} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. SẢN PHẨM BÁN CHẠY (NỔI BẬT) */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h4 className="fw-bold mb-0">Sản phẩm bán chạy</h4>
         <Link to="/tat-ca-san-pham?is_hot=true" className="text-orange text-decoration-none fw-bold small">Xem tất cả <i className="fa-solid fa-chevron-right"></i></Link>
        </div>
        <div className="row g-4">
          {sanPhamNoiBat.slice(0, 4).map(sp => (
            <div key={sp.id} className="col-md-3">
              <ProductCard sp={sp} onThemVaoGio={onThemVaoGio} />
            </div>
          ))}
        </div>
      </div>

      {/* STYLE BỔ SUNG */}
      <style>{`
        /* KHÓA CHẾT CHIỀU CAO BANNER */
        .banner-img {
          height: 400px;
          object-fit: cover;
          width: 100%;
        }
        /* TRÊN ĐIỆN THOẠI THÌ LÀM BANNER THẤP XUỐNG ĐỂ VỪA MÀN HÌNH */
        @media (max-width: 768px) {
          .banner-img {
            height: 200px;
          }
        }

        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .cate-item .icon-circle { transition: all 0.3s ease; }
        .cate-item:hover .icon-circle { transform: translateY(-5px); border-color: var(--primary-orange) !important; box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important; }
        .cate-item:hover .cate-text { color: var(--primary-orange) !important; }
      `}</style>
    </div>
  )
}

export default Home;