import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Thêm toast để thông báo chuyên nghiệp hơn

const Signup = () => {
  // State lưu thông tin người dùng
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  
  // STATE MỚI CHO OTP VÀ STEP
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Nhập thông tin, 2: Nhập OTP
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading

  // State cho lỗi và navigate
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // --- HÀM 1: GỬI OTP (Chạy khi Submit form Step 1) ---
  const handleSendOtp = async (e) => {
    e.preventDefault(); 
    setError('');

    // 1. Kiểm tra thông tin cơ bản
    if (!email || !phone || !userName || !password) {
        setError('Vui lòng điền đầy đủ thông tin đăng ký!');
        return;
    }
    
    setIsLoading(true);

    try {
      // 2. Gọi API /api/user/send-otp
      // Endpoint: POST /api/user/send-otp?email={email}
      const response = await fetch(`${API_URL}/api/user/send-otp?email=${email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || 'Không thể gửi OTP. Vui lòng kiểm tra email và thử lại.');
        toast.error(errorText || 'Không thể gửi OTP.');
        return;
      }

      // 3. Gửi OTP thành công -> Chuyển sang bước 2
      toast.success('Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra!');
      setStep(2);

    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      toast.error('Lỗi kết nối. Vui lòng thử lại.');
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };


  // --- HÀM 2: XÁC THỰC OTP VÀ TẠO TÀI KHOẢN (Chạy khi Submit form Step 2) ---
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault(); 
    setError('');

    if (!otp) {
        setError('Vui lòng nhập mã OTP.');
        return;
    }

    setIsLoading(true);

    try {
      // 1. Tạo body request khớp với UserCreateRequest.java
      const requestBody = {
        email: email,
        phone: phone,
        userName: userName,
        password: password,
        role: "CUSTOMER" // Mặc định là CUSTOMER
      };

      // 2. Gọi API /api/user/verify-otp
      // Endpoint: POST /api/user/verify-otp?email={email}&otp={otp} (body: UserCreateRequest)
      const response = await fetch(
          `${API_URL}/api/user/verify-otp?email=${email}&otp=${otp}`, 
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody) // Gửi kèm thông tin User trong body
          }
      );

      if (!response.ok) {
        // Xử lý lỗi (ví dụ: OTP không đúng, email đã tồn tại)
        const errorData = await response.text();
        setError(errorData || 'Xác thực thất bại');
        toast.error(errorData || 'Xác thực thất bại');
        return;
      }

      // 3. Đăng ký thành công, chuyển về trang đăng nhập
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      toast.error('Lỗi kết nối. Vui lòng thử lại.');
      console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 '>
      <div className= 'bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <h2 className='font-bold text-2xl text-black text-center' >Đăng kí tài khoản</h2>
        
        {error && <p className="text-red-500 text-center my-3">{error}</p>}

        {/* --- STEP 1: NHẬP THÔNG TIN --- */}
        {step === 1 && (
            <form className='space-y-5' onSubmit={handleSendOtp}>
              <div>
                <label className='block text-gray-700 mb-1'>Email</label>
                  <input 
                    type="email" 
                    placeholder='Nhập email của bạn...' 
                    className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
              </div>
              <div>
                <label className='block text-gray-700 mb-1'>Số điện thoại</label>
                  <input 
                    type="text" 
                    placeholder='Nhập số điện thoại của bạn...' 
                    className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
              </div>
              <div>
                <label className='block text-gray-700 mb-1'>Tên đăng nhập</label>
                  <input 
                    type="text" 
                    placeholder='Nhập tên đăng nhập của bạn...' 
                    className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
              </div>
              <div>
                <label className='block text-gray-700 mb-1-5'>Mật khẩu</label>
                  <input 
                    type="password" 
                    placeholder='Nhập mật khẩu của bạn...' 
                    className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
              </div>
            
              <br />
              <button
                  type="submit" 
                  className="w-full bg-gray-500 text-white py-2 rounded-lg transition cursor-pointer hover:bg-green-700 disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang gửi OTP...' : 'Đăng kí (Gửi OTP)'}
              </button>
            </form>
        )}

        {/* --- STEP 2: NHẬP OTP --- */}
        {step === 2 && (
            <form className='space-y-5' onSubmit={handleVerifyAndRegister}>
                <p className='text-sm text-center text-gray-600 border-b pb-4'>
                    Mã xác thực đã được gửi đến email: <span className='font-bold text-green-700'>{email}</span>
                </p>
                <div>
                    <label className='block text-gray-700 mb-1'>Mã OTP</label>
                    <input 
                        type="text" 
                        placeholder='Nhập mã OTP 6 chữ số...' 
                        className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-xl tracking-wider text-center font-bold'
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required 
                    />
                </div>
                
                <div className='flex justify-between pt-2'>
                    <button
                        type="button" 
                        onClick={() => {setStep(1); setError('')}}
                        className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded-lg transition cursor-pointer hover:bg-gray-300"
                        disabled={isLoading}
                    >
                        Quay lại
                    </button>
                    <button
                        type="submit" 
                        className="w-2/3 ml-4 bg-green-600 text-white py-2 rounded-lg transition cursor-pointer hover:bg-green-700 disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Xác thực và Đăng ký'}
                    </button>
                </div>
            </form>
        )}

      </div>
    </div>
  )
}

export default Signup