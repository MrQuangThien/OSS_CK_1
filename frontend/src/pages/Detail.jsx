import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function Detail({ onThemVaoGio }) {
  const { id } = useParams()
  const [sp, setSp] = useState(null)
  
  const [soLuong, setSoLuong] = useState(1)
  const [hinhAnhHienTai, setHinhAnhHienTai] = useState('')
  const navigate = useNavigate()

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/500x500?text=Chưa+có+ảnh";
    if (path.startsWith('http')) return path;
    let cleanPath = path.startsWith('/') ? path : '/' + path;
    if (!cleanPath.startsWith('/media/')) cleanPath = '/media' + cleanPath;
    return `https://computershop-api-gbkm.onrender.com${cleanPath}`;
  };

  useEffect(() => {
    axios.get(`https://computershop-api-gbkm.onrender.com/api/san-pham/${id}/`)
      .then(res => {
        setSp(res.data)
        setHinhAnhHienTai(res.data.hinh_anh || "")
      })
      .catch(err => {
        console.error(err)
        toast.error("Không tìm thấy sản phẩm!")
        navigate('/tat-ca-san-pham')
      })
  }, [id, navigate])

  const handleTang = () => {
    if (soLuong < sp.ton_kho) setSoLuong(prev => prev + 1)
    else toast.warning(`Chỉ còn tối đa ${sp.ton_kho} sản phẩm trong kho!`)
  }

  const handleGiam = () => {
    if (soLuong > 1) setSoLuong(prev => prev - 1)
  }

  const handleThemVaoGioBtn = () => {
    onThemVaoGio({ ...sp, so_luong_mua: Number(soLuong) }) 
  }

  const handleMuaNgay = () => {
    navigate('/thanh-toan', { 
      state: { 
        buyNowItem: { ...sp, so_luong: Number(soLuong) } 
      } 
    })
  }

  if (!sp) return (
    <div className="container mt-5 text-center py-5" style={{minHeight: '60vh'}}>
      <div className="spinner-border text-orange" style={{width: '3rem', height: '3rem'}}></div>
      <h5 className="mt-3 text-muted fw-bold">Đang tải thông tin sản phẩm...</h5>
    </div>
  )

  const hetHang = sp.ton_kho <= 0

  return (
    <div className="container mt-4 mb-5 pb-4 CKEDITOR_DETAIL">
      
      {/* BREADCRUMB */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb p-3 bg-white shadow-sm rounded-pill fw-semibold" style={{fontSize: '0.9rem'}}>
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none text-muted transition-hover"><i className="fa-solid fa-house me-1"></i>Trang chủ</Link>
          </li>
          {sp.loai_hang_ten && (
            <li className="breadcrumb-item">
              <Link to={`/tat-ca-san-pham?category=${sp.loai_hang}`} className="text-decoration-none text-muted transition-hover">
                {sp.loai_hang_ten}
              </Link>
            </li>
          )}
          <li className="breadcrumb-item active text-orange text-truncate" style={{maxWidth: '300px'}}>{sp.ten_san_pham}</li>
        </ol>
      </nav>

      {/* BOX THÔNG TIN CHÍNH */}
      <div className="bg-white p-3 p-lg-4 rounded-4 shadow-sm mb-4 border">
        <div className="row">
          
          {/* CỘT TRÁI: HÌNH ẢNH + CAM KẾT */}
          <div className="col-lg-5 mb-4 mb-lg-0">
            <div className="position-sticky" style={{top: '100px'}}>
              
              {/* Vùng ảnh chính */}
              <div className="border rounded-4 p-3 mb-3 d-flex justify-content-center align-items-center bg-white" style={{ height: '450px' }}>
                <img 
                  src={getImageUrl(hinhAnhHienTai)} 
                  alt={sp.ten_san_pham} 
                  className="img-fluid" 
                  style={{ maxHeight: '100%', objectFit: 'contain' }} 
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="d-flex gap-2 overflow-auto pb-2 mb-4" style={{scrollbarWidth: 'thin'}}>
                <div 
                  className={`border rounded-3 p-1 transition-hover ${hinhAnhHienTai === sp.hinh_anh ? 'border-orange border-2' : ''}`}
                  style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer' }}
                  onClick={() => setHinhAnhHienTai(sp.hinh_anh || "")}
                >
                  <img src={getImageUrl(sp.hinh_anh)} alt="Thumb chính" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                
                {sp.hinhanhsanpham_set && sp.hinhanhsanpham_set.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`border rounded-3 p-1 transition-hover ${hinhAnhHienTai === img.hinh_anh ? 'border-orange border-2' : ''}`}
                    style={{ width: '80px', height: '80px', flexShrink: 0, cursor: 'pointer' }}
                    onClick={() => setHinhAnhHienTai(img.hinh_anh)}
                  >
                    <img src={getImageUrl(img.hinh_anh)} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>

              {/* Bảng cam kết lấp khoảng trống */}
              <div className="row g-3 bg-light rounded-4 p-3 m-0 mt-3 border">
                <div className="col-12 d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                  <i className="fa-solid fa-shield-halved fs-4 text-success"></i>
                  <span className="small fw-semibold text-muted">Sản phẩm chính hãng - Bảo hành 1 ĐỔI 1</span>
                </div>
                <div className="col-12 d-flex align-items-center gap-2 mb-2 pb-2 border-bottom">
                  <i className="fa-solid fa-truck-fast fs-4 text-primary"></i>
                  <span className="small fw-semibold text-muted">Giao hàng SIÊU TỐC toàn quốc</span>
                </div>
                <div className="col-12 d-flex align-items-center gap-2">
                  <i className="fa-solid fa-check-double fs-4 text-orange"></i>
                  <span className="small fw-semibold text-muted">Kiểm tra hàng trước khi thanh toán</span>
                </div>
              </div>

            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT & MUA HÀNG (Đã bỏ d-flex flex-column để form không bị kéo giãn) */}
          <div className="col-lg-7 ps-lg-5">
            
            {(sp.la_san_pham_moi || sp.la_san_pham_noi_bat) && (
              <div className="mb-2 d-flex gap-2 align-items-center">
                {sp.la_san_pham_moi && <span className="badge bg-primary rounded-1 px-2 py-1">Mới ra mắt</span>}
                {sp.la_san_pham_noi_bat && <span className="badge bg-danger rounded-1 px-2 py-1"><i className="fa-solid fa-fire me-1"></i>Sản phẩm HOT</span>}
              </div>
            )}

            <h2 className="fw-bold text-dark mb-3 lh-base" style={{fontSize: '1.6rem'}}>{sp.ten_san_pham}</h2>

            <div className="bg-light p-3 rounded-4 mb-4 d-flex align-items-center gap-4">
              <span className="text-orange fw-bold" style={{fontSize: '2.2rem'}}>
                {Number(sp.gia_ban).toLocaleString('vi-VN')} ₫
              </span>
              <div className="border-start ps-4">
                {hetHang ? (
                  <span className="badge bg-secondary fs-6 px-3 py-2"><i className="fa-solid fa-xmark me-1"></i>Hết hàng</span>
                ) : (
                  <span className="badge bg-success fs-6 px-3 py-2"><i className="fa-solid fa-check me-1"></i>Còn {sp.ton_kho} SP</span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h6 className="fw-bold text-dark mb-2">Mô tả tóm tắt:</h6>
              <div className="text-muted" style={{lineHeight: '1.6'}} dangerouslySetInnerHTML={{ __html: sp.mo_ta_ngan || "Đang cập nhật..." }}></div>
            </div>

            {/* CỤM CHỌN SỐ LƯỢNG */}
            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
              <span className="fw-bold text-dark me-4">Số lượng:</span>
              <div className="input-group" style={{width: '130px'}}>
                <button className="btn btn-outline-secondary px-3" type="button" onClick={handleGiam} disabled={hetHang || soLuong <= 1}>-</button>
                <input 
                  type="text" 
                  className="form-control text-center fw-bold bg-white shadow-none" 
                  value={soLuong} 
                  readOnly 
                />
                <button className="btn btn-outline-secondary px-3" type="button" onClick={handleTang} disabled={hetHang || soLuong >= sp.ton_kho}>+</button>
              </div>
            </div>

            {/* NÚT MUA HÀNG (Đã fix lỗi bị rớt đáy) */}
            <div className="d-flex flex-wrap gap-3 mt-4 mb-4">
              <button 
                onClick={handleThemVaoGioBtn} 
                className={`btn py-3 fw-bold rounded-3 flex-fill ${hetHang ? 'btn-secondary opacity-50' : 'btn-outline-orange bg-orange-light'}`}
                style={{borderWidth: '2px'}}
                disabled={hetHang}
              >
                <i className="fa-solid fa-cart-plus me-2 fs-5"></i> THÊM VÀO GIỎ
              </button>
              
              <button 
                onClick={handleMuaNgay}
                className={`btn py-3 fw-bold rounded-3 flex-fill shadow-sm ${hetHang ? 'btn-secondary opacity-50' : 'btn-orange'}`}
                disabled={hetHang}
              >
                <i className="fa-solid fa-bolt me-2 fs-5"></i> MUA NGAY
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* BOX MÔ TẢ CHI TIẾT */}
      <div className="bg-white p-4 rounded-4 shadow-sm border mt-4">
        <h4 className="fw-bold mb-4 border-bottom pb-3 text-uppercase text-dark">
          <i className="fa-solid fa-circle-info text-orange me-2"></i>Mô tả chi tiết sản phẩm
        </h4>
        
        <div className="content-body CKEDITOR_CONTENT" style={{lineHeight: '1.8', color: '#4b5563', fontSize: '1.05rem', overflowX: 'auto'}}>
          <div dangerouslySetInnerHTML={{ __html: sp.mo_ta_chi_tiet || "<p class='text-muted fst-italic'>Đang cập nhật nội dung chi tiết...</p>" }}></div>
        </div>
      </div>

      <style>{`
        .bg-orange-light { background-color: #fff5f0; }
        .bg-orange-light:hover { background-color: var(--primary-orange); color: white !important; transition: 0.3s; }
        .transition-hover:hover { border-color: var(--primary-orange) !important; transform: translateY(-3px); }
        .transition-hover { transition: 0.3s ease; }
        
        /* Fix CSS cho nội dung CKEditor */
        .CKEDITOR_CONTENT img { max-width: 100% !important; height: auto !important; border-radius: 8px; margin: 15px 0; display: block; }
        .CKEDITOR_CONTENT table { width: 100% !important; margin-bottom: 1rem; border-collapse: collapse; border: 1px solid #dee2e6; }
        .CKEDITOR_CONTENT th, .CKEDITOR_CONTENT td { padding: 0.75rem; border: 1px solid #dee2e6; }
        .CKEDITOR_CONTENT th { background-color: #f8f9fa; font-weight: bold; width: 30%; }
      `}</style>
      
    </div>
  )
}

export default Detail