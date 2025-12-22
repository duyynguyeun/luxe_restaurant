import React, { useState } from 'react';  
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// IMPORT HÌNH NỀN MỚI (Lưu ý: Kiểm tra lại đuôi file .jpg/.png của bạn)
import bgnhahang from '../assets/bgnhahang.jpg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const userData = await login(email, password);

    if (userData) {
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div 
      className="min-h-screen flex justify-center items-center bg-cover bg-center relative font-sans"
      style={{ backgroundImage: `url(${bgnhahang})` }}
    >
      {/* Lớp phủ tối màu gradient để làm nổi bật form và chữ */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40"></div>

      {/* Form Container với hiệu ứng Glassmorphism */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20">
        
        {/* Tiêu đề Gradient */}
        <h2 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-sm">
          Đăng Nhập
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="block text-gray-200 mb-2 font-medium ml-1">Email</label>
            <input
              type="email"
              placeholder="nhahang@example.com"
              className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400 transition-all group-hover:bg-black/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="group">
            <label className="block text-gray-200 mb-2 font-medium ml-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white placeholder-gray-400 transition-all group-hover:bg-black/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className='text-right'>
            <Link to="/forgot-password" className="text-sm text-yellow-300 hover:text-yellow-100 transition-colors font-medium hover:underline decoration-yellow-300/50">
                Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-lg text-white shadow-lg 
                       bg-gradient-to-r from-yellow-600 to-yellow-500 
                       hover:from-yellow-500 hover:to-yellow-400 
                       transition-all duration-300 transform hover:-translate-y-1 hover:shadow-yellow-500/30"
          >
            Đăng Nhập
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-gray-300">
            Chưa có tài khoản?{' '}
            <Link to="/signup" className="text-yellow-300 hover:text-yellow-100 font-bold ml-1 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;