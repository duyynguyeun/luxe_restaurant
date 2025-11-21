import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
// Import thêm icon cho nút Sửa, Xóa, Toggle
import { FaDollarSign, FaTag, FaImage, FaTimes, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const AdminManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const { currentUser } = useAuth(); 

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State phân biệt đang Thêm hay đang Sửa
  const [isEditing, setIsEditing] = useState(false); 
  const [currentDishId, setCurrentDishId] = useState(null);

  // State dữ liệu form
  const [formData, setFormData] = useState({
    dishName: '',
    price: '',
    urlImage: ''
  });

  // --- 1. CÁC HÀM TẢI DỮ LIỆU ---
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`);
      if (response.ok) {
        const data = await response.json();
        // Sắp xếp: Món mới nhất lên đầu (tùy chọn)
        setMenuItems(data.reverse());
      }
    } catch (error) {
      console.error("Lỗi tải menu:", error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []); 

  // --- 2. HÀM BẬT/TẮT MÓN ĂN ---
  const handleToggle = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/toggle/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`
        }
      });
      if (response.ok) {
        // Cập nhật lại giao diện ngay lập tức mà không cần load lại trang
        setMenuItems(prevItems => prevItems.map(item => 
          item.id === id ? { ...item, active: !item.active } : item
        ));
      } else {
        alert('Lỗi khi cập nhật trạng thái.');
      }
    } catch (error) {
      console.error("Lỗi toggle:", error);
    }
  };

  // --- 3. HÀM XÓA MÓN ĂN ---
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa món này vĩnh viễn?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        if (response.ok) {
          fetchMenuItems(); 
        } else {
          alert('Xóa thất bại.');
        }
      } catch (error) {
        console.error("Lỗi xóa:", error);
      }
    }
  };

  // --- 4. HÀM MỞ MODAL (CHO CẢ THÊM VÀ SỬA) ---
  
  // Khi bấm nút "+ Thêm món"
  const openAddModal = () => {
    setIsEditing(false); // Chế độ thêm
    setFormData({ dishName: '', price: '', urlImage: '' }); // Reset form
    setIsModalOpen(true);
  };

  // Khi bấm nút "Sửa"
  const openEditModal = (dish) => {
    setIsEditing(true); // Chế độ sửa
    setCurrentDishId(dish.id);
    // Điền thông tin cũ vào form
    setFormData({
      dishName: dish.nameDish,
      price: dish.price,
      urlImage: dish.urlImage,
      // THÊM DÒNG NÀY VÀO:
      categoryId: dish.categoryId || (categories.length > 0 ? categories[0].id : '')
    });
    setIsModalOpen(true);
  };

  // --- 5. HÀM SUBMIT FORM (XỬ LÝ CẢ 2 TRƯỜNG HỢP) ---
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
      let url = `${import.meta.env.VITE_API_URL}/api/dish/create`;
      let method = 'POST';

      // Nếu đang sửa, đổi URL và Method
      if (isEditing) {
        url = `${import.meta.env.VITE_API_URL}/api/dish/update/${currentDishId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(isEditing ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        setIsModalOpen(false);
        fetchMenuItems();
      } else {
        alert('Thao tác thất bại. Lỗi: ' + response.status);
      }
    } catch (error) {
      console.error("Lỗi submit:", error);
      alert('Lỗi kết nối.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý Món ăn</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-all shadow-md flex items-center gap-2"
        >
          <span>+</span> Thêm món
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Hình ảnh</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Tên Món</th>
              <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Giá</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Trạng thái</th>
              <th className="px-6 py-3 text-center text-sm font-semibold uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {/* Ảnh nhỏ */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={item.urlImage} alt={item.nameDish} className="h-12 w-12 rounded-full object-cover border" />
                </td>
                {/* Tên */}
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.nameDish}</td>
                {/* Giá */}
                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">
                  {item.price?.toLocaleString()}₫
                </td>
                {/* Nút Bật/Tắt */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    onClick={() => handleToggle(item.id)}
                    className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all mx-auto w-28 ${
                      item.active 
                        ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {item.active ? <FaToggleOn className="text-lg"/> : <FaToggleOff className="text-lg"/>}
                    {item.active ? 'Đang Bật' : 'Đã Tắt'}
                  </button>
                </td>
                {/* Hành động */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
                      title="Sửa"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Xóa"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL (DÙNG CHUNG CHO THÊM & SỬA) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg transform scale-100">
            
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? 'Cập nhật Món Ăn' : 'Thêm Món Ăn Mới'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Tên Món */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên Món Ăn</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.dishName}
                    onChange={(e) => setFormData({...formData, dishName: e.target.value})}
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="Ví dụ: Phở bò đặc biệt"
                    required
                  />
                </div>
              </div>
              
              {/* Giá */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giá tiền (VNĐ)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="Ví dụ: 50000"
                    required
                  />
                </div>
              </div>

              {/* Link Ảnh */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Link Hình Ảnh</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaImage className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.urlImage}
                    onChange={(e) => setFormData({...formData, urlImage: e.target.value})}
                    className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    placeholder="https://..."
                    required
                  />
                </div>
                {/* Preview ảnh nếu có link */}
                {formData.urlImage && (
                  <div className="mt-3 flex justify-center">
                    <img src={formData.urlImage} alt="Preview" className="h-32 w-full object-cover rounded-lg shadow-md border" 
                         onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              {/* Nút bấm */}
              <div className="mt-8 flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
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