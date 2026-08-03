import React, { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { 
  MdDashboard, 
  MdFastfood, 
  MdShoppingBag, 
  MdPeople, 
  MdExitToApp,
  MdEventSeat,
  MdBadge,
  MdLocalOffer
} from 'react-icons/md';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const AdminLayout = () => {
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-600">
      <ToastContainer position="top-right" autoClose={4000} />
      
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

          {/* NHÓM VẬT TƯ & QUẢN LÝ KHO */}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quản lý kho nguyên liệu</p>
            <SidebarLink to="/admin/inventory" icon={<MdDashboard />} label="Tổng quan kho" />
            <SidebarLink to="/admin/inventory/ingredients" icon={<MdFastfood />} label="Danh mục Nguyên liệu" />
            <SidebarLink to="/admin/inventory/import" icon={<MdLocalOffer />} label="Lập Phiếu Nhập" />
            <SidebarLink to="/admin/inventory/export" icon={<MdLocalOffer />} label="Lập Phiếu Xuất" />
            <SidebarLink to="/admin/inventory/history" icon={<FaEnvelopeOpenText />} label="Lịch sử giao dịch" />
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <SidebarLink to="/admin/promotions" icon={<MdLocalOffer />} label="Quản lý Ưu đãi" />
            <SidebarLink to="/admin/reports" icon={<FaEnvelopeOpenText />} label="Phản hồi khách hàng" />
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tài khoản</p>
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

export default AdminLayout;