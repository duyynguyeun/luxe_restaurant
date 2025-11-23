import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
  const { currentUser } = useAuth();

  // 1. Nếu chưa đăng nhập -> Chuyển về trang Login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đã đăng nhập nhưng Role KHÔNG PHẢI là ADMIN -> Đuổi về trang chủ
  // Lưu ý: Backend đang trả về "ADMIN" (viết hoa), cần so sánh chính xác
  if (currentUser.role !== 'ADMIN') {
    // Bạn có thể hiện thông báo hoặc không
    alert("Bạn không có quyền truy cập trang quản trị!"); 
    return <Navigate to="/" replace />;
  }

  // 3. Nếu là ADMIN -> Cho phép hiển thị nội dung bên trong (Outlet)
  return <Outlet />;
};

export default AdminRoute;