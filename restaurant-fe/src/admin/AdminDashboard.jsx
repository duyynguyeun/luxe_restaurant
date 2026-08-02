import React, { useEffect, useState } from 'react';
import AdminManageReportDish from "./AdminManageReportDish";
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDishes: 0,
    ordersToday: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dishRes = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`);
        const dishData = dishRes.ok ? await dishRes.json() : {};
        const totalDishes = dishData.metadata?.totalElements || (dishData.content ? dishData.content.length : (Array.isArray(dishData) ? dishData.length : 0));

        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getall`, {
            headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const userData = userRes.ok ? await userRes.json() : {};
        const totalUsers = userData.metadata?.totalElements || (userData.content ? userData.content.length : (Array.isArray(userData) ? userData.length : 0));

        const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/getall`, {
            headers: { 'Authorization': `Bearer ${currentUser?.token}` }
        });
        const orderData = orderRes.ok ? await orderRes.json() : {};
        const orders = orderData.content ? orderData.content : (Array.isArray(orderData) ? orderData : []);

        const todayStr = new Date().toISOString().split('T')[0];
        const countOrdersToday = orders.filter(order => 
            order.orderDate && order.orderDate.startsWith(todayStr)
        ).length;

        setStats({
          totalDishes,
          totalUsers,
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
      </div>

      {/* ====== NHÚNG BÁO CÁO MÓN ĂN ĐÃ BÁN ====== */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-slate-100">
  <AdminManageReportDish />
</div>
    </div>
  );
};

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
  };

  const style = styles[type] || styles.dish;

  return (
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
      </div>
    </div>
  );
};

export default AdminDashboard;