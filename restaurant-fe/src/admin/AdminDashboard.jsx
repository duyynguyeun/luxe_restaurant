<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  // 1. Khai báo State
=======
import React, { useEffect, useState } from 'react';
import AdminManageReportDish from "./AdminManageReportDish";
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
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
<<<<<<< HEAD
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
=======
    const fetchDashboardData = async () => {
      try {
        const dishRes = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`);
        const dishes = dishRes.ok ? await dishRes.json() : [];

        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getall`, {
            headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const users = userRes.ok ? await userRes.json() : [];

        const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getall`, {
            headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const orders = orderRes.ok ? await orderRes.json() : [];

        const todayStr = new Date().toISOString().split('T')[0];
        const countOrdersToday = orders.filter(order => 
            order.orderDate && order.orderDate.startsWith(todayStr)
        ).length;

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
  }, [currentUser]);

  return (
    <div className="space-y-8 fade-in-up"> {/* Thêm animation class nếu có */}
      
      {/* Banner chào mừng */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Xin chào, {currentUser?.username || 'Admin'}! 👋</h2>
            <p className="text-orange-100 text-lg opacity-90">
            Chúc bạn một ngày làm việc hiệu quả. Dưới đây là tổng quan nhà hàng hôm nay.
            </p>
        </div>
        {/* Decor background circles */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white opacity-10"></div>
        <div className="absolute bottom-0 right-20 -mb-10 w-24 h-24 rounded-full bg-white opacity-10"></div>
      </div>

      {/* Grid Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          title="Tổng số món ăn" 
          value={stats.totalDishes} 
          type="dish"
          icon="🍔"
        />

        <StatCard 
          title="Đơn hàng hôm nay" 
          value={stats.ordersToday} 
          type="order"
          icon="📄"
        />

        <StatCard 
          title="Tổng khách hàng" 
          value={stats.totalUsers} 
          type="user"
          icon="👥"
        />
>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
      </div>

      {/* ====== NHÚNG BÁO CÁO MÓN ĂN ĐÃ BÁN ====== */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-slate-100">
  <AdminManageReportDish />
</div>
    </div>
  );
};

<<<<<<< HEAD
// Component thẻ thống kê (UI chuẩn Admin)
const StatCard = ({ title, value, color, icon }) => {
  const themes = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200'
=======
// Component Card được thiết kế lại theo phong cách hiện đại
const StatCard = ({ title, value, type, icon }) => {
  
  // Định nghĩa style cho từng loại thẻ
  const styles = {
    dish: {
      bgIcon: 'bg-blue-100',
      textIcon: 'text-blue-600',
      borderBot: 'border-b-blue-500' // Dùng nếu muốn border bottom
    },
    order: {
      bgIcon: 'bg-green-100',
      textIcon: 'text-green-600',
      borderBot: 'border-b-green-500'
    },
    user: {
      bgIcon: 'bg-purple-100',
      textIcon: 'text-purple-600',
      borderBot: 'border-b-purple-500'
    }
>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
  };

  const style = styles[type] || styles.dish;

  return (
<<<<<<< HEAD
    <div className={`p-8 rounded-3xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${themes[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">{title}</p>
          <p className="text-5xl font-black mt-3">{value}</p>
        </div>
        <div className="text-4xl bg-white p-3 rounded-2xl shadow-inner">{icon}</div>
=======
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wider mb-1">{title}</h3>
          <p className="text-4xl font-extrabold text-slate-800 group-hover:scale-105 transition-transform origin-left">
            {value}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl ${style.bgIcon} flex items-center justify-center text-2xl shadow-inner`}>
          <span className={style.textIcon}>{icon}</span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center text-xs text-slate-400 font-medium">
         <span className="text-green-500 mr-1 flex items-center">
            ↑ Cập nhật
         </span>
         <span>vừa xong</span>
>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
      </div>
    </div>
  );
};

export default AdminDashboard;