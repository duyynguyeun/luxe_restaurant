import React, { useState } from 'react';

// Dữ liệu giả (sau này sẽ lấy từ database)
const mockMenuData = [
  { id: "hbg001", ten: "Hamburger", gia: 150000 },
  { id: "gan002", ten: "Gà nướng", gia: 300000 },
  { id: "pho003", ten: "Phở", gia: 200000 },
  { id: "bami004", ten: "Bánh mì", gia: 250000 },
];

const AdminManageMenu = () => {
  const [menuItems, setMenuItems] = useState(mockMenuData);

  const handleAdd = () => {
    // Logic để mở modal/form thêm món ăn
    alert('Mở form thêm món ăn...');
  };

  const handleEdit = (id) => {
    // Logic để mở modal/form sửa món ăn
    alert(`Mở form sửa món ăn ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Logic để xóa món ăn (sau này gọi API)
    if (window.confirm('Bạn có chắc muốn xóa món này?')) {
      setMenuItems(prev => prev.filter(item => item.id !== id));
      alert(`Đã xóa (giả) món ăn ID: ${id}`);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Quản lý Món ăn</h2>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
        >
          + Thêm món
        </button>
      </div>

      {/* Bảng hiển thị Món ăn */}
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
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.ten}</td>
                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">
                  {item.gia.toLocaleString()}₫
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                  <button
                    onClick={() => handleEdit(item.id)}
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
    </div>
  );
};

export default AdminManageMenu;
