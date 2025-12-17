import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify'; 
// IMPORT HÌNH NỀN MỚI
import bgnhahang from '../assets/bgnhahang.jpg'; 

const Signup = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // --- HÀM 1: GỬI OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault(); 
    setError('');

    if (!email || !phone || !userName || !password) {
        setError('Vui lòng điền đầy đủ thông tin đăng ký!');
        return;
    }
    
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        const msg = 'Số điện thoại không hợp lệ! Phải đủ 10 số và bắt đầu bằng số 0.';
        setError(msg);
        toast.warning(msg);
        return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        const msg = 'Mật khẩu yếu! Cần tối thiểu 8 ký tự, bao gồm cả chữ và số.';
        setError(msg);
        toast.warning(msg);
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/user/send-otp?email=${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || 'Không thể gửi OTP. Vui lòng kiểm tra email.');
        toast.error(errorText || 'Không thể gửi OTP.');
        return;
      }

      toast.success('OTP đã được gửi! Vui lòng kiểm tra email.');
      setStep(2);

    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      toast.error('Lỗi kết nối.');
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  // --- HÀM 2: XÁC THỰC VÀ ĐĂNG KÝ ---
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault(); 
    setError('');

    if (!otp) {
        setError('Vui lòng nhập mã OTP.');
        return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        role: "CUSTOMER" 
      };

      const response = await fetch(
          `${API_URL}/api/user/verify-otp?email=${email}&otp=${otp}`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody) 
          }
      );

      if (!response.ok) {
        const errorData = await response.text();
        setError(errorData || 'Xác thực thất bại');
        toast.error(errorData || 'Xác thực thất bại');
        return;
      }

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      toast.error('Lỗi kết nối.');
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  
  return (
    <div 
      className='min-h-screen flex items-center justify-center bg-cover bg-center relative font-sans'
      style={{ backgroundImage: `url(${bgnhahang})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40"></div>

      <div className= 'relative z-10 bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 w-full max-w-md'>
        <h2 className='text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500 drop-shadow-sm' >
            Đăng Ký
        </h2>
        
        {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm">
                {error}
            </div>
        )}

        {/* --- STEP 1: NHẬP THÔNG TIN --- */}
        {step === 1 && (
            <form className='space-y-5' onSubmit={handleSendOtp}>
              <div>
                <label className='block text-gray-200 mb-1 ml-1 font-medium text-sm'>Email</label>
                  <input 
                    type="email" 
                    placeholder='email@example.com' 
                    className='w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400 transition-all'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
              </div>
              <div>
                <label className='block text-gray-200 mb-1 ml-1 font-medium text-sm'>Số điện thoại</label>
                  <input 
                    type="text" 
                    placeholder='09xxxxxxxxx' 
                    className='w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400 transition-all'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
              </div>
              <div>
                <label className='block text-gray-200 mb-1 ml-1 font-medium text-sm'>Tên hiển thị</label>
                  <input 
                    type="text" 
                    placeholder='Tên của bạn' 
                    className='w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400 transition-all'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
              </div>
              <div>
                <label className='block text-gray-200 mb-1 ml-1 font-medium text-sm'>Mật khẩu</label>
                  <input 
                    type="password" 
                    placeholder='••••••••' 
                    className='w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-white placeholder-gray-400 transition-all'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
              </div>
            
              <button
                  type="submit" 
                  className="w-full py-3.5 mt-4 rounded-xl font-bold text-lg text-white shadow-lg 
                             bg-gradient-to-r from-green-600 to-green-500 
                             hover:from-green-500 hover:to-green-400 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-300 transform hover:-translate-y-1 hover:shadow-green-500/30"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang gửi mã...' : 'Tiếp tục'}
              </button>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-gray-300 text-sm hover:text-white transition-colors">
                    Đã có tài khoản? <span className="text-green-300 font-bold hover:underline">Đăng nhập</span>
                </Link>
              </div>
            </form>
        )}

        {/* --- STEP 2: NHẬP OTP --- */}
        {step === 2 && (
            <form className='space-y-6 animate-fade-in' onSubmit={handleVerifyAndRegister}>
                <div className='text-center p-4 rounded-2xl bg-green-900/30 border border-green-500/30'>
                    <p className='text-sm text-green-100 mb-1'>Mã xác thực đã gửi đến:</p>
                    <span className='font-bold text-lg text-green-300 block break-all'>{email}</span>
                </div>

                <div>
                    <label className='block text-center text-gray-200 mb-3 font-bold tracking-wider text-sm uppercase'>Nhập Mã OTP</label>
                    <input 
                        type="text" 
                        placeholder='- - - - - -' 
                        className='w-full border border-white/20 px-4 py-4 rounded-2xl focus:ring-2 focus:ring-green-400 focus:outline-none text-3xl tracking-[0.5em] text-center font-bold text-white bg-black/20 transition-all placeholder-gray-500'
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required 
                    />
                </div>
                
                <div className='flex justify-between gap-4 pt-2'>
                    <button
                        type="button" 
                        onClick={() => {setStep(1); setError('')}}
                        className="w-1/3 bg-gray-600/50 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-all border border-white/10"
                        disabled={isLoading}
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit" 
                        className="w-2/3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/30 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Xác thực & Đăng ký'}
                    </button>
                </div>
            </form>
        )}

      </div>
    </div>
  )
}

export default Signup