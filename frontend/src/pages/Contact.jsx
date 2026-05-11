import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function Contact() {
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
        tieuDe: '',
        noiDung: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ở đây sau này bạn có thể gọi API axios.post để lưu vào Database
        // Tạm thời mình dùng toast để hiển thị thông báo thành công cho sinh động
        toast.success('Gửi liên hệ thành công! ComputerShop sẽ phản hồi bạn sớm nhất.', {
            position: "top-center",
            autoClose: 3000,
        });

        // Reset form sau khi gửi
        setFormData({
            hoTen: '',
            email: '',
            soDienThoai: '',
            tieuDe: '',
            noiDung: ''
        });
    };

    return (
        <div className="container mt-4 mb-5">

            {/* BREADCRUMB */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb p-3 bg-white shadow-sm rounded-pill fw-semibold" style={{ fontSize: '0.9rem' }}>
                    <li className="breadcrumb-item">
                        <Link to="/" className="text-decoration-none text-muted transition-hover">
                            <i className="fa-solid fa-house me-1"></i>Trang chủ
                        </Link>
                    </li>
                    <li className="breadcrumb-item active text-orange">Liên hệ</li>
                </ol>
            </nav>

            <div className="row g-4">

                {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ & BẢN ĐỒ */}
                <div className="col-lg-5">
                    <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm border h-100">
                        <h3 className="fw-bold text-dark mb-4">Thông Tin Liên Hệ</h3>
                        <p className="text-muted mb-5">
                            Bạn có câu hỏi về sản phẩm, dịch vụ hay cần hỗ trợ kỹ thuật? Đừng ngần ngại liên hệ với đội ngũ ComputerShop nhé!
                        </p>

                        <div className="d-flex align-items-start mb-4">
                            <div className="bg-light-orange p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-location-dot fs-5 text-orange"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">Địa chỉ cửa hàng</h6>
                                <p className="text-muted mb-0 small">236B Đ. Lê Văn Sỹ, Tân Sơn Hòa, Hồ Chí Minh, Việt Nam</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start mb-4">
                            <div className="bg-light-orange p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-phone-volume fs-5 text-orange"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">Hotline tư vấn</h6>
                                <p className="text-muted mb-0 fw-bold text-orange">1900 1234 <span className="text-muted fw-normal small">(8:00 - 22:00)</span></p>
                            </div>
                        </div>

                        <div className="d-flex align-items-start mb-5">
                            <div className="bg-light-orange p-3 rounded-circle me-3 d-flex justify-content-center align-items-center" style={{ width: '50px', height: '50px' }}>
                                <i className="fa-solid fa-envelope fs-5 text-orange"></i>
                            </div>
                            <div>
                                <h6 className="fw-bold text-dark mb-1">Email hỗ trợ</h6>
                                <p className="text-muted mb-0 small">cskh@computershop.com.vn</p>
                            </div>
                        </div>

                        {/* BẢN ĐỒ GOOGLE MAPS */}
                        <div className="rounded-3 overflow-hidden border">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1959.5980310142927!2d106.66558994283265!3d10.796290618006827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175292e79f1e72f%3A0xae118f87eef3dca1!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBUw6BpIG5ndXnDqm4gdsOgIE3DtGkgdHLGsOG7nW5nIFRQLkhDTQ!5e0!3m2!1svi!2s!4v1778516725242!5m2!1svi!2s" 
                                width="100%" 
                                height="250" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Bản đồ ComputerShop"
                            ></iframe>
                        </div>

                    </div>
                </div>

                {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
                <div className="col-lg-7">
                    <div className="bg-white p-4 p-lg-5 rounded-4 shadow-sm border h-100">
                        <h3 className="fw-bold text-dark mb-2">Gửi Lời Nhắn Cho Chúng Tôi</h3>
                        <p className="text-muted mb-4 pb-2 border-bottom">Chúng tôi sẽ phản hồi bạn qua email hoặc số điện thoại trong vòng 24h.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="hoTen" className="form-label fw-semibold small text-muted">Họ và tên <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control form-control-lg shadow-none custom-input" id="hoTen" placeholder="Nhập họ tên của bạn" required value={formData.hoTen} onChange={handleChange} />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="soDienThoai" className="form-label fw-semibold small text-muted">Số điện thoại <span className="text-danger">*</span></label>
                                    <input type="tel" className="form-control form-control-lg shadow-none custom-input" id="soDienThoai" placeholder="Nhập số điện thoại" required value={formData.soDienThoai} onChange={handleChange} />
                                </div>

                                <div className="col-12 mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold small text-muted">Địa chỉ Email <span className="text-danger">*</span></label>
                                    <input type="email" className="form-control form-control-lg shadow-none custom-input" id="email" placeholder="example@gmail.com" required value={formData.email} onChange={handleChange} />
                                </div>

                                <div className="col-12 mb-3">
                                    <label htmlFor="tieuDe" className="form-label fw-semibold small text-muted">Chủ đề cần hỗ trợ <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control form-control-lg shadow-none custom-input" id="tieuDe" placeholder="Ví dụ: Tư vấn cấu hình PC" required value={formData.tieuDe} onChange={handleChange} />
                                </div>

                                <div className="col-12 mb-4">
                                    <label htmlFor="noiDung" className="form-label fw-semibold small text-muted">Nội dung chi tiết <span className="text-danger">*</span></label>
                                    <textarea className="form-control shadow-none custom-input" id="noiDung" rows="5" placeholder="Nhập nội dung bạn muốn gửi..." required value={formData.noiDung} onChange={handleChange}></textarea>
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="btn btn-orange w-100 py-3 fw-bold fs-6 rounded-3 shadow-sm d-flex justify-content-center align-items-center gap-2 transition-hover">
                                        <i className="fa-solid fa-paper-plane"></i> GỬI LỜI NHẮN
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

            </div>

            <style>{`
        .bg-light-orange { background-color: #fff5f0; }
        .custom-input { border: 1px solid #dee2e6; background-color: #f8f9fa; font-size: 0.95rem; }
        .custom-input:focus { background-color: #fff; border-color: var(--primary-orange); box-shadow: 0 0 0 0.2rem rgba(249, 115, 22, 0.15); }
        .transition-hover { transition: 0.3s ease; }
        .btn-orange:hover { transform: translateY(-2px); box-shadow: 0 0.5rem 1rem rgba(249, 115, 22, 0.2) !important; }
      `}</style>
        </div>
    )
}

export default Contact;