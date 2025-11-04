import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext"; // 1. Import hook
import { FaUserCircle } from "react-icons/fa"; // Cài thêm: npm install react-icons

const Header = () => {
  const { currentUser, logout } = useAuth(); // 2. Lấy user và hàm logout

  return (
    <header className="bg-[#174C34] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          <img className="h-10 w-full" src={logo} alt="logo" />
        </Link>

        {/* Menu */}
        <nav>
          <ul className="flex space-x-6 font-medium items-center text-white">
            <li>
              <Link to="/" className="hover:text-yellow-300">Trang chủ</Link>
            </li>
            <li>
              <Link to="/menu" className="hover:text-yellow-300">Menu</Link>
            </li>
            <li>
              <Link to="/contactPage" className="hover:text-yellow-300">Liên hệ</Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-yellow-300">🛒 Giỏ hàng</Link>
            </li>

            {/* 3. PHẦN QUAN TRỌNG: KIỂM TRA ĐĂNG NHẬP */}
            {currentUser ? (
              // Nếu ĐÃ đăng nhập
              <>
                <li className="relative group">
                  <span className="flex items-center gap-2 hover:text-yellow-300 cursor-pointer">
                    <FaUserCircle className="text-xl" />
                    {currentUser.username} {/* Hiển thị tên */}
                  </span>
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Chỉnh sửa hồ sơ
                    </Link>
                    <button
                      onClick={logout} // Gọi hàm logout
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </li>
              </>
            ) : (
              // Nếu CHƯA đăng nhập
              <>
                <li>
                  <Link to="/signup" className="hover:text-yellow-300">Đăng kí</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-yellow-300">Đăng nhập</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

