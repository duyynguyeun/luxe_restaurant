import React, { useContext } from "react";
import { CartContext } from "../giohang/CartContext";
// Bạn có thể import Link để thêm nút "Tiếp tục mua sắm" nếu muốn
// import { Link } from "react-router-dom"; 

const CartPage = () => {
  const { cart, addToCart, decreaseItem, removeFromCart, total } =
    useContext(CartContext);

  return (
    // 1. Nền xám cho toàn trang, thẻ trắng ở giữa
    <div className="bg-gray-100 min-h-[calc(100vh-150px)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* Tiêu đề */}
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            🛒 Giỏ hàng của bạn
          </h1>
        </div>

        {cart.length === 0 ? (
          // 2. Giao diện khi giỏ hàng rỗng (bắt mắt hơn)
          <div className="text-center py-16 px-6">
            <p className="text-xl text-gray-700">Chưa có món nào.</p>
            <p className="text-gray-500 mt-2">
              Hãy khám phá thực đơn và thêm những món ngon vào đây nhé!
            </p>
            {/* <Link to="/menu">
              <button className="mt-6 bg-yellow-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-yellow-600 transition-colors">
                Xem thực đơn
              </button>
            </Link>
            */}
          </div>
        ) : (
          // 3. Giao diện khi giỏ hàng có đồ
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Tiêu đề bảng */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Món ăn</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá</th>
                    <th className="py-4 px-6 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Số lượng</th>
                    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thành tiền</th>
                    <th className="py-4 px-6"></th> {/* Cột cho nút Xóa */}
                  </tr>
                </thead>

                {/* Danh sách món ăn */}
                <tbody className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    // 4. Mỗi hàng được thiết kế lại
                    <tr key={item.ten} className="hover:bg-gray-50 transition-colors">
                      {/* Tên món (thêm ảnh nếu có) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {item.img && ( // Thêm ảnh để đẹp hơn (logic không đổi)
                            <img
                              src={item.img}
                              alt={item.ten}
                              className="w-16 h-16 rounded-md object-cover shadow-sm"
                            />
                          )}
                          <span className="font-medium text-gray-900">{item.ten}</span>
                        </div>
                      </td>

                      {/* Giá */}
                      <td className="py-4 px-6 text-gray-700 font-medium">
                        {item.gia.toLocaleString()}₫
                      </td>

                      {/* 5. Bộ điều khiển số lượng (đẹp hơn) */}
                      <td className="py-4 px-6">
                        <div className="flex justify-center items-center border border-gray-300 rounded-full w-fit mx-auto">
                          <button
                            className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-l-full focus:outline-none"
                            onClick={() => decreaseItem(item.ten)} // ID không đổi
                          >
                            -
                          </button>
                          <span className="px-4 text-center font-medium text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-r-full focus:outline-none"
                            onClick={() => addToCart(item)}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Thành tiền */}
                      <td className="py-4 px-6 font-semibold text-green-600">
                        {(item.gia * item.quantity).toLocaleString()}₫
                      </td>

                      {/* Nút Xóa */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => removeFromCart(item.ten)} // ID không đổi
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Xóa món"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 6. Phần tổng cộng (đẹp hơn) */}
            <div className="p-6 sm:p-8 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between items-center text-xl font-semibold text-gray-800 mb-4">
                    <span>Tổng cộng:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {total.toLocaleString()}₫
                    </span>
                  </div>
                  <button className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-lg cursor-pointer ">
                    Tiến hành thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;