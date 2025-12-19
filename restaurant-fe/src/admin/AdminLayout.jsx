import React, { useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { 
  MdDashboard, MdFastfood, MdShoppingBag, 
  MdPeople, MdExitToApp, MdEventSeat, MdBadge 
} from 'react-icons/md';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        </div>
      </aside>

      {/* Vùng hiển thị nội dung chính */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto min-h-[85vh]">
          {/* Outlet render AdminDashboard hoặc các trang con khác */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;