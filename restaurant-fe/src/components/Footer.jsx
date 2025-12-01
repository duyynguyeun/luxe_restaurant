import React from "react";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#174C34] text-white py-12 mt-10 border-t-4 border-yellow-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Cột 1: Logo + Giới thiệu */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 font-serif text-yellow-400">
            Luxe Restaurant
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed text-justify">
            Nơi hội tụ tinh hoa ẩm thực Việt trong không gian sang trọng và ấm cúng. Chúng tôi cam kết mang đến những trải nghiệm hương vị khó quên từ nguyên liệu tươi ngon nhất.
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wider">Khám phá</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="/" className="hover:text-yellow-400 hover:translate-x-1 transition-transform inline-block">Trang chủ</a></li>
            <li><a href="/menu" className="hover:text-yellow-400 hover:translate-x-1 transition-transform inline-block">Thực đơn đặc sắc</a></li>
            <li><a href="/contactPage" className="hover:text-yellow-400 hover:translate-x-1 transition-transform inline-block">Đặt bàn & Liên hệ</a></li>
            <li><a href="/my-orders" className="hover:text-yellow-400 hover:translate-x-1 transition-transform inline-block">Lịch sử đơn hàng</a></li>
          </ul>
        </div>

        {/* Cột 3: Thông tin liên hệ */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white uppercase tracking-wider">Liên hệ</h3>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-yellow-400 shrink-0"/>
              <span>136 Xuân Thủy, Cầu Giấy, Hà Nội</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-yellow-400 shrink-0"/>
              <span className="font-bold text-lg text-white">1900 1986</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-yellow-400 shrink-0"/>
              <span>contact@luxe-group.com</span>
            </li>
          </ul>
          {/* Mạng xã hội */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1"><Facebook size={20}/></a>
            <a href="#" className="bg-white/10 p-2.5 rounded-full hover:bg-pink-600 hover:text-white transition-all transform hover:-translate-y-1"><Instagram size={20}/></a>
          </div>
        </div>

        {/* Cột 4: Bản đồ (ĐÃ CẬP NHẬT ĐỊA CHỈ THẬT) */}
        <div className="h-56 lg:h-auto rounded-xl overflow-hidden shadow-lg border-2 border-white/20 relative group">
          {/* Iframe nhúng bản đồ 136 Xuân Thủy */}
          <iframe 
            src="https://maps.google.com/maps?q=136%20Xuân%20Thủy%2C%20Cầu%20Giấy%2C%20Hà%20Nội&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="Bản đồ 136 Xuân Thủy"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          ></iframe>
          
          {/* Nút chỉ đường - Mở sang Google Maps App/Web */}
          <a 
            href="https://www.google.com/maps/search/?api=1&query=136+Xuân+Thủy,+Cầu+Giấy,+Hà+Nội" 
            target="_blank" 
            rel="noreferrer"
            className="absolute bottom-3 right-3 bg-white text-[#174C34] text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-yellow-400 hover:text-black transition transform hover:-translate-y-1 flex items-center gap-1"
          >
            <MapPin size={14} /> Chỉ đường
          </a>
        </div>

      </div>

      {/* Bản quyền */}
      <div className="border-t border-white/10 mt-12 pt-6 text-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} Luxe Restaurant Group. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;