import { Link } from 'react-router-dom'

function ProductCard({ sp, onThemVaoGio }) {
  // Hàm xử lý link ảnh
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x300?text=No+Image";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  return (
    <div className="card product-card h-100 rounded-4 position-relative">
      {/* Hiển thị Nhãn MỚI hoặc HOT */}
      {sp.la_san_pham_moi && !sp.uu_dai && (
        <span className="badge bg-success position-absolute top-0 start-0 m-3 z-1">MỚI</span>
      )}
      {sp.uu_dai && (
        <span className="badge bg-danger position-absolute top-0 start-0 m-3 z-1">HOT</span>
      )}

      {/* Sửa lại Link đúng với App.jsx */}
      <Link to={`/san-pham/${sp.id}`}>
        <img 
          src={getImageUrl(sp.hinh_anh)} 
          className="card-img-top p-4" 
          alt={sp.ten_san_pham} 
          style={{height: '250px', objectFit: 'contain'}} 
        />
      </Link>
      
      <div className="card-body border-top d-flex flex-column">
        <h6 className="card-title fw-bold text-truncate" title={sp.ten_san_pham}>
          {sp.ten_san_pham}
        </h6>
        
        <div className="d-flex justify-content-between align-items-center mt-2 mb-3">
          <span className="text-orange fw-bold fs-5 mb-0">
            {Number(sp.gia_ban).toLocaleString()} ₫
          </span>
          {sp.ton_kho > 0 ? (
            <span className="badge bg-success px-2 py-1"><i className="fa-solid fa-check me-1"></i>Còn hàng</span>
          ) : (
            <span className="badge bg-secondary px-2 py-1"><i className="fa-solid fa-xmark me-1"></i>Hết hàng</span>
          )}
        </div>

        {/* Nút thêm vào giỏ được đẩy xuống đáy thẻ */}
        <button 
          className="btn btn-sm btn-outline-warning w-100 fw-bold mt-auto"
          disabled={sp.ton_kho <= 0}
          onClick={() => onThemVaoGio(sp)}
        >
          <i className="fa-solid fa-cart-plus me-1"></i> Thêm vào giỏ
        </button>
      </div>
    </div>
  )
}

export default ProductCard