import React, { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';
<<<<<<< HEAD
import { 
  MdDashboard, MdFastfood, MdShoppingBag, 
  MdPeople, MdExitToApp, MdEventSeat, MdBadge 
=======
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  MdDashboard, 
  MdFastfood, 
  MdShoppingBag, 
  MdPeople, 
  MdExitToApp,
  MdEventSeat,
  MdBadge 
>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
} from 'react-icons/md';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = () => {
<<<<<<< HEAD
  const location = useLocation();
  const navigate = useNavigate();
  const stompClientRef = useRef(null);

  useEffect(() => {
    // 1. Cấu hình WebSocket Real-time
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Hệ thống Real-time đã sẵn sàng!');

        // Lắng nghe kênh thông báo Admin tổng hợp
        // Lưu ý: Bạn có thể dùng 1 kênh chung hoặc nhiều kênh
        client.subscribe('/topic/admin/notifications', (payload) => {
          const data = JSON.parse(payload.body);
          
          // Hiển thị thông báo Toast theo loại
          toast.info(`🔔 ${data.message}`, { theme: "colored" });

          // PHẦN QUAN TRỌNG: Phát tín hiệu để Dashboard và các trang khác tự cập nhật dữ liệu
          window.dispatchEvent(new CustomEvent("REFRESH_ADMIN_DATA", { detail: data.type }));
        });

        // Vẫn lắng nghe kênh orders cũ để đảm bảo tương thích
        client.subscribe('/topic/admin/orders', (payload) => {
          toast.success(`🛒 Đơn hàng mới: ${payload.body}`);
          window.dispatchEvent(new CustomEvent("REFRESH_ADMIN_DATA", { detail: "ORDER" }));
        });
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => { if (stompClientRef.current) stompClientRef.current.deactivate(); };
  }, []);

  const menuItems = [
    { path: '/admin/dashboard', icon: <MdDashboard size={22} />, label: 'Thống kê' },
    { path: '/admin/menu', icon: <MdFastfood size={22} />, label: 'Thực đơn' },
    { path: '/admin/orders', icon: <MdShoppingBag size={22} />, label: 'Đơn hàng' },
    { path: '/admin/users', icon: <MdPeople size={22} />, label: 'Người dùng' },
    { path: '/admin/reservations', icon: <MdEventSeat size={22} />, label: 'Đặt bàn' },
    { path: '/admin/staff', icon: <MdBadge size={22} />, label: 'Nhân viên' },
    { path: '/admin/reports', icon: <FaEnvelopeOpenText size={20} />, label: 'Phản hồi' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <ToastContainer position="top-right" autoClose={4000} />
      
      {/* Sidebar Giao diện cũ của bạn */}
      <aside className="w-64 bg-white shadow-xl flex flex-col h-screen sticky top-0 border-r border-slate-200">
        <div className="p-6 border-b bg-orange-600">
          <h1 className="text-2xl font-bold text-white">LUXE ADMIN</h1>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-orange-600 text-white shadow-lg' 
                  : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {item.icon}
              <span className="font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
            <MdExitToApp size={22} />
            <span className="font-medium">Đăng xuất</span>
          </button>
=======
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
>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
        </div>
      </aside>

<<<<<<< HEAD
      {/* Vùng hiển thị nội dung chính */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto min-h-[85vh]">
          {/* Outlet render AdminDashboard hoặc các trang con khác */}
=======
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
>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
          <Outlet />
        </div>
      </main>
    </div>
  );
};

<<<<<<< HEAD
=======
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

>>>>>>> 3f33b74aa73b4e16705d82827fc05af3c44bc6a2
export default AdminLayout;