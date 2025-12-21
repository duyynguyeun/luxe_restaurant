import React from "react";
import { Facebook, Instagram, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

const Footer = () => {
  return (
    // THAY ĐỔI: Sử dụng Gradient đồng bộ với Header nhưng thêm padding lớn hơn để thoáng (Tươi sáng)
    <footer className="relative bg-gradient-to-r from-[#051810] via-[#174C34] to-[#051810] text-white pt-16 pb-8 mt-10 font-sans">
      
      {/* Hiệu ứng đường viền sáng (Glow Line) ở mép trên tạo cảm giác sang trọng, tươi sáng */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Cột 1: Logo + Giới thiệu */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
            Luxe Restaurant
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed text-justify opacity-90">
            {useLanguage().t('footer_about_text')}
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-[#174C34] transition-all duration-300 transform hover:-translate-y-1 border border-white/10">
              <Facebook size={18}/>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-amber-500 hover:text-[#174C34] transition-all duration-300 transform hover:-translate-y-1 border border-white/10">
              <Instagram size={18}/>
            </a>
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-amber-300 uppercase tracking-widest text-sm">{useLanguage().t('footer_explore')}</h3>
          <ul className="space-y-4">
            {[useLanguage().t('explore_home'), useLanguage().t('explore_menu_link'), useLanguage().t('explore_booking'), useLanguage().t('explore_orders')].map((item, index) => (
              <li key={index}>
                <a 
                  href={index === 0 ? "/" : index === 1 ? "/menu" : index === 2 ? "/contactPage" : "/my-orders"} 
                  className="group flex items-center gap-2 text-gray-400 hover:text-amber-300 transition-colors duration-300"
                >
                  <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-amber-500" />
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3: Thông tin liên hệ */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-amber-300 uppercase tracking-widest text-sm">{useLanguage().t('contact_title')}</h3>
          <ul className="space-y-5 text-sm text-gray-300">
            <li className="flex items-start gap-4 group">
              <div className="p-2 bg-white/5 rounded-full text-amber-400 group-hover:bg-amber-500 group-hover:text-[#174C34] transition-colors">
                <MapPin size={18} />
              </div>
              <span className="mt-1">{useLanguage().t('address')}</span>
            </li>
            <li className="flex items-center gap-4 group">
               <div className="p-2 bg-white/5 rounded-full text-amber-400 group-hover:bg-amber-500 group-hover:text-[#174C34] transition-colors">
                <Phone size={18} />
              </div>
              <span className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">{useLanguage().t('phone')}</span>
            </li>
            <li className="flex items-center gap-4 group">
               <div className="p-2 bg-white/5 rounded-full text-amber-400 group-hover:bg-amber-500 group-hover:text-[#174C34] transition-colors">
                <Mail size={18} />
              </div>
              <span className="group-hover:text-amber-300 transition-colors">{useLanguage().t('email')}</span>
            </li>
          </ul>
        </div>

        {/* Cột 4: Bản đồ */}
        <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-64 lg:h-auto">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8638558814587!2d105.78073067503173!3d21.038132787455855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab354920c233%3A0x5d0313a3bfdc4f37!2zxJDhuqFpIGjhu41jIFF14buRYyBHaWEgSMOgIE7huqlp!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(20%) contrast(1.2) opacity(0.8)' }} 
            allowFullScreen="" 
            loading="lazy"
            title="Bản đồ"
            className="w-full h-full object-cover transition-all duration-500 group-hover:filter-none group-hover:opacity-100 group-hover:scale-105"
          ></iframe>
          
          <div className="absolute inset-0 pointer-events-none border-4 border-white/10 rounded-2xl group-hover:border-amber-400/30 transition-colors duration-500"></div>
          
          <a 
            href="https://goo.gl/maps/xyz" // Thay link thật của bạn
            target="_blank" 
            rel="noreferrer"
            className="absolute bottom-4 right-4 bg-amber-500 text-[#174C34] text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-white hover:text-amber-600 transition-all duration-300 flex items-center gap-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <MapPin size={14} /> Chỉ đường
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>{useLanguage().t('copyright').replace('{year}', new Date().getFullYear())}</p>
        <div className="flex gap-6 mt-2 md:mt-0">
          <a href="#" className="hover:text-amber-300 transition-colors">{useLanguage().t('terms')}</a>
          <a href="#" className="hover:text-amber-300 transition-colors">{useLanguage().t('privacy')}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;