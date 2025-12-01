import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { 
  MdDashboard, 
  MdFastfood, 
  MdShoppingBag, 
  MdPeople, 
  MdExitToApp,
  MdEventSeat,
  MdBadge // Icon thẻ nhân viên
} from 'react-icons/md';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col fixed h-full">
        <div className="px-8 py-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-yellow-400">Admin Panel</h2>
        </div>

        <nav className="flex-grow px-4 py-4 space-y-1">
          <SidebarLink to="/admin" icon={<MdDashboard />} label="Dashboard" />
          <SidebarLink to="/admin/menu" icon={<MdFastfood />} label="Quản lý Món ăn" />
          <SidebarLink to="/admin/orders" icon={<MdShoppingBag />} label="Quản lý Đơn hàng" />
          <SidebarLink to="/admin/reservations" icon={<MdEventSeat />} label="Quản lý Đặt bàn" />
          
          <div className="pt-4 mt-4 border-t border-gray-700">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tài khoản</p>
            <SidebarLink to="/admin/users" icon={<MdPeople />} label="Khách hàng" />
            {/* THÊM DÒNG NÀY */}
            <SidebarLink to="/admin/staff" icon={<MdBadge />} label="Nhân viên" />
          </div>
        </nav>

        <div className="px-8 py-4 border-t border-gray-700">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group"
          >
            <MdExitToApp className="group-hover:text-red-400"/>
            <span>Thoát</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Hệ thống quản trị Luxe Restaurant</h1>
          <div className="text-sm text-gray-500">Xin chào, Admin</div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all hover:translate-x-1"
  >
    <span className="text-xl text-yellow-500">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default AdminLayout;