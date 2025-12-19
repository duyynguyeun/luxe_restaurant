import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  // 1. Khai báo State
  const [stats, setStats] = useState({
    totalDishes: 0,
    ordersToday: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // 2. Hàm lấy dữ liệu từ API (Dùng useCallback để tối ưu)
  const fetchDashboardData = useCallback(async () => {
    if (!currentUser?.token) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const authHeader = { 'Authorization': `Bearer ${currentUser.token}` };

      // Chạy 3 API cùng lúc để tăng tốc độ tải
      const [dishRes, userRes, orderRes] = await Promise.all([
        fetch(`${API_URL}/api/dish/getall`),
        fetch(`${API_URL}/api/user/getall`, { headers: authHeader }),
        fetch(`${API_URL}/api/orders/getall`, { headers: authHeader })
      ]);

      const dishes = dishRes.ok ? await dishRes.json() : [];
      const users = userRes.ok ? await userRes.json() : [];
      const orders = orderRes.ok ? await orderRes.json() : [];

      // Tính toán đơn hàng hôm nay (Dùng ngày địa phương để chính xác hơn ISO)
      const todayStr = new Date().toLocaleDateString('en-CA'); // Trả về dạng YYYY-MM-DD
      
      const orderList = Array.isArray(orders) ? orders : [];
      const countOrdersToday = orderList.filter(order => 
          order.orderDate && String(order.orderDate).startsWith(todayStr)
      ).length;

      // Cập nhật State với dữ liệu đã kiểm tra (phòng trường hợp API lỗi)
      setStats({
        totalDishes: Array.isArray(dishes) ? dishes.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0,
        ordersToday: countOrdersToday
      });

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thống kê:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 3. Xử lý logic Real-time và Khởi tạo
  useEffect(() => {
    fetchDashboardData();

    // Lắng nghe sự kiện "REFRESH_ADMIN_DATA" phát ra từ AdminLayout
    const handleRealtimeUpdate = (event) => {
      console.log(`[Real-time] Phát hiện thay đổi loại: ${event.detail}. Đang cập nhật số liệu...`);
      fetchDashboardData(); 
    };

    window.addEventListener("REFRESH_ADMIN_DATA", handleRealtimeUpdate);
    
    // Dọn dẹp listener khi Admin thoát trang
    return () => {
      window.removeEventListener("REFRESH_ADMIN_DATA", handleRealtimeUpdate);
    };
  }, [fetchDashboardData]);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-500 italic">Đang cập nhật số liệu mới nhất...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Tổng quan hệ thống</h2>
        <div className="mt-2 flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <p className="text-gray-500 text-sm font-medium">Hệ thống Real-time đang trực tuyến</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Món ăn trong thực đơn" value={stats.totalDishes} color="blue" icon="🍔" />
        <StatCard title="Đơn đặt hàng hôm nay" value={stats.ordersToday} color="green" icon="📜" />
        <StatCard title="Tổng số thành viên" value={stats.totalUsers} color="orange" icon="👥" />
      </div>

      <div className="mt-8 bg-orange-50 p-6 rounded-2xl border border-orange-100">
        <p className="text-orange-800 font-medium">
          💡 Mẹo: Khi có khách đặt món hoặc đăng ký tài khoản mới, các con số trên sẽ tự động nhảy mà không cần bạn bấm F5!
        </p>
      </div>
    </div>
  );
};

// Component thẻ thống kê (UI chuẩn Admin)
const StatCard = ({ title, value, color, icon }) => {
  const themes = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200'
  };

  return (
    <div className={`p-8 rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${themes[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">{title}</p>
          <p className="text-5xl font-black mt-3">{value}</p>
        </div>
        <div className="text-4xl bg-white p-3 rounded-2xl shadow-inner">{icon}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;