import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import hook của chúng ta

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth(); // 2. Lấy hàm login "giả"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Gọi hàm login và nhận lại dữ liệu user
    const userData = await login(email, password);

    if (userData) {
      // Kiểm tra quyền (Role)
      // Lưu ý: Role phải khớp với Enum trong Backend (ADMIN, CUSTOMER, STAFF...)
      if (userData.role === 'ADMIN') {
        navigate('/admin'); // Nếu là Admin -> Vào trang quản trị
      } else {
        navigate('/');      // Nếu là Khách/Nhân viên -> Về trang chủ
      }
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Đăng nhập Nhà Hàng</h2>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu "
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Đăng nhập
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/signup" className="text-red-500 hover:underline font-medium">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

