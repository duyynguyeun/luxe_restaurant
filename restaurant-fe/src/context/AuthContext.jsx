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
  const login = (username, password) => {
    if (username === 'admin' && password === '123') {
      const fakeUser = {
        username: 'Admin User',
        email: 'admin@test.com',
      };
      
      // Lưu vào localStorage
      localStorage.setItem('fakeUser', JSON.stringify(fakeUser));
      // Cập nhật state
      setCurrentUser(fakeUser);
      return true; // Báo đăng nhập thành công
    }
    return false; // Báo đăng nhập thất bại
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

