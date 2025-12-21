import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEdit, FaUserTie, FaTimes, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const AdminManageStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const { currentUser } = useAuth();
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    password: '',
    role: 'STAFF' 
  });

  // 1. Lấy danh sách nhân viên
  const fetchStaffs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/getall`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const allUsers = await res.json();
        // Lọc chỉ lấy tài khoản STAFF
        const staffList = allUsers.filter(u => u.role === 'STAFF');
        setStaffs(staffList);
      }
    } catch (err) { 
        console.error(err); 
        toast.error("Lỗi kết nối Server."); 
    }
  };

  useEffect(() => { fetchStaffs(); }, []);

  //  2. XÓA NHÂN VIÊN 
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này? Hành động này không thể hoàn tác.")) {
      try {
        const response = await fetch(`${API_URL}/api/user/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        if (response.ok) {
            toast.success("Đã xóa nhân viên.");
            fetchStaffs(); 
        } else {
            toast.error("Không thể xóa nhân viên này.");
        }
      } catch (err) { console.error(err); }
    }
  };

  //  3. MỞ MODAL 
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ userName: '', email: '', phone: '', password: '', role: 'STAFF' });
    setIsFormModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setCurrentUserId(user.id);
    setFormData({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      password: '',
      role: 'STAFF'
    });
    setIsFormModalOpen(true);
  };

  // 4. XỬ LÝ SUBMIT 
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isEditing && !formData.password) {
        toast.warning("Vui lòng nhập mật khẩu cho nhân viên mới.");
        setIsLoading(false);
        return;
    }

    const payload = { ...formData, role: 'STAFF' };
    // Nếu đang sửa mà không nhập pass mới thì xóa trường password đi để BE không update
    if (isEditing && !payload.password) delete payload.password; 

    try {
        const url = isEditing 
            ? `${API_URL}/api/user/update/${currentUserId}` 
            : `${API_URL}/api/user/create`;
        
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${currentUser.token}` 
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            toast.success(isEditing ? 'Cập nhật thông tin thành công!' : 'Thêm nhân viên mới thành công!');
            setIsFormModalOpen(false);
            fetchStaffs();
        } else {
            const txt = await response.text();
            toast.error(txt || "Lỗi xử lý.");
        }
    } catch (error) { 
        toast.error('Lỗi kết nối.'); 
    } finally { 
        setIsLoading(false); 
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaUserTie className="text-[#174C34]"/> Quản lý Nhân viên
        </h2>
        <button onClick={openAddModal} className="bg-[#174C34] text-white font-bold py-2.5 px-6 rounded-lg hover:bg-green-800 shadow-lg flex items-center gap-2 transition transform active:scale-95">
          <FaPlus/> Thêm nhân viên
        </button>
      </div>
      
      <div className="overflow-hidden border rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Họ và Tên</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Email (Đăng nhập)</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Số điện thoại</th>
              <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffs.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">Chưa có nhân viên nào trong hệ thống.</td></tr>
            ) : staffs.map((staff, idx) => (
              <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500">#{staff.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold mr-3">
                            {staff.userName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{staff.userName}</span>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{staff.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{staff.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(staff)} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg transition" title="Sửa">
                        <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(staff.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition" title="Xóa">
                        <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
            <button onClick={() => setIsFormModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"><FaTimes size={20}/></button>
            
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                {isEditing ? 'Cập nhật thông tin' : 'Thêm Nhân viên mới'}
            </h3>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tên nhân viên</label>
                  <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={formData.userName} onChange={e=>setFormData({...formData, userName: e.target.value})} required placeholder="Nhập họ tên..."/>
              </div>
              
              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email đăng nhập</label>
                  <input type="email" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none disabled:bg-gray-100 disabled:text-gray-500" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} required disabled={isEditing} placeholder="staff@example.com"/>
                  {isEditing && <p className="text-xs text-gray-400 mt-1">* Không thể thay đổi email</p>}
              </div>

              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                  <input type="text" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} required placeholder="09xxxxxxxx"/>
              </div>

              <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu {isEditing ? '(Bỏ qua nếu không đổi)' : '*'}</label>
                  <input type="password" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={formData.password} onChange={e=>setFormData({...formData, password: e.target.value})} required={!isEditing} placeholder="******"/>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-[#174C34] text-white py-3 rounded-xl font-bold hover:bg-green-800 shadow-lg disabled:bg-gray-400 transition mt-4">
                {isLoading ? 'Đang xử lý...' : 'Lưu thông tin'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageStaff;