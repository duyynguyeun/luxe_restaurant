import React from "react";
import { useLanguage } from "../i18n/LanguageProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import imgpho from "../assets/pho.jpg";
import imgbanhmi from "../assets/banhmi.jpg";
import imgbuncha from "../assets/buncha.jpg";
import imggoicuon from "../assets/goicuon.jpg";

const dishes = [
  { img: imgpho, name: "Phở bò" },
  { img: imgbanhmi, name: "Bánh mì" },
  { img: imgbuncha, name: "Bún chả" },
  { img: imggoicuon, name: "Gỏi cuốn" },
  { img: imgpho, name: "Phở gà" },
  { img: imgbuncha, name: "Bún nem" },
  { img: imgbanhmi, name: "Bánh mì trứng" },
  { img: imggoicuon, name: "Nem cuốn" },
];

const FeaturedMenu = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-100 py-10">
      <h1 className="text-black font-bold text-center pb-10 text-3xl">
        {t('featured_title')}
      </h1>

      <div className="px-12">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}       // khoảng cách giữa các item
          slidesPerView={4}       // luôn hiện 4 món
          // navigation              // bật mũi tên
          loop={true}             // chạy vòng lặp
          autoplay={{
            delay: 3000,          // auto slide mỗi 3s
            disableOnInteraction: false,
          }}
          speed={800}             // tốc độ trượt mượt hơn
        >
          {dishes.map((dish, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl duration-300 overflow-hidden cursor-pointer">
                <img
                  src={dish.img}
                  alt={dish.name}
                  className="w-full h-56 object-cover hover:scale-105 duration-500"
                />
                <p className="text-xl text-center py-4 font-bold text-black">
                  {dish.name}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeaturedMenu;
