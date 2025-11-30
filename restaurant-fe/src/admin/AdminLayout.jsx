import React from 'react';
import { Link, Outlet } from 'react-router-dom';
// Bạn cần cài react-icons: npm install react-icons
import { 
  MdDashboard, 
  MdFastfood, 
  MdShoppingBag, 
  MdPeople, 
  MdExitToApp,
  MdEventSeat,
} from 'react-icons/md';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar (Thanh bên) */}
      <div className="w-64 bg-gray-800 text-white flex flex-col fixed h-full">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-yellow-400">Admin Panel</h2>
        </div>

        <nav className="flex-grow px-4">
          <SidebarLink to="/admin" icon={<MdDashboard />} label="Dashboard" />
          <SidebarLink to="/admin/menu" icon={<MdFastfood />} label="Quản lý Món ăn" />
          <SidebarLink to="/admin/orders" icon={<MdShoppingBag />} label="Quản lý Đơn hàng" />
          <SidebarLink to="/admin/reservations" icon={<MdEventSeat />} label="Quản lý Đặt bàn" />
          <SidebarLink to="/admin/users" icon={<MdPeople />} label="Quản lý Người dùng" />
        </nav>

        <div className="px-8 py-4 border-t border-gray-700">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
          >
            <MdExitToApp />
            <span>Thoát (Về trang chủ)</span>
          </Link>
        </div>
      </div>

      {/* Main Content (Nội dung chính) */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header của nội dung */}
        <header className="bg-white shadow-md p-6">
          <h1 className="text-2xl font-semibold text-gray-700">Chào mừng Admin!</h1>
        </header>
        
        {/* Nội dung trang (sẽ thay đổi) */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* <Outlet /> sẽ render AdminDashboard hoặc AdminManageMenu... */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Component phụ cho các link trên Sidebar
const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default AdminLayout;
