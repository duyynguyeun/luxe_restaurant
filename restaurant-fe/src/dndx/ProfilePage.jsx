import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify'; 

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth(); // updateProfile ở đây chỉ để cập nhật lại context/localstorage sau khi API xong
  
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    password: '', // Mật khẩu mới (để trống nếu không đổi)
    role: 'CUSTOMER' // Mặc định giữ nguyên, hoặc lấy từ API
  });

  const [isLoading, setIsLoading] = useState(false);

  // 1. Load thông tin người dùng mới nhất từ Server khi vào trang
  useEffect(() => {
    if (currentUser?.id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/user/find/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        setFormData({
          userName: data.userName || '',
          email: data.email || '',
          phone: data.phone || '',
          password: '', // Không hiển thị mật khẩu cũ
          role: data.role || 'CUSTOMER'
        });
      })
      .catch(err => console.error("Lỗi tải thông tin user:", err));
    }
  }, [currentUser]);

  // 2. Xử lý thay đổi ô nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Gọi API Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    // --- THÊM VALIDATION MỚI ---
    const phoneRegex = /^0\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
        toast.warning('Số điện thoại không hợp lệ! Phải đủ 10 số và bắt đầu bằng số 0.');
        return;
    }

    // Kiểm tra mật khẩu (chỉ khi người dùng có nhập vào ô mật khẩu mới)
    if (formData.password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            toast.warning('Mật khẩu mới yếu! Cần tối thiểu 8 ký tự, bao gồm cả chữ và số.');
            return;
        }
    }
    
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        toast.success("Cập nhật hồ sơ thành công!");
        
        // Cập nhật lại Context/LocalStorage để Header hiển thị đúng tên mới
        // Lưu ý: Hàm updateProfile trong AuthContext của bạn cần nhận object hoặc string tùy cách bạn viết.
        // Ở đây mình giả sử bạn sửa lại AuthContext hoặc tự set lại LocalStorage:
        const newStorageUser = { ...currentUser, username: updatedUser.userName };
        localStorage.setItem('fakeUser', JSON.stringify(newStorageUser));
        window.location.reload(); // Load lại để Header cập nhật tên mới
      } else {
        toast.error("Cập nhật thất bại! Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối Server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-gray-50 min-h-[80vh]">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Chỉnh Sửa Hồ Sơ</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email (Read Only) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email (Không thể đổi)</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
              value={formData.email}
              readOnly
            />
          </div>

          {/* Tên hiển thị */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Tên hiển thị</label>
            <input
              type="text"
              name="userName"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Nhập tên hiển thị..."
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Số điện thoại (Mới thêm) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Nhập số điện thoại..."
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Mật khẩu (Mới thêm) */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Mật khẩu mới <span className="text-sm font-normal text-gray-500">(Để trống nếu không đổi)</span>
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Nhập mật khẩu mới..."
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;