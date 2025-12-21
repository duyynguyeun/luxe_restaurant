import React, { useState } from "react";
import Datban from "./Datban";
import { useLanguage } from "../i18n/LanguageProvider";

const Banner = () => {
  const [openForm, setOpenForm] = useState(false); // Giữ nguyên logic quản lý trạng thái

  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        // Đã thay đổi sang ảnh nhà hàng sang trọng (tông đèn vàng ấm cúng)
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      {/* Lớp phủ Gradient đen để làm nổi bật chữ và tạo chiều sâu sang trọng */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>

      {/* Nội dung chính */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <span className="block text-amber-400 font-medium tracking-[0.2em] mb-4 uppercase text-sm md:text-base animate-fade-in-up">
          {useLanguage().t('welcome')}
        </span>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl font-serif">
          {useLanguage().t('hero_title_line1')} <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">
            {useLanguage().t('hero_title_span')}
          </span>
        </h1>
        
        <p className="text-gray-200 text-lg md:text-2xl mb-10 font-light max-w-2xl mx-auto border-t border-b border-white/20 py-4">
          {useLanguage().t('hero_desc')}
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Nút Đặt bàn: Màu Amber sang trọng */}
          <button
            onClick= {() => setOpenForm(true)} 
            // Thêm class tour-booking
            className="tour-booking bg-green-800 hover:bg-yellow-400 cursor-pointer text-white px-6 py-3 rounded-full font-semibold shadow-lg transition"
          >
            {useLanguage().t('book_now')}
          </button>

          {/* Nút Menu: Hiệu ứng kính mờ (Glassmorphism) */}
          <a href="/Menu">
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold tracking-wider uppercase text-sm hover:bg-white hover:text-black transition-all duration-300 shadow-lg">
              {useLanguage().t('explore_menu')}
            </button>
          </a>
        </div>
      </div>

      {/* Logic mở form đặt bàn giữ nguyên */}
      {openForm && <Datban onClose={() => setOpenForm(false)} />}
    </section>
  );
};

export default Banner;