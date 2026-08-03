import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';

const AdminManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // State phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [metadata, setMetadata] = useState({
    totalElements: 0,
    totalPages: 1,
    pageNumber: 0,
    pageSize: 10
  });

  // Lấy danh sách đơn từ Backend
  const fetchOrders = async (page = 0) => {
    console.log('=== fetchOrders Debug ===');
    console.log('currentUser:', currentUser);
    console.log('currentUser.token exists:', !!currentUser?.token);
    
    if (!currentUser?.token) {
      setError('Chưa xác thực. Vui lòng đăng nhập.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/orders/getall?page=${page}&size=10&sort=id,desc`;
      const token = currentUser.token;
      
      console.log('Fetching from:', apiUrl);
      console.log('Token length:', token?.length);
      console.log('Token preview:', token?.substring(0, 50) + '...');
      
      const res = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Orders fetched successfully:', data);
        setOrders(data.content || []);
        if (data.metadata) {
          setMetadata(data.metadata);
        }
        setError(null);
      } else {
        const errorText = await res.text();
        console.error('API Error Response:', errorText);
        let errorDetail = errorText;
        try {
          const jsonError = JSON.parse(errorText);
          errorDetail = jsonError.message || jsonError.error || errorText;
        } catch (e) {
          // Not JSON, use plain text
        }
        const errorMsg = `Lỗi HTTP ${res.status}: ${errorDetail || 'Không thể tải danh sách đơn hàng'}`;
        console.error('Full error:', errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) { 
      const errorMsg = `Lỗi kết nối: ${err.message}`;
      console.error('Lỗi fetch:', err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrders(currentPage);
    // Lắng nghe sự kiện làm mới dữ liệu từ AdminLayout
    const handleRefresh = (event) => {
      if (event.detail === 'ORDER' || event.detail === 'ORDERS') {
        fetchOrders(currentPage);
      }
    };
    window.addEventListener('REFRESH_ADMIN_DATA', handleRefresh);
    return () => window.removeEventListener('REFRESH_ADMIN_DATA', handleRefresh);
  }, [currentUser?.token, currentPage]);

  // Cập nhật trạng thái đơn
  const updateStatus = async (id, newStatus) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/orders/update-status/${id}?status=${newStatus}`;
      const token = currentUser?.token;
      
      console.log('Updating order:', apiUrl);
      console.log('Token present:', !!token);
      
      const res = await fetch(apiUrl, { 
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        toast.success(`Cập nhật trạng thái thành công!`);
        await fetchOrders(currentPage);
      } else {
        const errorMsg = `Cập nhật thất bại: HTTP ${res.status}`;
        console.error(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      toast.error(`Lỗi: ${err.message}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Đơn hàng</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <div className="text-3xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-800">Lỗi tải dữ liệu</h3>
            <p className="text-red-700 mt-2 font-mono text-sm break-words whitespace-pre-wrap">{error}</p>
            
            {/* Debug Info */}
            <div className="bg-gray-100 border border-gray-300 rounded p-3 mt-4 text-xs font-mono">
              <div><strong>📊 Debug Info:</strong></div>
              <div>✓ Đã đăng nhập: {currentUser ? 'Yes' : 'No'}</div>
              <div>✓ Email: {currentUser?.email || 'N/A'}</div>
              <div>✓ Token: {currentUser?.token ? currentUser.token.substring(0, 30) + '...' : 'No token'}</div>
              <div>✓ API Base: {import.meta.env.VITE_API_URL || '(empty - using relative path)'}</div>
              <div>✓ Full URL: {import.meta.env.VITE_API_URL || ''}/api/orders/getall</div>
              <div className="mt-2 border-t pt-2">
                <strong>🔍 Các bước kiểm tra:</strong>
                <div>1. Mở DevTools (F12) → Console → xem error chi tiết</div>
                <div>2. Kiểm tra backend logs tại http://localhost:8080</div>
                <div>3. Đảm bảo database đang chạy</div>
                <div>4. Kiểm tra API endpoint: GET /api/orders/getall</div>
              </div>
            </div>
            
            <button 
              onClick={fetchOrders}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              🔄 Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Đơn hàng</h2>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có đơn hàng</h3>
          <p className="text-gray-500 mb-6">Danh sách đơn hàng đang trống. Hãy quay lại sau!</p>
          <button 
            onClick={fetchOrders}
            className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition"
          >
            🔄 Làm mới dữ liệu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Đơn hàng</h2>

      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Khách hàng & Địa chỉ</th>
              <th className="p-3 text-left">Món ăn</th>
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

      {/* PHÂN TRANG */}
      <div className="mt-4 bg-white p-2 rounded-xl shadow-xs border border-slate-100">
        <Pagination
          currentPage={currentPage}
          totalPages={metadata.totalPages}
          totalElements={metadata.totalElements}
          pageSize={metadata.pageSize || 10}
          itemsCount={orders.length}
          itemLabel="đơn hàng"
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default AdminManageOrders;