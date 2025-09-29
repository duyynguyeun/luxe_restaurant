import React, { useState } from "react";
import imgberger from "../assets/hamberger.webp";
import imgganuong from "../assets/ganuong.jpg";
import pho from "../assets/pho.jpg";
import banhmi from "../assets/banhmi.jpg";


const Menu = ({ title }) => {
  const [ openform, setopenform ] = useState(null);

  // Danh sách món ăn
  const danhsach = [
    {
      ten: "Hamburger",
      gia: 150000,
      mota: "Món burger đặc biệt với thịt bò, rau tươi và sốt bí mật.",
      img: imgberger,
    },
    {
      ten: "Gà nướng",
      gia: 300000,
      mota: "Gà nướng lu thơm ngon, da giòn, thịt mềm.",
      img: imgganuong,
    },
    {
      ten: "Phở",
      gia: 200000,
      mota: "Phở bò",
      img: pho,
    },
    {
      ten: "Bánh mì",
      gia: 250000,
      mota: "Bánh mì Việt Nam",
      img: banhmi,
    },
  ];

  return (
    <div className="px-5 py-10 text-2xl bg-gray-100">
      {title}
      <div className="flex justify-center items-center gap-10 flex-wrap">
        {danhsach.map((danhsach, index) => (
          <div key={index} className="w-[220px] h-[300px]">
            <button onClick={() => setopenform(danhsach)}>
              <img
                src={danhsach.img}
                alt={danhsach.ten}
                className="w-full h-[250px] object-cover rounded-t-lg transition-transform duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer shadow-md"
              />
              <div className="text-start px-3 text-base py-3 bg-white rounded-b-lg shadow-md">
                {danhsach.ten}
                <p className="text-base">{danhsach.gia.toLocaleString()}₫</p>
                <button className="border rounded-lg px-2 hover:bg-amber-300 cursor-pointer">
                  Đặt +
                </button>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Modal mô tả */}
      {openform && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setopenform(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[400px] text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setopenform(null)}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-3">{openform.ten}</h2>
            <img
              src={openform.img}
              alt={openform.ten}
              className="rounded-xl w-full h-[180px] object-cover mb-3"
            />
            <p className="text-gray-700 text-sm">{openform.mota}</p>
            <p className="mt-3 font-semibold text-green-700">
              {openform.gia.toLocaleString()}₫
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
