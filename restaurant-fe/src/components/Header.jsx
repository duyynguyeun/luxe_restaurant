import React from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; 
// Thêm các icon mới: UserEdit, SignOut, CaretDown
import { FaUserCircle, FaUserEdit, FaSignOutAlt, FaCaretDown } from "react-icons/fa"; 

const Header = () => {
  const { currentUser, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-[#174C34] shadow-md sticky top-0 z-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="block w-48 hover:opacity-90 transition-opacity">
          <img className="h-12 w-auto object-contain" src={logo} alt="Luxe Restaurant Logo" />
        </Link>

        {/* Menu */}
        <nav>
          <ul className="flex space-x-8 font-medium items-center text-white text-base">
            <li>
              <Link to="/" className="hover:text-yellow-400 transition-colors duration-300">Trang chủ</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-yellow-400 transition-colors duration-300">Thực đơn</Link>
            </li>
            <li>
              <Link to="/contactPage" className="hover:text-yellow-400 transition-colors duration-300">Liên hệ</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-yellow-400 transition-colors duration-300">🛒 Giỏ hàng</Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-yellow-400 transition-colors duration-300">Đơn hàng</Link>
            </li>
               
            {/* PHẦN TÀI KHOẢN - ĐƯỢC LÀM MỚI */}
            {currentUser ? (
              <li className="relative group">
                {/* Nút kích hoạt Dropdown */}
                <button className="flex items-center gap-2 py-2 text-white hover:text-yellow-300 transition-colors focus:outline-none">
                  {/* Avatar mặc định nếu chưa có ảnh */}
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-[#174C34]">
                    <FaUserCircle size={20} />
                  </div>
                  <span className="font-semibold max-w-[100px] truncate">{currentUser.username}</span>
                  {/* Mũi tên nhỏ xoay khi hover */}
                  <FaCaretDown className="text-xs transition-transform duration-300 group-hover:rotate-180" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full pt-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 translate-y-2 transition-all duration-300 ease-out">
                  
                  {/* Container chính của menu */}
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden relative">
                    
                    {/* Mũi tên tam giác chỉ lên */}
                    <div className="absolute top-0 right-6 w-4 h-4 bg-white transform -translate-y-1/2 rotate-45 border-l border-t border-gray-100"></div>

                    <div className="relative z-10 bg-white">
                      {/* Header của Dropdown: Hiển thị Email */}
                      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tài khoản</p>
                        <p className="text-sm font-bold text-gray-800 truncate mt-1">{currentUser.email}</p>
                      </div>

                      {/* Các lựa chọn */}
                      <div className="p-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-[#174C34] transition-colors"
                        >
                          <FaUserEdit className="text-lg" />
                          <span>Chỉnh sửa hồ sơ</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-1"
                        >
                          <FaSignOutAlt className="text-lg" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ) : (
              // Chưa đăng nhập
              <div className="flex items-center gap-4 ml-4">
                <Link to="/login" className="text-white hover:text-yellow-300 font-medium transition-colors">
                  Đăng nhập
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-yellow-500 text-[#174C34] px-5 py-2 rounded-full font-bold hover:bg-yellow-400 shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;