import React, { useState } from 'react';
import { FaHome, FaEnvelope, FaPhoneAlt, FaFacebookF, FaTiktok, FaYoutube, FaLeaf, FaUserTie, FaWineGlassAlt, FaUtensils } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // 1. Import thư viện Moment để xử lý giờ

const ContactPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject) {
      toast.warning('Vui lòng điền các trường bắt buộc có dấu *');
      return;
    }

    if (!currentUser || !currentUser.id) {
        toast.info("Vui lòng đăng nhập để gửi phản hồi!");
        navigate("/login");
        return;
    }

    setIsSubmitting(true);

    const combinedText = `
[THÔNG TIN NGƯỜI GỬI]
Họ tên: ${formData.name}
Email: ${formData.email}
SĐT: ${formData.phone || 'Không có'}

[NỘI DUNG PHẢN HỒI]
Tiêu đề: ${formData.subject}
Lời nhắn: ${formData.message}
    `.trim();

    const params = new URLSearchParams();
    params.append('text', combinedText);
    params.append('imageUrl', ""); 
    
    // --- 2. SỬA LỖI GIỜ TẠI ĐÂY ---
    // Sử dụng moment() để lấy giờ hiện tại của máy (giờ VN) và format đúng chuẩn ISO không có 'Z'
    params.append('date', moment().format('YYYY-MM-DDTHH:mm:ss')); 
    // -----------------------------
    
    params.append('userId', currentUser.id);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/report/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${currentUser.token}`
            },
            body: params 
        });

        if (response.ok) {
            toast.success("Gửi thông tin thành công! Cảm ơn phản hồi của bạn.");
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); 
        } else {
            try {
                const errorText = await response.text();
                toast.error("Gửi thất bại: " + errorText);
            } catch (e) {
                toast.error("Gửi thất bại. Mã lỗi: " + response.status);
            }
        }
    } catch (error) {
        console.error(error);
        toast.error("Lỗi kết nối Server.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      
      {/* 1. HERO BANNER */}
      <div className="relative h-[400px] bg-cover bg-center flex items-center justify-center"
           style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')" }}>
        <div className="text-center text-white px-4 animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-4 font-serif tracking-wide text-yellow-400">Câu Chuyện Của Chúng Tôi</h1>
            <p className="text-xl max-w-2xl mx-auto text-gray-200 italic">
                "Không chỉ là món ăn, đó là cả một hành trình văn hóa và tâm huyết gửi gắm trong từng hương vị."
            </p>
        </div>
      </div>

      {/* 2. ABOUT US SECTION */}
      <div className="max-w-6xl mx-auto py-20 px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Cột ảnh */}
            <div className="w-full md:w-1/2 relative group">
                <img 
                    src="https://images.unsplash.com/photo-1704124388884-601d177904fc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Restaurant Interior" 
                    className="rounded-2xl shadow-2xl w-full h-[450px] object-cover transform group-hover:scale-[1.02] transition duration-500"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl hidden md:block border-l-4 border-[#174C34]">
                    <p className="text-4xl font-extrabold text-[#174C34]">10+</p>
                    <p className="text-gray-500 text-sm uppercase tracking-wide font-bold">Năm kinh nghiệm</p>
                </div>
            </div>

            {/* Cột nội dung */}
            <div className="w-full md:w-1/2">
                <h3 className="text-[#174C34] font-bold uppercase text-sm mb-2 tracking-widest flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-[#174C34]"></span> Về Luxe Restaurant
                </h3>
                <h2 className="text-4xl font-bold text-gray-800 mb-6 font-serif leading-tight">
                    Nơi Tinh Hoa <br/><span className="text-yellow-600">Ẩm Thực Hội Tụ</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed text-justify text-lg">
                    Được thành lập từ năm 2015, Luxe Restaurant mang trong mình sứ mệnh gìn giữ và nâng tầm ẩm thực Việt. 
                    Chúng tôi tin rằng, mỗi món ăn là một câu chuyện, và người đầu bếp chính là người kể chuyện tài ba nhất.
                    <br/><br/>
                    Với không gian sang trọng, ấm cúng cùng đội ngũ nhân viên chuyên nghiệp, chúng tôi cam kết mang đến cho 
                    quý khách những trải nghiệm ẩm thực khó quên nhất giữa lòng Hà Nội.
                </p>
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-6 mt-8">
                    <FeatureBox icon={<FaLeaf />} title="Nguyên liệu tươi" desc="100% Organic & Sạch" color="text-green-600" bg="bg-green-100" />
                    <FeatureBox icon={<FaUserTie />} title="Đầu bếp 5 sao" desc="Kinh nghiệm dày dặn" color="text-blue-600" bg="bg-blue-100" />
                    <FeatureBox icon={<FaUtensils />} title="Hương vị độc bản" desc="Công thức gia truyền" color="text-yellow-600" bg="bg-yellow-100" />
                    <FeatureBox icon={<FaWineGlassAlt />} title="Không gian VIP" desc="Sang trọng & Riêng tư" color="text-purple-600" bg="bg-purple-100" />
                </div>
            </div>
        </div>
      </div>

      {/* 3. CONTACT FORM SECTION */}
      <div className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl w-full mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">Liên Hệ & Góp Ý</h2>
                <div className="w-20 h-1.5 bg-[#174C34] mx-auto mt-3 rounded-full"></div>
                <p className="text-gray-500 mt-4 max-w-xl mx-auto">Chúng tôi luôn lắng nghe ý kiến của bạn để hoàn thiện hơn mỗi ngày. Hãy để lại lời nhắn nhé!</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 bg-gray-50 p-10 rounded-3xl shadow-lg border border-gray-100">
                
                {/* Thông tin liên hệ (Cột trái) */}
                <div className="w-full lg:w-2/5 space-y-8">
                    <div>
                        <h3 className="text-2xl font-extrabold text-gray-800">Luxury Group</h3>
                        <p className="text-lg text-[#174C34] font-medium mt-1">Trụ sở chính</p>
                    </div>
                    
                    <div className="space-y-6">
                        <ContactInfoItem icon={<FaHome />} text="136 Xuân Thủy, Cầu Giấy, Hà Nội" />
                        <ContactInfoItem icon={<FaEnvelope />} text="nhahangviet@gmail.com" />
                        <ContactInfoItem icon={<FaPhoneAlt />} text="1900 1986 (Nhánh 3)" />
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4 font-semibold uppercase">Kết nối với chúng tôi</p>
                        <div className="flex gap-4">
                            <SocialButton icon={<FaFacebookF />} />
                            <SocialButton icon={<FaTiktok />} />
                            <SocialButton icon={<FaYoutube />} />
                        </div>
                    </div>
                </div>

                {/* Form điền (Cột phải) */}
                <div className="w-full lg:w-3/5 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField name="name" placeholder="Tên của bạn *" value={formData.name} onChange={handleChange} required />
                            <InputField name="email" type="email" placeholder="Email liên hệ *" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InputField name="phone" type="tel" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
                            <InputField name="subject" placeholder="Tiêu đề *" value={formData.subject} onChange={handleChange} required />
                        </div>
                        
                        <textarea
                            name="message"
                            placeholder="Nội dung lời nhắn..."
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174C34] focus:bg-white transition-all text-gray-700 resize-none"
                        ></textarea>
                        
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-[#174C34] text-white font-bold py-4 rounded-xl hover:bg-green-900 transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'ĐANG GỬI...' : 'GỬI THÔNG TIN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- CÁC COMPONENT CON (GIỮ NGUYÊN) ---

const FeatureBox = ({ icon, title, desc, color, bg }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
        <div className={`${bg} ${color} p-3 rounded-full text-xl`}>{icon}</div>
        <div>
            <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
            <p className="text-sm text-gray-500">{desc}</p>
        </div>
    </div>
);

const ContactInfoItem = ({ icon, text }) => (
    <div className="flex items-center gap-4 group">
        <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600 text-xl group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
            {icon}
        </div>
        <span className="text-gray-700 font-medium text-lg">{text}</span>
    </div>
);

const SocialButton = ({ icon }) => (
    <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#174C34] hover:text-white transition-colors duration-300 transform hover:scale-110">
        {icon}
    </a>
);

const InputField = ({ name, type = 'text', placeholder, value, onChange, required }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#174C34] focus:bg-white transition-all text-gray-700"
  />
);

export default ContactPage;