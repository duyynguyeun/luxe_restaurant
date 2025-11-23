import React, { useContext, useState } from "react";
import { CartContext } from "../giohang/CartContext";
import { FaQrcode, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';

// --- 1. CẤU HÌNH THÔNG TIN TÀI KHOẢN CỦA BẠN ---
const MY_BANK = {
  BANK_ID: "MB", 
  ACCOUNT_NO: "0386984907", // Đã cập nhật theo ảnh bạn gửi
  ACCOUNT_NAME: "NGUYEN DUY HIEU", // Đã cập nhật theo ảnh bạn gửi
};

const CartPage = () => {
  const { cart, addToCart, decreaseItem, removeFromCart, total } = useContext(CartContext);
  const { currentUser } = useAuth();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "" });

  // --- HÀM TẠO LINK QR CODE ---
  const generateQRUrl = (amount) => {
    const content = `TT ${customerInfo.phone}`.replace(/[^a-zA-Z0-9 ]/g, "");
    return `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(MY_BANK.ACCOUNT_NAME)}`;
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
        toast.warning("Vui lòng điền đầy đủ thông tin!"); // Thay alert bằng toast.warning
        return;
    }
    const orderData = {
      userId: currentUser ? currentUser.id : null, // <-- Gửi ID nếu đã đăng nhập
      customerName: customerInfo.name || "Khách vãng lai",
      customerPhone: customerInfo.phone,
      customerAddress: customerInfo.address,
      paymentMethod: paymentMethod,
      totalPrice: total,
      items: cart.map(item => ({
        dishName: item.ten,
        quantity: item.quantity,
        price: item.gia
      }))
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        toast.success("Đặt hàng thành công!");
        setIsPaymentModalOpen(false);
        window.location.reload(); 
      } else {
        toast.error("Lỗi đặt hàng! Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Không thể kết nối đến Server.");
    }
  };

  if (cart.length === 0) return (
    <div className="text-center py-20 bg-gray-100 min-h-[50vh]">
      <p className="text-xl text-gray-500">Giỏ hàng trống!</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Giỏ hàng của bạn</h1>
        
        {/* Danh sách món ăn */}
        <div className="overflow-x-auto">
          <table className="w-full mb-6">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="p-3">Món ăn</th>
                <th className="p-3">Giá</th>
                <th className="p-3">Số lượng</th>
                <th className="p-3">Thành tiền</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.ten} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3 font-medium flex items-center gap-3">
                    {item.img && <img src={item.img} alt={item.ten} className="w-12 h-12 rounded object-cover shadow-sm" />}
                    {item.ten}
                  </td>
                  <td className="p-3 text-gray-700">{item.gia.toLocaleString()}₫</td>
                  <td className="p-3">
                    <div className="flex items-center border border-gray-300 rounded w-fit">
                      <button onClick={() => decreaseItem(item.ten)} className="px-3 py-1 hover:bg-gray-200">-</button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="px-3 py-1 hover:bg-gray-200">+</button>
                    </div>
                  </td>
                  <td className="p-3 text-green-600 font-bold">{(item.gia * item.quantity).toLocaleString()}₫</td>
                  <td className="p-3">
                    <button onClick={() => removeFromCart(item.ten)} className="text-red-500 hover:text-red-700 font-medium">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right border-t pt-6">
          <p className="text-xl font-bold mb-4 text-gray-800">
            Tổng cộng: <span className="text-green-600 text-2xl ml-2">{total.toLocaleString()}₫</span>
          </p>
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 shadow-lg transform transition hover:-translate-y-1"
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>

      {/* --- MODAL THANH TOÁN ĐÃ TỐI ƯU --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          {/* Thêm max-h và overflow-y-auto để cuộn nếu dài quá */}
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsPaymentModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors sticky"
            >
              <FaTimes size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Thanh Toán</h2>

            <div className="space-y-3 mb-4">
              {/* Gom Tên và SĐT lên cùng 1 hàng */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Tên người nhận</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" 
                    placeholder="Nhập tên..." 
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-semibold text-gray-700">Số điện thoại</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm" 
                    placeholder="Nhập sđt..." 
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">Địa chỉ</label>
                <textarea 
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-none text-sm" 
                  rows="2"
                  placeholder="Địa chỉ giao hàng..." 
                  onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} 
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button 
                onClick={() => setPaymentMethod("CASH")}
                className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all duration-200 ${paymentMethod === "CASH" ? "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
              >
                <FaMoneyBillWave size={20} />
                <span className="font-semibold text-sm">Tiền mặt</span>
              </button>
              <button 
                onClick={() => setPaymentMethod("QR_CODE")}
                className={`p-3 border rounded-xl flex flex-col items-center gap-1 transition-all duration-200 ${paymentMethod === "QR_CODE" ? "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
              >
                <FaQrcode size={20} />
                <span className="font-semibold text-sm">Chuyển khoản</span>
              </button>
            </div>

            {/* Hiển thị QR Code gọn gàng hơn */}
            {paymentMethod === "QR_CODE" && (
              <div className="text-center mb-4 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <img 
                  src={generateQRUrl(total)} 
                  alt="VietQR" 
                  className="w-40 mx-auto mb-2 mix-blend-multiply border bg-white p-1 rounded" 
                />
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Ngân hàng: <b>{MY_BANK.BANK_ID}</b> - <b>{MY_BANK.ACCOUNT_NO}</b></p>
                  <p>Chủ TK: <b>{MY_BANK.ACCOUNT_NAME}</b></p>
                  <p>Số tiền: <b className="text-blue-600 text-sm">{total.toLocaleString()}₫</b></p>
                </div>
              </div>
            )}

            <button 
              onClick={handlePayment} 
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg"
            >
              Xác nhận đặt hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;