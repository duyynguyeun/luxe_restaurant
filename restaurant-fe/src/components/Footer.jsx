import React from "react";
import { Facebook, Instagram, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-green-900 text-white py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo + mô tả */}
        <div>
          <h2 className="text-2xl font-bold mb-3">Luxe Restaurant</h2>
          <p className="text-sm text-gray-200">
            Mang hương vị ẩm thực truyền thống Việt Nam đến với mọi người.
          </p>
        </div>

        {/* Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Liên kết nhanh</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Trang chủ</a></li>
            <li><a href="#" className="hover:underline">Menu</a></li>
            <li><a href="#" className="hover:underline">Giới thiệu</a></li>
            <li><a href="#" className="hover:underline">Liên hệ</a></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Liên hệ</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={16}/> 0123 456 789</li>
            <li className="flex items-center gap-2"><Mail size={16}/> info@nhahangviet.com</li>
            <li className="flex gap-4 mt-3">
              <a href="#" className="hover:text-gray-300"><Facebook /></a>
              <a href="#" className="hover:text-gray-300"><Instagram /></a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="border-t border-gray-600 mt-6 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Luxe Restaurant. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
