import React from "react";
import logo from "../assets/logo.jpg"

const Header = () => {
  return (
    <header className="bg-[#174C34] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-white"><img src="logo.jpg" alt="logo.jpg" /></a>

        {/* Menu */}
        <nav>
          <ul className="flex space-x-6 font-medium">
            <li>
              <a href="/" className="text-white hover:text-yellow-300">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="/" className="text-white hover:text-yellow-300">
                Menu
              </a>
            </li>
            <li>
              <a href="/" className="text-white hover:text-yellow-300">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="/" className="text-white hover:text-yellow-300">
                Liên hệ
              </a>
            </li>
            <li>
              <a href="/Signup" className="text-white hover:text-yellow-300">
                Đăng kí
              </a>
            </li>
            <li>
              <a href="/Login" className="text-white hover:text-yellow-300">
                Đăng nhập
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
