import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context
const AuthContext = createContext();

// Tạo custom hook (để dùng cho tiện)
export const useAuth = () => {
  return useContext(AuthContext);
};

// Tạo Provider
export const AuthProvider = ({ children }) => {
  // SỬA ĐỔI: Khởi tạo state trực tiếp từ localStorage để có dữ liệu ngay lập tức
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('fakeUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Không cần useEffect để load lại user nữa vì đã làm ở trên

  const login = async (email, password) => {
    try {
      // Gọi API đến backend (sử dụng biến .env)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
       
        console.error("Đăng nhập thất bại:", response.status);
        return false; // Báo đăng nhập thất bại
      }

      // Lấy dữ liệu trả về (gồm accessToken, refreshToken, email, role)
      const data = await response.json();

      // Tạo đối tượng user để lưu vào state và localStorage
      const userToStore = {
        id: data.id,
        username: data.email, // Tạm dùng email làm username hiển thị
        email: data.email,
        role: data.role, // Role quan trọng để phân quyền (ADMIN/CUSTOMER)
        token: data.accessToken, // !! Quan trọng: Lưu lại token
      };
      
      localStorage.setItem('fakeUser', JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      return userToStore;

    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      return null; // <--- SỬA: Trả về null nếu lỗi
    }
  };

  // Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('fakeUser');
    setCurrentUser(null);
  };

  // Hàm cập nhật profile
  const updateProfile = (newUsername) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, username: newUsername };
      setCurrentUser(updatedUser);
      localStorage.setItem('fakeUser', JSON.stringify(updatedUser));
    }
  };

  // Các giá trị sẽ cung cấp cho toàn bộ app
  const value = {
    currentUser,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};