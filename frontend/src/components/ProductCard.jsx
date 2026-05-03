import { Link } from 'react-router-dom'

function ProductCard({ sp, onThemVaoGio }) {
  // Hàm xử lý ảnh lỗi hoặc không có ảnh
  const hinhAnh = sp.hinh_anh || "https://via.placeholder.com/200x200?text=No+Image"

  return (
    <div className="product-card card h-100 border border-light-subtle shadow-sm position-relative bg-white" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      
      {/* 1. SỬA NHÃN (BADGE): Đưa lên góc trái, bo tròn pill, thêm màu sắc nổi bật */}
      <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1" style={{ zIndex: 2 }}>
        {sp.la_san_pham_moi && <span className="badge bg-success rounded-pill shadow-sm py-1 px-2 border border-light">MỚI</span>}
        {sp.la_san_pham_noi_bat && <span className="badge bg-danger rounded-pill shadow-sm py-1 px-2 border border-light"><i className="fa-solid fa-fire me-1"></i>HOT</span>}
      </div>

      <Link to={`/san-pham/${sp.id}`} className="text-decoration-none d-flex flex-column flex-grow-1 text-dark">
        
        <div className="img-wrapper text-center p-3" style={{ height: '200px' }}>
          <img src={hinhAnh} alt={sp.ten_san_pham} className="img-fluid" style={{ maxHeight: '100%', objectFit: 'contain' }} />
        </div>
        
        <div className="card-info px-3 pt-2 flex-grow-1 d-flex flex-column">
          {/* 2. SỬA TÊN SẢN PHẨM: Chữ nhỏ lại (fs-6), in đậm, giới hạn hiển thị 2 dòng để card không bị xô lệch */}
          <h5 className="card-title fw-bold mb-1 text-dark" style={{ 
            fontSize: '0.95rem', 
            lineHeight: '1.4', 
            display: '-webkit-box', 
            WebkitLineClamp: '2', 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden',
            minHeight: '2.6rem'
          }}>
            {sp.ten_san_pham}
          </h5>
          
          <small className="text-muted mb-2">{sp.ten_loai || 'Máy tính'}</small>
          
          <div className="card-price fw-bold text-danger mb-2" style={{ fontSize: '1.2rem' }}>
            {Number(sp.gia_ban).toLocaleString('vi-VN')} ₫
          </div>
        </div>
      </Link>

      <div className="card-actions px-3 pb-3 mt-auto border-top pt-3 border-light-subtle">
        <div className="d-flex align-items-center justify-content-between w-100">
          {sp.ton_kho > 0 ? (
            <>
              {/* 3. SỬA NÚT THÊM GIỎ HÀNG: Dùng nút Primary của Bootstrap, bo góc nhẹ, có bóng đổ */}
              <button onClick={() => onThemVaoGio(sp)} className="btn btn-primary btn-sm fw-bold px-3 py-2 shadow-sm" style={{ borderRadius: '8px' }}>
                <i className="fa-solid fa-cart-plus me-1"></i> Thêm vào giỏ
              </button>
              
              {/* Nhãn còn hàng bo tròn siêu đẹp */}
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1">
                <i className="fa-solid fa-check me-1"></i>Còn hàng
              </span>
            </>
          ) : (
            <>
              <button className="btn btn-secondary btn-sm fw-bold px-3 py-2" disabled style={{ cursor: 'not-allowed', borderRadius: '8px' }}>
                <i className="fa-solid fa-ban me-1"></i> TẠM HẾT
              </button>
              <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2 py-1">
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