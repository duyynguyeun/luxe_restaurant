import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { toast } from 'react-toastify';
import { FaDollarSign, FaTag, FaImage, FaTimes, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaList } from 'react-icons/fa';


const AdminManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]); // State lưu danh mục
  const { currentUser } = useAuth(); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); 
  const [currentDishId, setCurrentDishId] = useState(null);
  // ... các state cũ (menuItems, isModalOpen, ...)
  const [isUploading, setIsUploading] = useState(false); // <--- State mới để theo dõi quá trình upload

  // --- HÀM UPLOAD ẢNH ---
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true); // Bắt đầu xoay vòng tròn loading
    const data = new FormData();
    data.append("file", file); // Key "file" phải khớp với @RequestParam bên Backend

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images`, {
        method: "POST",
        body: data, // Gửi FormData, không cần Header Content-Type (trình duyệt tự xử lý)
      });

      if (response.ok) {
        const imageUrl = await response.text(); // Backend trả về String URL
        // Tự động điền URL vào ô input
        setFormData(prev => ({ ...prev, urlImage: imageUrl }));
      } else {
        alert("Lỗi upload ảnh!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Không thể kết nối server upload.");
    } finally {
      setIsUploading(false); // Tắt loading
    }
  };

  const [formData, setFormData] = useState({
    dishName: '',
    price: '',
    urlImage: '',
    categoryId: '' 
  });

  // --- Tải dữ liệu ---
  const fetchData = async () => {
    try {
      const [dishRes, catRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`),
        fetch(`${import.meta.env.VITE_API_URL}/api/category/getall`)
      ]);

      if (dishRes.ok) setMenuItems((await dishRes.json()).reverse());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  useEffect(() => { fetchData(); }, []); 

  const handleToggle = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/toggle/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (response.ok) {
        setMenuItems(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Xóa món này?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        if (response.ok) fetchData();
      } catch (error) { console.error(error); }
    }
  };

  // --- Mở Modal ---
  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ 
        dishName: '', price: '', urlImage: '', 
        // Mặc định chọn ID đầu tiên nếu có danh mục
        categoryId: categories.length > 0 ? categories[0].id : '' 
    }); 
    setIsModalOpen(true);
  };

  const openEditModal = (dish) => {
    setIsEditing(true); 
    setCurrentDishId(dish.id);
    setFormData({
      dishName: dish.nameDish,
      price: dish.price,
      urlImage: dish.urlImage,
      categoryId: dish.categoryId || (categories.length > 0 ? categories[0].id : '')
    });
    setIsModalOpen(true);
  };

  // --- Submit Form ---
  const handleFormSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    const payload = {
      dishName: formData.dishName,
      price: parseFloat(formData.price),
      urlImage: formData.urlImage,
      categoryId: formData.categoryId,
    };

    try {
      let url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/api/dish/update/${currentDishId}`
        : `${import.meta.env.VITE_API_URL}/api/dish/create`;
      let method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        setIsModalOpen(false);
        fetchData();
      } else {
        toast.error('Lỗi! Mã: ' + response.status);
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi kết nối server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý Menu</h2>
        <button onClick={openAddModal} className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 shadow-md flex items-center gap-2">
          <span>+</span> Thêm món
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Ảnh</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Danh mục</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Giá</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase">TT</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4"><img src={item.urlImage} className="h-12 w-12 rounded-full object-cover border" /></td>
                <td className="px-6 py-4 font-medium">{item.nameDish}</td>
                <td className="px-6 py-4 text-gray-600">{item.categoryName || '---'}</td>
                <td className="px-6 py-4 text-green-600 font-bold">{item.price?.toLocaleString()}₫</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => handleToggle(item.id)} className={`px-3 py-1 rounded-full text-xs font-bold ${item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.active ? 'Hiện' : 'Ẩn'}
                  </button>
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-3">
                  <button onClick={() => openEditModal(item)} className="text-blue-500"><FaEdit /></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold">{isEditing ? 'Cập nhật' : 'Thêm Món'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><FaTimes size={24} /></button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Tên Món</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaTag className="text-gray-400"/></div>
                  <input type="text" value={formData.dishName} onChange={(e) => setFormData({...formData, dishName: e.target.value})} className="pl-10 block w-full px-4 py-3 border rounded-lg" required />
                </div>
              </div>

              {/* Ô CHỌN DANH MỤC */}
              <div>
                <label className="block text-sm font-semibold mb-1">Danh mục</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaList className="text-gray-400"/></div>
                  <select 
                    value={formData.categoryId} 
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    className="pl-10 block w-full px-4 py-3 border rounded-lg bg-white appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Giá (VNĐ)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaDollarSign className="text-gray-400"/></div>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="pl-10 block w-full px-4 py-3 border rounded-lg" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Ảnh món ăn</label>
                
                {/* 1. Ô Tải ảnh từ máy */}
                <div className="mb-2 flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleUploadImage}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100
                    "
                  />
                  {isUploading && <span className="text-sm text-blue-600 font-bold animate-pulse">Đang tải lên...</span>}
                </div>

                {/* 2. Ô Link Ảnh (Tự động điền) */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaImage className="text-gray-400"/>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Hoặc dán link ảnh trực tiếp..."
                    value={formData.urlImage} 
                    onChange={(e) => setFormData({...formData, urlImage: e.target.value})} 
                    className="pl-10 block w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white transition-colors" 
                    required 
                  />
                </div>
                
                {/* Xem trước ảnh nhỏ (nếu có link) */}
                {formData.urlImage && !isUploading && (
                    <div className="mt-2">
                        <img src={formData.urlImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border shadow-sm" />
                    </div>
                )}
              </div>

              <div className="mt-8 flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 font-bold py-3 rounded-xl">Hủy</button>
                <button 
                  type="submit" 
                  className={`flex-1 bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                  disabled={isLoading || isUploading} 
                >
                  {isLoading || isUploading ? 'Đang xử lý...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div> 
  );
};

export default AdminManageMenu;