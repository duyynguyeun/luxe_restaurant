import React from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom"; // <-- BƯỚC 1: IMPORT <LINK>

const Header = () => {
  return (
    <header className="bg-[#174C34] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        {/* BƯỚC 2: THAY <a> THÀNH <Link> */}
        <Link to="/" className="text-2xl font-bold text-white">
          <img className="h-10 w-full" src={logo} alt="logo" />
        </Link>

        {/* Menu */}
        <nav>
          <ul className="flex space-x-6 font-medium">
            <li>
              <Link to="/" className="text-white hover:text-yellow-300">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/menu" className="text-white hover:text-yellow-300">
                Menu
              </Link>
            </li>
            <li>
              {/* Giả sử bạn có trang giới thiệu, nếu không hãy đổi link */}
              <Link to="/gioi-thieu" className="text-white hover:text-yellow-300">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contactPage" className="text-white hover:text-yellow-300">
                Liên hệ
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-white hover:text-yellow-300">
                Đăng kí
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:text-yellow-300">
                Đăng nhập
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-white hover:text-yellow-300">
                🛒 Giỏ hàng
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;