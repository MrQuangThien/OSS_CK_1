import { Link } from 'react-router-dom';

function ProductCard({ sp, onThemVaoGio }) {
  // Hàm xử lý link ảnh chống gãy
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x300?text=No+Image";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  return (
    <div className="card h-100 border-light-subtle shadow-sm rounded-4 position-relative transition-hover product-card">
      
      {/* KHU VỰC HIỂN THỊ NHÃN DÁN (BADGES) */}
      <div className="position-absolute top-0 start-0 p-3 z-1 d-flex flex-column gap-1 align-items-start">
        
        {sp.la_san_pham_moi && (
          <span className="badge bg-success rounded-1 shadow-sm px-2 py-1">MỚI</span>
        )}
        
        {/* ĐÃ SỬA Ở ĐÂY: Đổi từ sp.uu_dai thành sp.la_san_pham_noi_bat */}
        {sp.la_san_pham_noi_bat && (
          <span className="badge bg-danger rounded-1 shadow-sm px-2 py-1">
            <i className="fa-solid fa-fire me-1"></i>HOT
          </span>
        )}

      </div>

      <Link to={`/san-pham/${sp.id}`} className="text-decoration-none">
        <div className="p-3 d-flex justify-content-center align-items-center bg-white rounded-top-4" style={{height: '220px'}}>
          <img src={getImageUrl(sp.hinh_anh)} alt={sp.ten_san_pham} style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} />
        </div>
      </Link>

      <div className="card-body d-flex flex-column p-3 bg-white rounded-bottom-4 border-top border-light-subtle">
        <Link to={`/san-pham/${sp.id}`} className="text-decoration-none text-dark fw-bold mb-2 product-title" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '45px'}}>
          {sp.ten_san_pham}
        </Link>

        <div className="d-flex justify-content-between align-items-center mb-3 mt-auto">
          <span className="text-orange fw-bold fs-5">{Number(sp.gia_ban).toLocaleString('vi-VN')} ₫</span>
          {sp.ton_kho > 0 ? (
            <span className="badge bg-success rounded-pill px-2 py-1" style={{fontSize: '0.7rem'}}><i className="fa-solid fa-check me-1"></i>Còn hàng</span>
          ) : (
            <span className="badge bg-secondary rounded-pill px-2 py-1" style={{fontSize: '0.7rem'}}>Hết hàng</span>
          )}
        </div>

        <button 
          onClick={() => onThemVaoGio(sp)}
          className={`btn fw-bold w-100 py-2 rounded-3 text-warning-dark ${sp.ton_kho > 0 ? 'btn-outline-warning' : 'btn-light text-muted'}`}
          disabled={sp.ton_kho <= 0}
          style={{borderWidth: '2px'}}
        >
          <i className="fa-solid fa-cart-plus me-2"></i> {sp.ton_kho > 0 ? 'Thêm vào giỏ' : 'Tạm hết hàng'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;