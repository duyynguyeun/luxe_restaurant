// file: restaurant-fe/src/admin/AdminManageUsers.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEdit, FaUserPlus, FaTimes, FaList } from 'react-icons/fa';
import { toast } from 'react-toastify'; // Thêm toast để thông báo

const API_URL = import.meta.env.VITE_API_URL;

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  
  // State cho Modal (chuyển tên từ isModalOpen sang isFormModalOpen)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Mode: True=Edit, False=Add
  const [currentUserId, setCurrentUserId] = useState(null);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    password: '', // Password là tùy chọn khi Edit, bắt buộc khi Add
    role: 'CUSTOMER'
  });

  // 1. Tải danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/getall`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) setUsers(await res.json());
      else toast.error("Không thể tải danh sách người dùng.");
    } catch (err) { console.error(err); toast.error("Lỗi kết nối Server."); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 2. Xóa người dùng (Giữ nguyên)
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        const response = await fetch(`${API_URL}/api/user/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        if (response.ok) {
            toast.success("Đã xóa người dùng.");
            fetchUsers(); 
        } else {
            toast.error("Không thể xóa người dùng.");
        }
      } catch (err) { console.error(err); }
    }
  };

  // 3. Mở Modal Thêm mới
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentUserId(null);
    setFormData({
      userName: '',
      email: '',
      phone: '',
      password: '',
      role: 'CUSTOMER'
    });
    setIsFormModalOpen(true);
  };

  // 4. Mở Modal Sửa
  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setFormData({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      password: '', // Luôn để trống, chỉ thay đổi nếu user muốn đổi
      role: user.role
    });
    setIsFormModalOpen(true);
  };

  // 5. Xử lý Submit (Thêm mới / Chỉnh sửa)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isEditing && !formData.password) {
        toast.error("Vui lòng nhập mật khẩu khi thêm mới.");
        setIsLoading(false);
        return;
    }
    
    // Chuẩn bị payload (loại bỏ password nếu là Edit và trường đó trống)
    const payload = {...formData};
    if (isEditing && payload.password === '') {
        delete payload.password; // Không gửi mật khẩu nếu không có thay đổi
    } else if (isEditing && payload.password !== '' && payload.password.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
        setIsLoading(false);
        return;
    }

    try {
        const url = isEditing 
            ? `${API_URL}/api/user/update/${currentUserId}`
            : `${API_URL}/api/user/create`;
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              // Cần Token cho cả POST và PUT
              'Authorization': `Bearer ${currentUser.token}` 
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            toast.success(isEditing ? 'Cập nhật người dùng thành công!' : 'Thêm mới người dùng thành công!');
            setIsFormModalOpen(false);
            fetchUsers(); // Tải lại danh sách
        } else {
            const errorText = await response.text();
            toast.error(errorText || (isEditing ? 'Lỗi khi cập nhật.' : 'Lỗi khi thêm mới.'));
        }

    } catch (error) {
        console.error(error);
        toast.error('Lỗi kết nối Server.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaList/> Quản lý Người dùng
        </h2>
        <button onClick={openAddModal} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-2 transition-transform active:scale-95">
          <FaUserPlus className='mr-1'/> Thêm người dùng
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-center">Quyền</th>
              <th className="p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3 font-bold text-gray-600">#{user.id}</td>
                <td className="p-3 font-medium">{user.userName}</td>
                <td className="p-3 text-gray-600">{user.email}</td>
                <td className="p-3 text-gray-600">{user.phone}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                    user.role === 'STAFF' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-center flex justify-center gap-3">
                  {/* Thay nút cũ bằng nút Edit tổng hợp */}
                  <button onClick={() => openEditModal(user)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full" title="Sửa thông tin">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full" title="Xóa">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM/SỬA NGƯỜI DÙNG */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsFormModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FaTimes size={24} /></button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                {isEditing ? `Sửa Người dùng #${currentUserId}` : 'Thêm Người dùng mới'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Tên hiển thị */}
              <div>
                <label className="block text-sm font-semibold mb-1">Tên hiển thị</label>
                <input 
                  type="text" 
                  name="userName"
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                  disabled={isEditing} // Không cho phép sửa Email khi đang Edit
                />
                {isEditing && <p className="text-xs text-gray-500 mt-1">Không thể đổi Email sau khi tạo.</p>}
              </div>

              {/* SĐT */}
              <div>
                <label className="block text-sm font-semibold mb-1">Số điện thoại</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                />
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-sm font-semibold mb-1">
                    Mật khẩu {isEditing ? '(Để trống nếu không đổi)' : '*'}
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder={isEditing ? 'Nhập mật khẩu mới...' : 'Nhập mật khẩu...'}
                  required={!isEditing}
                />
              </div>

              {/* Quyền */}
              <div>
                <label className="block text-sm font-semibold mb-1">Quyền truy cập</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:outline-none appearance-none cursor-pointer"
                  required
                >
                    {['CUSTOMER', 'STAFF', 'ADMIN', 'OWNER'].map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
              </div>

              <button
                type="submit" 
                className="w-full bg-green-600 text-white py-3 mt-6 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : isEditing ? 'Lưu thay đổi' : 'Thêm người dùng'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;