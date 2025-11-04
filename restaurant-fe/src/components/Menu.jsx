import React, { useState, useContext } from "react";
import { CartContext } from "../giohang/CartContext";
import imgberger from "../assets/hamberger.webp";
import imgganuong from "../assets/ganuong.jpg";
import pho from "../assets/pho.jpg";
import banhmi from "../assets/banhmi.jpg";

// 1. Tối ưu: Đưa danh sách món ăn ra ngoài component
// Thêm ID duy nhất cho mỗi món (Rất quan trọng)
const menuData = [
  {
    id: "hbg001",
    ten: "Hamburger",
    gia: 150000,
    mota: "Món burger đặc biệt với thịt bò, rau tươi và sốt bí mật.",
    img: imgberger,
  },
  {
    id: "gan002",
    ten: "Gà nướng",
    gia: 300000,
    mota: "Gà nướng lu thơm ngon, da giòn, thịt mềm.",
    img: imgganuong,
  },
  {
    id: "pho003",
    ten: "Phở",
    gia: 200000,
    mota: "Phở bò",
    img: pho,
  },
  {
    id: "bami004",
    ten: "Bánh mì",
    gia: 250000,
    mota: "Bánh mì Việt Nam",
    img: banhmi,
  },
];

const Menu = ({ title }) => {
  const [openform, setopenform] = useState(null);
  const { addToCart } = useContext(CartContext);

  // 2. Thêm State cho thanh tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // 3. Lọc danh sách món ăn dựa trên thanh tìm kiếm
  const filteredDanhSach = menuData.filter((mon) =>
    mon.ten.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm xử lý chung để thêm vào giỏ hàng (để tránh lặp code)
  const handleAddToCart = (mon) => {
    addToCart(mon);
    // Bạn có thể dùng toast notification ở đây thay vì alert
    // alert("Đã thêm vào giỏ hàng!!!");
  };

  return (
    // 4. Thiết kế lại container chính
    <div className="px-4 sm:px-8 lg:px-16 py-12 bg-gray-100">
      
      {/* Tiêu đề chính */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>

      {/* 5. Thanh tìm kiếm */}
      <div className="max-w-lg mx-auto mb-10">
        <input
          type="text"
          placeholder={`Tìm trong ${title}...`}
          className="w-full px-5 py-3 text-base border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 6. Thiết kế lại lưới sản phẩm (dùng Grid) */}
      {filteredDanhSach.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDanhSach.map((mon) => (
            // 7. Thiết kế lại Thẻ (Card) món ăn
            <div
              key={mon.id} // Dùng ID làm key
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              {/* Ảnh món ăn */}
              <img
                src={mon.img}
                alt={mon.ten}
                onClick={() => setopenform(mon)}
                className="w-full h-56 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              />

              {/* Thân thẻ (tên, giá, nút) */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                {/* Tên và giá */}
                <div>
                  <h3 className="font-bold text-xl mb-1 text-gray-800">{mon.ten}</h3>
                  <p className="font-semibold text-lg text-green-600 mb-4">
                    {mon.gia.toLocaleString()}₫
                  </p>
                </div>
                {/* Nút đặt hàng */}
                <button
                  className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                  onClick={() => handleAddToCart(mon)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 8. Thông báo khi không tìm thấy kết quả
        <div className="text-center py-10">
          <p className="text-lg text-gray-600">
            Không tìm thấy món ăn nào phù hợp với từ khóa "{searchTerm}".
          </p>
        </div>
      )}

      {/* Modal mô tả (Giữ nguyên logic, chỉnh lại nút) */}
      {openform && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setopenform(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-black"
              onClick={() => setopenform(null)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">{openform.ten}</h2>
            <img
              src={openform.img}
              alt={openform.ten}
              className="rounded-xl w-full h-56 object-cover mb-4 shadow-md"
            />
            <p className="text-gray-700 text-base mb-4">{openform.mota}</p>
            <p className="mt-3 font-semibold text-2xl text-green-600 mb-5">
              {openform.gia.toLocaleString()}₫
            </p>
            <button
              className="w-full bg-yellow-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-yellow-600 transition-colors"
              onClick={() => {
                handleAddToCart(openform);
                setopenform(null); // Đóng modal sau khi thêm
              }}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;