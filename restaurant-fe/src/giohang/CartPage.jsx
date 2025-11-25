import React, { useContext, useState } from "react";
import { CartContext } from "../giohang/CartContext";
import { FaQrcode, FaMoneyBillWave, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

// --- CẤU HÌNH THÔNG TIN TÀI KHOẢN ---
const MY_BANK = {
  BANK_ID: "MB", 
  ACCOUNT_NO: "0386984907", 
  ACCOUNT_NAME: "NGUYEN DUY HIEU", 
};

const CartPage = () => {
  // --- 1. KHAI BÁO TẤT CẢ HOOKS Ở ĐÂY (QUAN TRỌNG) ---
  const navigate = useNavigate(); 
  const { cart, addToCart, decreaseItem, removeFromCart, total } = useContext(CartContext);
  const { currentUser } = useAuth();
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "" });

  // --- 2. CÁC HÀM XỬ LÝ ---

  // Hàm tạo link QR Code
  const generateQRUrl = (amount) => {
    const content = `TT ${customerInfo.phone}`.replace(/[^a-zA-Z0-9 ]/g, "");
    return `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(MY_BANK.ACCOUNT_NAME)}`;
  };

  // Hàm kiểm tra đăng nhập trước khi thanh toán
  const handleCheckoutClick = () => {
    if (!currentUser) {
      Swal.fire({
        title: "Bạn chưa đăng nhập!",
        text: "Vui lòng đăng nhập để tiến hành thanh toán và tích điểm.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#174C34",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đăng nhập ngay",
        cancelButtonText: "Để sau",
        customClass: { popup: 'rounded-xl' }
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    setIsPaymentModalOpen(true);
  };

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
        toast.warning("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    const orderData = {
      userId: currentUser ? currentUser.id : null,
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
        toast.success("Đặt hàng thành công! Vui lòng chờ nhà hàng xác nhận.");
        setIsPaymentModalOpen(false);
        // Chuyển hướng sang trang đơn hàng (vừa chuyển trang vừa xóa giỏ hàng cũ)
        window.location.href = "/my-orders"; 
      } else {
        toast.error("Lỗi đặt hàng! Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Không thể kết nối đến Server.");
    }
  };

  // --- 3. GIAO DIỆN KHI GIỎ HÀNG TRỐNG (ĐẶT Ở ĐÂY MỚI ĐÚNG) ---
  // (Chỉ được return sau khi đã khai báo hết các Hooks bên trên)
  if (cart.length === 0) return (
    <div className="bg-gray-100 min-h-screen py-16 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full animate-fade-in-up">
        <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng đang trống</h2>
        <p className="text-gray-500 mb-8">
          Có vẻ như bạn chưa chọn món nào. Hãy quay lại thực đơn để chọn món ngon nhé!
        </p>
        <button 
          onClick={() => navigate("/menu")} 
          className="bg-[#174C34] text-white px-8 py-3 rounded-full font-bold hover:bg-yellow-500 hover:text-[#174C34] transition-all shadow-lg transform hover:-translate-y-1 w-full"
        >
          Quay lại Thực Đơn
        </button>
      </div>
    </div>
  );

  // --- 4. GIAO DIỆN CHÍNH (KHI CÓ MÓN) ---
  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🛒 Giỏ hàng của bạn</h1>
        
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
            onClick={handleCheckoutClick}
            className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-yellow-600 shadow-lg transform transition hover:-translate-y-1"
          >
            Tiến hành thanh toán
          </button>
        </div>
      </div>

      {/* --- MODAL THANH TOÁN --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsPaymentModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors sticky"
            >
              <FaTimes size={24} />
            </button>
            
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Thanh Toán</h2>

            <div className="space-y-3 mb-4">
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