import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  
  // Lấy tên hiện tại từ context
  const [username, setUsername] = useState(currentUser.username);
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      updateProfile(username); // Gọi hàm "giả" update
      setSuccess('Cập nhật tên thành công!');
    } catch (err) {
      // (Trong hệ thống "giả" này thì sẽ không có lỗi)
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Chỉnh Sửa Hồ Sơ</h2>
        
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{success}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email (Không thể đổi)</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              value={currentUser.email}
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Tên hiển thị</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Cập nhật hồ sơ
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;

