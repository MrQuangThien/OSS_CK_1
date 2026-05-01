import { Link } from 'react-router-dom'

function ProductCard({ sp, onThemVaoGio }) {
  // Hàm xử lý ảnh lỗi hoặc không có ảnh
  const hinhAnh = sp.hinh_anh || "https://via.placeholder.com/200x200?text=No+Image"

  return (
    <div className="product-card">
      <Link to={`/san-pham/${sp.id}`} className="text-decoration-none d-flex flex-column flex-grow-1">
        
        {sp.la_san_pham_moi && <div className="badge-new">MỚI</div>}
        {sp.la_san_pham_noi_bat && <div className="badge-hot"><i className="fa-solid fa-fire me-1"></i>HOT</div>}
        
        <div className="img-wrapper">
          <img src={hinhAnh} alt={sp.ten_san_pham} />
        </div>
        
        <div className="card-info px-3">
          <h3 className="card-title text-dark">{sp.ten_san_pham}</h3>
          <div className="card-price">{Number(sp.gia_ban).toLocaleString('vi-VN')} ₫</div>
        </div>
      </Link>

      <div className="card-actions px-3 pb-3">
        <div className="d-flex align-items-center w-100">
          {sp.ton_kho > 0 ? (
            <>
              <button onClick={() => onThemVaoGio(sp)} className="btn-add-cart">
                <i className="fa-solid fa-cart-plus me-1"></i> Thêm vào giỏ
              </button>
              <span className="stock-badge text-success ms-auto" style={{backgroundColor: '#e5f9f0'}}>
                <i className="fa-solid fa-check me-1"></i>Còn hàng
              </span>
            </>
          ) : (
            <>
              <button className="btn-add-cart bg-secondary text-white border-0" disabled style={{cursor: 'not-allowed'}}>
                <i className="fa-solid fa-ban me-1"></i> TẠM HẾT
              </button>
              <span className="stock-badge text-danger ms-auto" style={{backgroundColor: '#ffe6e6'}}>
                <i className="fa-solid fa-xmark me-1"></i>Hết hàng
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard