import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <p className="text-lg text-gray-700">
        Chào mừng bạn đến với trang quản trị.
      </p>
      <p className="mt-2 text-gray-600">
        Tại đây bạn có thể quản lý các chức năng của website. Hãy chọn một mục từ thanh bên trái để bắt đầu.
      </p>

      {/* Bạn có thể thêm các thống kê nhanh ở đây */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard title="Tổng số món ăn" value="100" />
        <StatCard title="Đơn hàng hôm nay" value="50" />
        <StatCard title="Tổng người dùng" value="36" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <h3 className="text-gray-500 font-medium uppercase text-sm">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
