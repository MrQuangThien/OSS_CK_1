import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // Import component vào

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

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-orange"></div></div>;

  const sanPhamMoi = products.filter(sp => sp.la_san_pham_moi);
  const sanPhamNoiBat = products.filter(sp => sp.la_san_pham_noi_bat);

  return (
    <div className="container py-4">
      
      {/* 1. BANNER CHÍNH */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="rounded-4 p-5 d-flex align-items-center" style={{backgroundColor: 'var(--light-orange)', minHeight: '350px'}}>
            <div className="w-50 ps-md-5">
              <span className="badge bg-danger mb-2 fs-6 px-3 py-2">Mùa Tựu Trường</span>
              <h1 className="display-4 fw-bold mb-3 text-dark">Siêu sale thiết bị số<br/><span className="text-orange">Giảm đến 50%++</span></h1>
              <p className="text-muted fs-5 mb-4">Hàng ngàn sản phẩm máy tính, laptop chính hãng.<br/>Giá tốt nhất dành cho bạn.</p>
              <Link to="/tat-ca-san-pham" className="btn btn-orange px-5 py-3 fw-bold rounded-pill shadow-sm">Mua ngay hôm nay</Link>
            </div>
            <div className="w-50 text-end pe-md-5">
              <img src="https://cdn.tgdd.vn/Products/Images/44/302146/macbook-pro-14-inch-m2-pro-2023-xam-thumb-600x600.jpg" alt="Banner" className="img-fluid" style={{maxHeight: '300px'}} />
            </div>
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
        <h4 className="fw-bold mb-4">Danh mục nổi bật</h4>
        <div className="d-flex justify-content-between overflow-auto pb-3">
          {categories.map(cat => (
            // Sửa link danh mục trỏ về trang tất cả sản phẩm
            <Link to="/tat-ca-san-pham" key={cat.id} className="text-decoration-none text-dark category-box text-center px-3">
              <div className="category-icon-box shadow-sm">
                <i className="fa-solid fa-laptop text-orange fs-3"></i>
              </div>
              <span className="fw-bold small">{cat.ten_loai}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. SẢN PHẨM MỚI NHẤT */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h4 className="fw-bold mb-0">Sản phẩm công nghệ mới</h4>
          <Link to="/tat-ca-san-pham" className="text-orange text-decoration-none fw-bold small">Xem tất cả <i className="fa-solid fa-chevron-right"></i></Link>
        </div>
        <div className="row g-4">
          {sanPhamMoi.slice(0, 4).map(sp => (
            <div key={sp.id} className="col-md-3">
              {/* Sử dụng Component ProductCard */}
              <ProductCard sp={sp} onThemVaoGio={onThemVaoGio} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. SẢN PHẨM BÁN CHẠY (NỔI BẬT) */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
          <h4 className="fw-bold mb-0">Sản phẩm bán chạy</h4>
          <Link to="/tat-ca-san-pham" className="text-orange text-decoration-none fw-bold small">Xem tất cả <i className="fa-solid fa-chevron-right"></i></Link>
        </div>
        <div className="row g-4">
          {sanPhamNoiBat.slice(0, 4).map(sp => (
            <div key={sp.id} className="col-md-3">
              {/* Sử dụng Component ProductCard */}
              <ProductCard sp={sp} onThemVaoGio={onThemVaoGio} />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Home;