import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext'; // 1. Import AuthContext để lấy token

const AdminManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  // const { currentUser } = useAuth(); // 2. Lấy thông tin user (quan trọng cho bảo mật)

  // State cho modal (cửa sổ pop-up)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State cho dữ liệu trong form
  const [newDishName, setNewDishName] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishImage, setNewDishImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //--- CÁC HÀM TẢI VÀ XÓA DỮ LIỆU ---

  // Hàm lấy danh sách món ăn từ API
  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`);
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách món ăn:", error);
    }
  };

  // Gọi hàm fetchMenuItems() khi component được tải lần đầu
  useEffect(() => {
    fetchMenuItems();
  }, []); 

  // Hàm Xóa món ăn (gọi API thật)
  const handleDelete = async (id) => {
    // !! QUAN TRỌNG: Kiểm tra nếu không phải Admin (khi bạn sửa SecurityConfig)
    // if (!currentUser || currentUser.role !== 'ADMIN') {
    //   alert('Bạn không có quyền thực hiện hành động này!');
    //   return;
    // }

    if (window.confirm('Bạn có chắc muốn xóa món này?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/delete/${id}`, {
          method: 'DELETE',
          // Gửi token để xác thực (dù SecurityConfig chưa bắt buộc)
          // headers: {
          //   'Authorization': `Bearer ${currentUser.token}`
          // }
        });

        if (response.ok) {
          alert(`Đã xóa thành công món ăn ID: ${id}`);
          fetchMenuItems(); // Tải lại danh sách sau khi xóa
        } else {
          alert('Xóa thất bại. (API Lỗi ' + response.status + ')');
        }
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  //--- CÁC HÀM THÊM MÓN ĂN ---

  // Hàm này được gọi khi nhấn nút "+ Thêm món"
  const handleAdd = () => {
    // Reset form về rỗng
    setNewDishName('');
    setNewDishPrice('');
    setNewDishImage('');
    setIsLoading(false);
    // Mở cửa sổ
    setIsModalOpen(true); 
  };

  // Hàm này được gọi khi nhấn "Lưu Món Ăn" trong modal
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Ngăn form tải lại trang
    setIsLoading(true);

    // 1. Tạo request body khớp với DishRequest.java
    const newDish = {
      dishName: newDishName,
      price: parseFloat(newDishPrice),
      urlImage: newDishImage,
      categoryId: 1 // 2. Hard-code Category ID là 1 (như đã bàn)
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 3. Gửi Token xác thực
          // 'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(newDish)
      });

      setIsLoading(false);
      if (response.ok) {
        alert('Thêm món ăn thành công!');
        setIsModalOpen(false); // Đóng modal
        fetchMenuItems(); // Tải lại danh sách món ăn
      } else {
        alert('Thêm món ăn thất bại. Lỗi: ' + response.status);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Lỗi khi thêm món ăn:", error);
      alert('Lỗi kết nối.');
    }
  };

  //--- PHẦN GIAO DIỆN (JSX) ---

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý Món ăn</h2>
        <button
          onClick={handleAdd} // 4. Sửa lại: gọi hàm handleAdd
          className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
        >
          + Thêm món
        </button>
      </div>

      {/* Bảng hiển thị Món ăn (Code từ trước) */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Tên Món</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase">Giá</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.nameDish}</td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                  {item.price?.toLocaleString()}₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <button
                    onClick={() => alert('Chức năng Sửa sẽ làm sau')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. CỬA SỔ POP-UP (MODAL) ĐỂ THÊM MÓN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Thêm Món Ăn Mới</h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-4">
                {/* Tên Món */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên Món Ăn</label>
                  <input
                    type="text"
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                
                {/* Giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Giá</label>
                  <input
                    type="number"
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                {/* Link Ảnh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link Hình Ảnh (URL)</label>
                  <input
                    type="text"
                    value={newDishImage}
                    onChange={(e) => setNewDishImage(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
                {/* Chúng ta đã bỏ qua ô chọn Category theo yêu cầu của bạn */}
              </div>

              {/* Nút bấm */}
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang lưu...' : 'Lưu Món Ăn'}
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