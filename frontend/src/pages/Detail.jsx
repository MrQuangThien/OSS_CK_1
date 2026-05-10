import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Detail({ onThemVaoGio }) {
  const { id } = useParams()
  const [sp, setSp] = useState(null)
  
  // State xử lý số lượng và hình ảnh đang hiển thị
  const [soLuong, setSoLuong] = useState(1)
  const [hinhAnhHienTai, setHinhAnhHienTai] = useState('')

  // Hàm xử lý link ảnh (Bổ sung hàm này để fix lỗi gãy ảnh)
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/400x400?text=No+Image";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `http://127.0.0.1:8000${cleanPath}`;
  };

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/san-pham/${id}/`)
      .then(res => {
        setSp(res.data)
        // Gán ảnh mặc định khi vừa tải xong
        setHinhAnhHienTai(res.data.hinh_anh || "")
      })
      .catch(err => console.error(err))
  }, [id])
  
  const navigate = useNavigate() // Khai báo navigate

  if (!sp) return <div className="container mt-5 text-center py-5"><div className="spinner-border text-orange"></div><h4 className="mt-3 text-orange">Đang tải dữ liệu...</h4></div>

  // Nút THÊM VÀO GIỎ: Chỉ thêm vào giỏ, giữ nguyên trang hiện tại
  const handleThemVaoGioBtn = () => {
    onThemVaoGio(sp) 
  }

  // Nút MUA NGAY: Thêm vào giỏ, sau đó CHUYỂN NGAY sang trang thanh toán
  const handleMuaNgay = () => {
    navigate('/thanh-toan', { 
      state: { 
        buyNowItem: { ...sp, so_luong: Number(soLuong) } 
      } 
    })
  }

  return (
    <div className="container mt-4 mb-5">
      
      {/* BREADCRUMB */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb p-3 bg-white shadow-sm border rounded-3 fw-semibold" style={{fontSize: '0.9rem'}}>
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted"><i className="fa-solid fa-house me-1"></i>Trang chủ</Link>
          </li>
          {sp.ten_loai && (
            <li className="breadcrumb-item">
              <Link to="/tat-ca-san-pham" className="text-decoration-none text-muted">{sp.ten_loai}</Link>
            </li>
          )}
          <li className="breadcrumb-item active text-orange">{sp.ten_san_pham}</li>
        </ol>
      </nav>

      {/* BOX THÔNG TIN CHÍNH */}
      <div className="row bg-white p-4 rounded-4 shadow-sm mb-4 border">
        
        {/* KHU VỰC HÌNH ẢNH */}
        <div className="col-lg-5">
          <div className="main-image-wrapper border rounded-3 p-3 mb-3 text-center" style={{ height: '400px' }}>
            {/* Đã bọc hàm getImageUrl */}
            <img src={getImageUrl(hinhAnhHienTai)} alt={sp.ten_san_pham} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          </div>

          <div className="thumbnail-scroll d-flex gap-2 overflow-auto pb-2">
            <div 
              className={`thumb-item border rounded-3 p-1 cursor-pointer ${hinhAnhHienTai === sp.hinh_anh ? 'border-orange shadow-sm' : ''}`}
              style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer' }}
              onClick={() => setHinhAnhHienTai(sp.hinh_anh || "")}
            >
              {/* Đã bọc hàm getImageUrl */}
              <img src={getImageUrl(sp.hinh_anh)} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            
            {/* Nếu API của bạn có mảng hinhanhsanpham_set, React sẽ tự động lặp ra đây */}
            {sp.hinhanhsanpham_set && sp.hinhanhsanpham_set.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumb-item border rounded-3 p-1 cursor-pointer ${hinhAnhHienTai === img.hinh_anh ? 'border-orange shadow-sm' : ''}`}
                style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer' }}
                onClick={() => setHinhAnhHienTai(img.hinh_anh)}
              >
                {/* Đã bọc hàm getImageUrl */}
                <img src={getImageUrl(img.hinh_anh)} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* KHU VỰC GIÁ VÀ CẤU HÌNH */}
        <div className="col-lg-7 ps-lg-5 mt-4 mt-lg-0 d-flex flex-column">
          <h2 className="fw-bold text-dark mb-4 lh-base">{sp.ten_san_pham}</h2>

          <div className="mb-3">
            <h5 className="fw-bold text-dark mb-3"><i className="fa-solid fa-list-check text-orange me-2"></i>Mô tả cấu hình</h5>
            {/* React dùng dangerouslySetInnerHTML để in HTML từ CKEditor của Django */}
            <div className="short-desc-box flex-grow-1" dangerouslySetInnerHTML={{ __html: sp.mo_ta_ngan || "Đang cập nhật..." }}></div>
          </div>

          <hr className="text-muted opacity-25 mt-0 mb-4" />

          <div className="mt-auto">
            <div className="price-box mb-4 bg-light p-3 rounded-3 border d-flex justify-content-between align-items-center">
              <span className="text-orange fw-bold" style={{fontSize: '2.2rem'}}>
                {Number(sp.gia_ban).toLocaleString('vi-VN')} ₫
              </span>
              {/* Thêm tag trạng thái kho */}
              {sp.ton_kho > 0 ? (
                <span className="badge bg-success fs-6 px-3 py-2"><i className="fa-solid fa-check me-1"></i>Còn hàng</span>
              ) : (
                <span className="badge bg-secondary fs-6 px-3 py-2"><i className="fa-solid fa-xmark me-1"></i>Hết hàng</span>
              )}
            </div>

            <div className="d-flex align-items-center mb-4">
              <label className="fw-bold text-muted me-3 text-uppercase small">Số lượng:</label>
              <input 
                type="number" 
                value={soLuong} 
                onChange={(e) => setSoLuong(e.target.value)}
                min="1" 
                max={sp.ton_kho || 10} 
                className="form-control text-center shadow-none border-orange" 
                style={{width: '90px', fontWeight: 'bold', fontSize: '1.1rem'}} 
                disabled={sp.ton_kho <= 0}
              />
              <span className="ms-3 text-muted fw-semibold small">(Còn {sp.ton_kho || 0} sản phẩm)</span>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <button 
                onClick={handleThemVaoGioBtn}  /* ĐÃ SỬA CHỖ NÀY */
                className="btn btn-outline-orange py-3 fw-bold rounded-3 flex-fill btn-action" 
                style={{borderWidth: '2px'}}
                disabled={sp.ton_kho <= 0}
              >
                <i className="fa-solid fa-cart-plus me-2"></i>THÊM VÀO GIỎ
              </button>
              
              <button 
                onClick={handleMuaNgay} /* ĐÃ SỬA CHỖ NÀY */
                className="btn btn-orange py-3 fw-bold rounded-3 flex-fill shadow-sm btn-action"
                disabled={sp.ton_kho <= 0}
              >
                <i className="fa-solid fa-bolt me-2"></i>MUA NGAY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOX CHI TIẾT SẢN PHẨM */}
      <div className="row">
        <div className="col-12">
          <div className="detail-desc-box bg-white p-4 rounded-4 shadow-sm border">
            <h4 className="fw-bold mb-4 border-bottom pb-3 text-uppercase" style={{color: '#2b3445'}}>
              <i className="fa-solid fa-circle-info text-orange me-2"></i>Thông số kỹ thuật chi tiết
            </h4>
            <div className="content-body" style={{lineHeight: '1.8', color: '#4b5563', fontSize: '1.05rem'}} dangerouslySetInnerHTML={{ __html: sp.mo_ta_chi_tiet || "Đang cập nhật nội dung chi tiết..." }}>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Detail