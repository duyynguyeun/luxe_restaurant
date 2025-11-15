import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  // Thêm 4 dòng state này
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang web tải lại
    setError(''); // Xóa lỗi cũ

    try {
      // 1. Tạo body request khớp với UserCreateRequest.java
      const requestBody = {
        email: email,
        phone: phone,
        userName: userName,
        password: password
      };

      // 2. Gọi API /api/user/create
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        // Xử lý lỗi (ví dụ: email đã tồn tại)
        const errorData = await response.text();
        setError(errorData || 'Đăng ký thất bại');
        return;
      }

      // 3. Đăng ký thành công, chuyển về trang đăng nhập
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      console.error(err);
    }
  };

  // Thêm state cho lỗi và navigate
  const [error, setError] = useState('');
  const navigate = useNavigate();
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 '>
      <div className= 'bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <h2 className='font-bold text-2xl text-black text-center' >Đăng kí</h2>
        {/* Thêm dòng này để hiện lỗi */}
        {error && <p className="text-red-500 text-center my-3">{error}</p>}

        {/* 1. Thêm onSubmit vào thẻ <form> */}
        <form className='space-y-5' onSubmit={handleSubmit}>
          <div>
            <label className='block text-gray-700 mb-1'>Email</label>
              {/* 2. Thêm value và onChange */}
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
              {/* Lỗi: type="email" -> Sửa thành type="text" */}
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
              type="submit" // 3. Đổi thành type="submit"
              className="w-full bg-gray-500 text-white py-2 rounded-lg transition cursor-pointer hover:bg-green-700"
            >
              Đăng kí
          </button>
          
          {/* Xóa thẻ <a> bên trong <button> */}

        </form>
      </div>
    </div>
  )
}

export default Signup

