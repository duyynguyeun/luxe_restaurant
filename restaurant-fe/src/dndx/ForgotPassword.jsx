import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 
import { FaLockOpen, FaKey, FaArrowLeft } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // --- HÀM 1: GỬI OTP (BƯỚC 1) ---
  const handleSendOtp = async (e) => {
    e.preventDefault(); 
    setError('');
    if (!email) {
        setError('Vui lòng nhập Email.');
        return;
    }
    
    setIsLoading(true);
    try {
      // Endpoint: POST /api/user/forgot-password/send-otp?email={email}
      const response = await fetch(`${API_URL}/api/user/forgot-password/send-otp?email=${email}`, {
        method: 'POST',
      });

      const responseText = await response.text();

      if (!response.ok) {
        // Response trả về lỗi 400 và body là chuỗi lỗi
        setError(responseText || 'Không thể gửi OTP.');
        toast.error(responseText || 'Không thể gửi OTP.');
        return;
      }

      toast.success('Mã OTP đã được gửi đến email. Vui lòng kiểm tra!');
      setStep(2);
      setError('');

    } catch (err) {
      setError('Lỗi kết nối Server.');
      toast.error('Lỗi kết nối Server.');
    } finally {
      setIsLoading(false);
    }
  };


  // --- HÀM 2: XÁC THỰC OTP (BƯỚC 2) ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault(); 
    setError('');

    if (!otp) {
        setError('Vui lòng nhập mã OTP.');
        return;
    }

    setIsLoading(true);
    try {
      // Endpoint: POST /api/user/forgot-password/verify-otp?email={email}&otp={otp}
      const response = await fetch(
          `${API_URL}/api/user/forgot-password/verify-otp?email=${email}&otp=${otp}`, 
          { method: 'POST' }
      );

      const responseText = await response.text();

      if (!response.ok) {
        setError(responseText || 'Xác thực OTP thất bại.');
        toast.error(responseText || 'Xác thực OTP thất bại.');
        return;
      }

      toast.success('Xác thực thành công! Vui lòng đặt mật khẩu mới.');
      setStep(3);
      setError('');

    } catch (err) {
      setError('Lỗi kết nối Server.');
      toast.error('Lỗi kết nối Server.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- HÀM 3: ĐẶT MẬT KHẨU MỚI (BƯỚC 3) ---
  const handleResetPassword = async (e) => {
    e.preventDefault(); 
    setError('');

    if (newPassword.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
    }
    if (newPassword !== confirmPassword) {
        setError('Mật khẩu mới và Xác nhận mật khẩu không khớp.');
        return;
    }

    setIsLoading(true);
    try {
      // Endpoint: POST /api/user/forgot-password/reset
      const requestBody = { email: email, newPassword: newPassword };
      
      const response = await fetch(
          `${API_URL}/api/user/forgot-password/reset`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
          }
      );
      
      const responseText = await response.text();

      if (!response.ok) {
        setError(responseText || 'Lỗi đặt mật khẩu mới.');
        toast.error(responseText || 'Lỗi đặt mật khẩu mới.');
        return;
      }

      // Hoàn tất
      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      navigate('/login');

    } catch (err) {
      setError('Lỗi kết nối Server.');
      toast.error('Lỗi kết nối Server.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <form className='space-y-5' onSubmit={handleSendOtp}>
            <p className='text-sm text-gray-600'>Nhập email tài khoản bạn muốn khôi phục.</p>
            <div>
              <label className='block text-gray-700 mb-1'>Email</label>
              <input 
                type="email" 
                placeholder='Nhập email của bạn...' 
                className='w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <button
              type="submit" 
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold transition cursor-pointer hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Đang gửi OTP...' : <>GỬI MÃ OTP <FaKey /></>}
            </button>
          </form>
        );
      case 2:
        return (
          <form className='space-y-5' onSubmit={handleVerifyOtp}>
            <div className='text-sm text-center text-gray-600 border-b pb-4'>
                Mã xác thực đã được gửi đến: <span className='font-bold text-red-700'>{email}</span>
                <button type="button" onClick={() => setStep(1)} className='text-blue-500 ml-2 text-xs'>Sửa Email</button>
            </div>
            <div>
              <label className='block text-gray-700 mb-1'>Mã OTP (6 chữ số)</label>
              <input 
                type="text" 
                placeholder='Nhập mã OTP...' 
                className='w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-xl tracking-wider text-center font-bold'
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <button
              type="submit" 
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold transition cursor-pointer hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xác thực...' : 'XÁC THỰC OTP'}
            </button>
          </form>
        );
      case 3:
        return (
          <form className='space-y-5' onSubmit={handleResetPassword}>
            <p className='text-sm text-gray-600 border-b pb-4'>Email: <span className='font-bold text-red-700'>{email}</span></p>
            <div>
              <label className='block text-gray-700 mb-1'>Mật khẩu mới</label>
              <input 
                type="password" 
                placeholder='Nhập mật khẩu mới (tối thiểu 6 ký tự)' 
                className='w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <div>
              <label className='block text-gray-700 mb-1'>Xác nhận mật khẩu mới</label>
              <input 
                type="password" 
                placeholder='Nhập lại mật khẩu mới' 
                className='w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>
            <button
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition cursor-pointer hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đặt lại...' : <>ĐẶT LẠI MẬT KHẨU <FaLockOpen /></>}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-gray-100 min-h-[80vh]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Khôi phục mật khẩu</h2>
        
        {/* Thanh trạng thái */}
        <div className="flex justify-between items-center mb-6 px-4">
            <StepIndicator step={1} currentStep={step} label="Email" />
            <div className={`flex-1 h-0.5 mx-2 ${step > 1 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
            <StepIndicator step={2} currentStep={step} label="OTP" />
            <div className={`flex-1 h-0.5 mx-2 ${step > 2 ? 'bg-red-500' : 'bg-gray-300'}`}></div>
            <StepIndicator step={3} currentStep={step} label="Mật khẩu mới" />
        </div>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
        
        {renderForm()}

        <p className="text-center mt-6 text-gray-600">
          <Link to="/login" className="text-gray-500 hover:underline font-medium flex items-center justify-center gap-1">
            <FaArrowLeft className='text-xs' /> Quay lại Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

// Component con để hiển thị trạng thái bước
const StepIndicator = ({ step, currentStep, label }) => (
    <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 
            ${currentStep === step ? 'bg-red-500 text-white shadow-lg' : 
              currentStep > step ? 'bg-green-500 text-white' : 
              'bg-gray-300 text-gray-600'}`
        }>
            {currentStep > step ? '✓' : step}
        </div>
        <span className={`text-xs mt-1 ${currentStep >= step ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
            {label}
        </span>
    </div>
);

export default ForgotPassword;