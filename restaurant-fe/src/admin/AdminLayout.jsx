import React from 'react';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdFastfood, 
  MdShoppingBag, 
  MdPeople, 
  MdExitToApp,
  MdEventSeat,
  MdBadge 
} from 'react-icons/md';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-600">
      
      {/* Sidebar - Chuyển sang nền trắng và shadow */}
      <div className="w-72 bg-white flex flex-col fixed h-full shadow-2xl z-10 transition-all duration-300">
        <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-center">
             {/* Logo text hoặc Image */}
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
            Luxe Admin
          </h2>
        </div>

        <nav className="flex-grow px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <SidebarLink to="/admin" icon={<MdDashboard />} label="Dashboard" />
          <SidebarLink to="/admin/menu" icon={<MdFastfood />} label="Quản lý Món ăn" />
          <SidebarLink to="/admin/orders" icon={<MdShoppingBag />} label="Quản lý Đơn hàng" />
          <SidebarLink to="/admin/reservations" icon={<MdEventSeat />} label="Quản lý Đặt bàn" />
          <SidebarLink to="/admin/reports" icon={<FaEnvelopeOpenText />} label="Phản hồi khách hàng" />
          
          <div className="pt-6 mt-6 border-t border-slate-100">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tài khoản</p>
            <SidebarLink to="/admin/users" icon={<MdPeople />} label="Khách hàng" />
            <SidebarLink to="/admin/staff" icon={<MdBadge />} label="Nhân viên" />
          </div>
        </nav>

        <div className="px-6 py-6 border-t border-slate-100 bg-slate-50">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all font-medium group"
          >
            <MdExitToApp className="text-xl group-hover:scale-110 transition-transform"/>
            <span>Đăng xuất</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-72 transition-all duration-300">
        {/* Header - Làm sạch và hiện đại hơn */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Quản trị hệ thống</h1>
            <p className="text-sm text-slate-500 mt-1">Chào mừng quay trở lại làm việc!</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                A
             </div>
             <div className="text-sm">
                <p className="font-semibold text-slate-700">Admin</p>
                <p className="text-xs text-slate-400">Quản lý cấp cao</p>
             </div>
          </div>
        </header>
        
        {/* Nội dung chính */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Component Link cải tiến với Active state giả lập và Hover đẹp hơn
const SidebarLink = ({ to, icon, label }) => {
  const location = useLocation();
  // Kiểm tra xem link có đang active không (đơn giản hoá logic match path)
  const isActive = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      className={`
        flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
        ${isActive 
            ? 'bg-orange-50 text-orange-600 shadow-sm font-semibold' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      <span className={`text-2xl transition-colors ${isActive ? 'text-orange-500' : 'text-slate-400 group-hover:text-orange-500'}`}>
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      
      {/* Chỉ báo active nhỏ bên phải */}
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
    </Link>
  );
};

export default AdminLayout;