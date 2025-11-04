// src/components/ContactPage.js

import React, { useState } from 'react';
import { FaHome, FaEnvelope, FaPhoneAlt, FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa';

const ContactPage = () => {
  // Sử dụng state để quản lý dữ liệu form (controlled components)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn trang tải lại
    // Kiểm tra các trường bắt buộc
    if (!formData.name || !formData.email || !formData.subject) {
      alert('Vui lòng điền các trường bắt buộc có dấu *');
      return;
    }
    console.log('Thông tin liên hệ đã gửi:', formData);
    alert('Cảm ơn bạn đã gửi thông tin!');
    // Ở đây, bạn sẽ thêm logic để gửi dữ liệu đến server hoặc API
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white max-w-5xl w-full rounded-2xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row gap-10 md:gap-16">
        
        {/* === Cột thông tin bên trái === */}
        <div className="w-full md:w-2/5">
          <h1 className="text-4xl font-extrabold text-gray-800">Luxury Group</h1>
          <p className="text-lg text-gray-600 mt-2">Kế toán - Tài chính</p>
          
          <div className="mt-10 space-y-4 text-gray-700">
            <div className="flex items-center gap-4">
              <FaHome className="text-xl text-yellow-500" />
              <span>136 Xuân thủy</span>
            </div>
            <div className="flex items-center gap-4">
              <FaEnvelope className="text-xl text-yellow-500" />
              <span>nhahangviet@gmail.com</span>
            </div>
            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-xl text-yellow-500" />
              <span>*1986 nhánh 3</span>
            </div>
          </div>
          
          <div className="flex mt-12 space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
              <FaTiktok />
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-yellow-500 hover:text-white transition-colors">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* === Cột form bên phải === */}
        <div className="w-full md:w-3/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField 
              name="name" 
              placeholder="Tên của bạn*" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
            <InputField 
              name="email" 
              type="email"
              placeholder="Email*" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <InputField 
              name="phone" 
              type="tel"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
            />
            <InputField 
              name="subject" 
              placeholder="Tiêu đề*" 
              value={formData.subject}
              onChange={handleChange}
              required 
            />
            
            <textarea
              name="message"
              placeholder="Nhập nội dung..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow"
            ></textarea>
            
            <button 
              type="submit"
              className="w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              GỬI THÔNG TIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Component con để tái sử dụng cho các ô input
const InputField = ({ name, type = 'text', placeholder, value, onChange, required }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-shadow"
  />
);

export default ContactPage;