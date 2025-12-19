import React, { useEffect, useState } from 'react';

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn từ Backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getall`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.reverse()); 
      }
    } catch (err) { 
      console.error(err); 
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Cập nhật trạng thái đơn
  const updateStatus = async (id, newStatus) => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/orders/update-status/${id}?status=${newStatus}`,
      { method: 'PUT' }
    );
    fetchOrders();
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Đơn hàng</h2>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Khách hàng & Địa chỉ</th>
              <th className="p-3 text-left">Món ăn</th> {/* Cột Món ăn mới thêm */}
              <th className="p-3 text-left">Tổng tiền</th>
              <th className="p-3 text-center">Thanh toán</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">

                {/* ID */}
                <td className="p-3 font-bold text-gray-600 align-top">#{order.id}</td>

                {/* KHÁCH HÀNG & NOTE */}
                <td className="p-3 align-top w-1/4">
                  <div className="font-bold text-gray-800">{order.customerName}</div>
                  <div className="text-sm text-gray-500">📞 {order.customerPhone}</div>
                  <div className="text-sm text-gray-600 italic mt-1 border-t pt-1">
                    📍 {order.customerAddress || "Mua tại quầy / Không có địa chỉ"}
                  </div>
                  
                  {/* Hiển thị NOTE nếu có */}
                  {order.note && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100 flex items-start gap-1">
                       <span>📝</span> 
                       <span className="font-semibold">{order.note}</span>
                    </div>
                  )}
                </td>

                {/* DANH SÁCH MÓN ĂN (MỚI) */}
                <td className="p-3 align-top">
                  <ul className="space-y-1">
                    {order.orderDetails && order.orderDetails.map((item, index) => (
                      <li key={index} className="text-sm text-gray-700 border-b border-dashed border-gray-200 pb-1 last:border-0">
                        • {item.dishName} <span className="font-bold text-gray-900">x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                {/* GIÁ */}
                <td className="p-3 font-bold text-green-600 align-top">
                  {order.totalPrice?.toLocaleString()}₫
                </td>

                {/* PHƯƠNG THỨC THANH TOÁN */}
                <td className="p-3 text-center align-top">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                    order.paymentMethod === 'QR_CODE'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {order.paymentMethod === 'QR_CODE' ? 'QR Code' : 'Tiền mặt'}
                  </span>
                </td>

                {/* TRẠNG THÁI */}
                <td className="p-3 text-center align-top">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm inline-block
                    ${order.status === 'PENDING' ? 'bg-gray-200 text-gray-600' : 
                      order.status === 'PAID' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                      order.status === 'PREPARING' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border border-red-300' :
                      'bg-green-100 text-green-700 border border-green-300'}`}>
                    {
                      order.status === 'PENDING' ? 'Chờ xử lý' :
                      order.status === 'PAID' ? 'Đã thanh toán' :
                      order.status === 'PREPARING' ? 'Đang chế biến' :
                      order.status === 'CANCELLED' ? 'Đã hủy' :
                      'Hoàn thành'
                    }
                  </span>
                </td>

                {/* HÀNH ĐỘNG */}
                <td className="p-3 text-center space-x-2 align-top">
                  <div className="flex flex-col gap-2">
                    {/* B1: Pending → Paid */}
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateStatus(order.id, 'PAID')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-blue-700 shadow transition-transform active:scale-95"
                        >
                          💵 Xác nhận TT
                        </button>
                      </>
                    )}

                    {/* B2: Paid → Preparing */}
                    {order.status === 'PAID' && (
                      <button
                        onClick={() => updateStatus(order.id, 'PREPARING')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-yellow-600 shadow transition-transform active:scale-95"
                      >
                        👨‍🍳 Chế biến
                      </button>
                    )}

                    {/* B3: Preparing → Completed */}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => updateStatus(order.id, 'COMPLETED')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 shadow transition-transform active:scale-95"
                      >
                        ✅ Hoàn thành
                      </button>
                    )}

                    {/* Nút Hủy (Hiện cho các trạng thái chưa hoàn thành) */}
                    {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                      <button
                        onClick={() => updateStatus(order.id, 'CANCELLED')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-600 shadow transition-transform active:scale-95"
                      >
                        ❌ Hủy đơn
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default AdminManageOrders;