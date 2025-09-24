import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      {/* Lớp phủ mờ để chữ dễ đọc */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Nội dung */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          Nơi Ẩm Thực Hội Tụ Tinh Hoa
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Trải nghiệm không gian ấm cúng & món ăn đẳng cấp
        </p>

        <div className="flex gap-4 justify-center">
          <button className="bg-green-800 hover:bg-yellow-400 cursor-pointer text-white px-6 py-3 rounded-full font-semibold shadow-lg transition">
            Đặt bàn ngay
          </button>
          <button className="bg-white/80 hover:bg-white cursor-pointer text-black px-6 py-3 rounded-full font-semibold shadow-lg transition">
            Xem Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
