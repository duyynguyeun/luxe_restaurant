import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEdit, FaUserShield, FaTimes } from 'react-icons/fa';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const { currentUser } = useAuth();
  
  // State cho Modal sửa quyền
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");

  // 1. Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getall`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 2. Xóa người dùng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        fetchUsers(); // Tải lại danh sách
      } catch (err) { console.error(err); }
    }
  };

  // 3. Mở Modal sửa
  const openEditModal = (user) => {
    setEditingUser(user);
    setSelectedRole(user.role); // Lấy quyền hiện tại
    setIsModalOpen(true);
  };

  // 4. Lưu thay đổi quyền
  const handleUpdateRole = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        // Gửi role mới lên, các thông tin khác giữ nguyên
        body: JSON.stringify({
          userName: editingUser.userName,
          email: editingUser.email,
          phone: editingUser.phone,
          role: selectedRole 
        })
      });

      if (response.ok) {
        alert("Cập nhật thành công!");
        setIsModalOpen(false);
        fetchUsers();
      }
    } catch (error) { console.error(error); }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Quản lý Người dùng</h2>
      
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
                  <button onClick={() => openEditModal(user)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full" title="Sửa quyền">
                    <FaUserShield />
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

      {/* MODAL SỬA QUYỀN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FaTimes size={20} /></button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Cấp quyền</h3>
            <p className="mb-4 text-sm text-gray-600">Thay đổi quyền cho: <b>{editingUser?.userName}</b></p>
            
            <div className="space-y-3 mb-6">
              {['CUSTOMER', 'STAFF', 'ADMIN'].map(role => (
                <label key={role} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name="role" 
                    value={role} 
                    checked={selectedRole === role} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-5 h-5 text-green-600"
                  />
                  <span className="font-medium">{role}</span>
                </label>
              ))}
            </div>

            <button onClick={handleUpdateRole} className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700">
              Lưu thay đổi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;