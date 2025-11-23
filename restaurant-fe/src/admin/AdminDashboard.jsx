import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  // State lưu số liệu thống kê
  const [stats, setStats] = useState({
    totalDishes: 0,
    ordersToday: 0,
    totalUsers: 0
  });
  
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Lấy danh sách món ăn
        const dishRes = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`);
        const dishes = dishRes.ok ? await dishRes.json() : [];

        // 2. Lấy danh sách người dùng
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getall`, {
            headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const users = userRes.ok ? await userRes.json() : [];

        // 3. Lấy danh sách đơn hàng
        const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getall`, {
            headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const orders = orderRes.ok ? await orderRes.json() : [];

        // 4. Tính toán số lượng đơn "Hôm nay"
        const todayStr = new Date().toISOString().split('T')[0]; // Lấy ngày YYYY-MM-DD
        const countOrdersToday = orders.filter(order => 
            order.orderDate && order.orderDate.startsWith(todayStr)
        ).length;

        // 5. Cập nhật State
        setStats({
          totalDishes: dishes.length,
          totalUsers: users.length,
          ordersToday: countOrdersToday
        });

      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      }
    };

    fetchDashboardData();
  }, [currentUser]); // Chạy lại khi user thay đổi

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg min-h-[80vh]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Dashboard</h2>
      
      <div className="mb-8">
        <p className="text-xl text-gray-700">
          Xin chào, <span className="font-bold text-green-700">{currentUser?.username || 'Admin'}</span>! 👋
        </p>
        <p className="text-gray-500 mt-1">
          Đây là tổng quan tình hình hoạt động của nhà hàng hôm nay.
        </p>
      </div>

      {/* Grid Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Thẻ Món ăn */}
        <StatCard 
          title="TỔNG SỐ MÓN ĂN" 
          value={stats.totalDishes} 
          color="blue"
          icon="🍔"
        />

        {/* Thẻ Đơn hàng */}
        <StatCard 
          title="ĐƠN HÀNG HÔM NAY" 
          value={stats.ordersToday} 
          color="green"
          icon="📄"
        />

        {/* Thẻ Người dùng */}
        <StatCard 
          title="TỔNG NGƯỜI DÙNG" 
          value={stats.totalUsers} 
          color="yellow"
          icon="👥"
        />
      </div>
    </div>
  );
};

// Component con hiển thị thẻ (đã làm đẹp hơn)
const StatCard = ({ title, value, color, icon }) => {
  // Map màu sắc
  const colors = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  return (
    <div className={`p-6 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-shadow ${colors[color].replace('text', 'border')}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-500 font-semibold uppercase text-xs tracking-wider">{title}</h3>
          <p className={`text-4xl font-bold mt-2 ${colors[color].split(' ')[2]}`}>
            {value}
          </p>
        </div>
        <div className="text-3xl opacity-50">{icon}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;