import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  // Hàm tải danh sách đơn hàng
  const fetchOrders = () => {
    if (currentUser && currentUser.id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/orders/findOrder/${currentUser.id}`)
        .then(res => res.json())
        .then(data => setOrders(data.reverse())) // Đơn mới nhất lên đầu
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser]);

  // --- HÀM XỬ LÝ HỦY ĐƠN HÀNG ---
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/orders/update-status/${orderId}?status=CANCELLED`, 
        { method: 'PUT' }
      );

      if (response.ok) {
        toast.success("Đã hủy đơn hàng thành công!");
        fetchOrders(); // Tải lại danh sách
      } else {
        toast.error("Lỗi khi hủy đơn hàng.");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Mất kết nối đến server.");
    }
  };

  if (!currentUser) return (
    <div className="text-center py-20">
      Vui lòng <Link to="/login" className="text-blue-500 font-bold">đăng nhập</Link> để xem đơn hàng.
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">📦 Đơn hàng của tôi</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-xl">Bạn chưa có đơn hàng nào.</p>
          <Link to="/menu" className="text-green-600 hover:underline mt-2 inline-block">Đi đặt món ngay!</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              
              {/* Header của đơn hàng */}
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-800">Đơn hàng #{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                  {order.status === 'PENDING' ? 'Đang xử lý' :
                   order.status === 'CANCELLED' ? 'Đã hủy' :
                   order.status === 'COMPLETED' ? 'Hoàn thành' : order.status}
                </span>
              </div>

              {/* --- PHẦN HIỂN THỊ GHI CHÚ (NOTE) --- */}
              {order.note && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-2">
                    <span className="text-lg">📝</span>
                    <div>
                        <span className="text-sm font-bold text-gray-700">Ghi chú của bạn:</span>
                        <p className="text-sm text-gray-600 italic mt-1">{order.note}</p>
                    </div>
                </div>
              )}
              {/* ------------------------------------ */}
              
              {/* Danh sách món ăn */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {order.orderDetails && order.orderDetails.map((detail, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700">
                        <span>• {detail.dishName} <span className="font-semibold">x{detail.quantity}</span></span>
                        <span className="font-medium">{detail.price.toLocaleString()}₫</span>
                    </div>
                ))}
              </div>

              {/* Footer đơn hàng: Tổng tiền & Nút hủy */}
              <div className="mt-4 pt-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-500">
                        Thanh toán: {order.paymentMethod === 'QR_CODE' ? 'Chuyển khoản' : 'Tiền mặt'}
                    </p>
                    <p className="text-xl font-bold text-green-600 mt-1">
                        Tổng: {order.totalPrice.toLocaleString()}₫
                    </p>
                </div>

                {/* CHỈ HIỆN NÚT HỦY KHI ĐƠN HÀNG ĐANG CHỜ (PENDING) */}
                {order.status === 'PENDING' && (
                    <button 
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-sm text-sm"
                    >
                        Hủy đơn hàng
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;