import React, { useEffect, useState } from 'react';

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);

  // Lấy danh sách đơn từ Backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getall`);
      if (res.ok) {
        // Sắp xếp đơn mới nhất lên đầu
        const data = await res.json();
        setOrders(data.reverse());
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchOrders(); }, []);

  // Cập nhật trạng thái đơn
  const updateStatus = async (id, newStatus) => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/orders/update-status/${id}?status=${newStatus}`, { method: 'PUT' });
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
              <th className="p-3 text-left">Khách hàng & Địa chỉ</th> {/* Sửa tiêu đề cột */}
              <th className="p-3 text-left">Tổng tiền</th>
              <th className="p-3 text-center">Thanh toán</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 font-bold text-gray-600">#{order.id}</td>
                
                {/* CỘT KHÁCH HÀNG - ĐÃ CẬP NHẬT */}
                <td className="p-3">
                  <div className="font-bold text-gray-800">{order.customerName}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    📞 {order.customerPhone}
                  </div>
                  {/* Hiển thị địa chỉ ở đây */}
                  <div className="text-sm text-gray-600 mt-1 italic border-t pt-1 max-w-xs">
                    📍 {order.customerAddress || "Mua tại quầy / Không có địa chỉ"}
                  </div>
                </td>

                <td className="p-3 font-bold text-green-600">{order.totalPrice?.toLocaleString()}₫</td>
                
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                    order.paymentMethod === 'QR_CODE' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {order.paymentMethod === 'QR_CODE' ? 'QR Code' : 'Tiền mặt'}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm
                    ${order.status === 'PENDING' ? 'bg-gray-200 text-gray-600' : 
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border border-green-200' : 
                      'bg-red-100 text-red-700'}`}>
                    {order.status === 'PENDING' ? 'Chờ xử lý' : 
                     order.status === 'COMPLETED' ? 'Hoàn thành' : order.status}
                  </span>
                </td>

                <td className="p-3 text-center">
                  {order.status === 'PENDING' && (
                    <button 
                      onClick={() => updateStatus(order.id, 'COMPLETED')} 
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 shadow-md transition-transform active:scale-95"
                    >
                      ✅ Xác nhận
                    </button>
                  )}
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