import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function Detail({ onThemVaoGio }) {
  const { id } = useParams()
  const [sp, setSp] = useState(null)
  
  // State xử lý số lượng và hình ảnh đang hiển thị
  const [soLuong, setSoLuong] = useState(1)
  const [hinhAnhHienTai, setHinhAnhHienTai] = useState('')

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/san-pham/${id}/`)
      .then(res => {
        setSp(res.data)
        // Gán ảnh mặc định khi vừa tải xong
        setHinhAnhHienTai(res.data.hinh_anh || "https://via.placeholder.com/400")
      })
      .catch(err => console.error(err))
  }, [id])

  if (!sp) return <div className="container mt-5 text-center py-5"><h4>Đang tải dữ liệu...</h4></div>

  // Xử lý khi bấm THÊM VÀO GIỎ hoặc MUA NGAY
  const handleMuaHang = () => {
    // Tạm thời mình cứ thêm vào giỏ, sau này bạn có thể nhân thuộc tính số lượng lên
    onThemVaoGio(sp) 
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
              <Link to="#" className="text-decoration-none text-muted">{sp.ten_loai}</Link>
            </li>
          )}
          <li className="breadcrumb-item active text-primary">{sp.ten_san_pham}</li>
        </ol>
      </nav>

      {/* BOX THÔNG TIN CHÍNH */}
      <div className="row bg-white p-4 rounded-4 shadow-sm mb-4 border">
        
        {/* KHU VỰC HÌNH ẢNH */}
        <div className="col-lg-5">
          <div className="main-image-wrapper">
            <img src={hinhAnhHienTai} alt={sp.ten_san_pham} />
          </div>

          <div className="thumbnail-scroll">
            <div 
              className={`thumb-item ${hinhAnhHienTai === sp.hinh_anh ? 'active' : ''}`}
              onClick={() => setHinhAnhHienTai(sp.hinh_anh || "https://via.placeholder.com/400")}
            >
              <img src={sp.hinh_anh || "https://via.placeholder.com/100"} alt="Thumb" />
            </div>
            
            {/* Nếu API của bạn có mảng hinhanhsanpham_set, React sẽ tự động lặp ra đây */}
            {sp.hinhanhsanpham_set && sp.hinhanhsanpham_set.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumb-item ${hinhAnhHienTai === img.hinh_anh ? 'active' : ''}`}
                onClick={() => setHinhAnhHienTai(img.hinh_anh)}
              >
                <img src={img.hinh_anh} alt={`Thumb ${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* KHU VỰC GIÁ VÀ CẤU HÌNH */}
        <div className="col-lg-7 ps-lg-5 mt-4 mt-lg-0 d-flex flex-column">
          <h2 className="fw-bold text-dark mb-4 lh-base">{sp.ten_san_pham}</h2>

          <div className="mb-3">
            <h5 className="fw-bold text-dark mb-3"><i className="fa-solid fa-list-check text-primary me-2"></i>Mô tả cấu hình</h5>
            {/* React dùng dangerouslySetInnerHTML để in HTML từ CKEditor của Django */}
            <div className="short-desc-box flex-grow-1" dangerouslySetInnerHTML={{ __html: sp.mo_ta_ngan || "Đang cập nhật..." }}></div>
          </div>

          <hr className="text-muted opacity-25 mt-0 mb-4" />

          <div className="mt-auto">
            <div className="price-box mb-4 bg-light p-3 rounded-3 border">
              <span className="text-danger fw-bold" style={{fontSize: '2.2rem'}}>
                {Number(sp.gia_ban).toLocaleString('vi-VN')} ₫
              </span>
            </div>

            <div className="d-flex align-items-center mb-4">
              <label className="fw-bold text-muted me-3 text-uppercase small">Số lượng:</label>
              <input 
                type="number" 
                value={soLuong} 
                onChange={(e) => setSoLuong(e.target.value)}
                min="1" 
                max={sp.ton_kho || 10} 
                className="form-control text-center shadow-none border-secondary" 
                style={{width: '90px', fontWeight: 'bold', fontSize: '1.1rem'}} 
              />
              <span className="ms-3 text-success fw-semibold small">(Còn {sp.ton_kho || 0} sản phẩm)</span>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <button onClick={handleMuaHang} className="btn btn-outline-primary py-3 fw-bold rounded-3 flex-fill btn-action" style={{borderWidth: '2px'}}>
                <i className="fa-solid fa-cart-plus me-2"></i>THÊM VÀO GIỎ
              </button>
              
              <button onClick={handleMuaHang} className="btn btn-danger py-3 fw-bold rounded-3 flex-fill shadow-sm btn-action">
                <i className="fa-solid fa-bolt me-2"></i>MUA NGAY
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOX CHI TIẾT SẢN PHẨM */}
      <div className="row">
        <div className="col-12">
          <div className="detail-desc-box">
            <h4 className="fw-bold mb-4 border-bottom pb-3 text-uppercase" style={{color: '#2b3445'}}>
              <i className="fa-solid fa-circle-info text-primary me-2"></i>Thông số kỹ thuật chi tiết
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