import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context
const AuthContext = createContext();

// Tạo custom hook (để dùng cho tiện)
export const useAuth = () => {
  return useContext(AuthContext);
};

// Tạo Provider
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Kiểm tra localStorage khi app mới tải
  useEffect(() => {
    const storedUser = localStorage.getItem('fakeUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // 2. Hàm Đăng nhập "Giả"
  // Tài khoản test: admin / 123
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
        // Nếu server trả lỗi (vd: 401 - sai pass)
        console.error("Đăng nhập thất bại:", response.status);
        return false; // Báo đăng nhập thất bại
      }

      // Lấy dữ liệu trả về (gồm accessToken, refreshToken, email, role)
      const data = await response.json();

      // Tạo đối tượng user để lưu vào state và localStorage
      const userToStore = {
        username: data.email, // Tạm dùng email làm username hiển thị
        email: data.email,
        role: data.role,
        token: data.accessToken, // !! Quan trọng: Lưu lại token
      };
      
      localStorage.setItem('fakeUser', JSON.stringify(userToStore));
      setCurrentUser(userToStore);
      return true; // Báo đăng nhập thành công

    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      return false; // Báo đăng nhập thất bại
    }
  };

  // 3. Hàm Đăng xuất
  const logout = () => {
    localStorage.removeItem('fakeUser');
    setCurrentUser(null);
  };

  // 4. Hàm "Giả" cập nhật profile
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

