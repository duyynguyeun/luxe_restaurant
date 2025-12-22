import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes } from 'react-icons/fa';

const AdminManagePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPromotionId, setCurrentPromotionId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: ''
  });

  // Fetch all promotions
  const fetchPromotions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/promotion/getAll`, {
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      } else {
        toast.error('Không thể tải danh sách ưu đãi');
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [currentUser]);

  // Handle image upload
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images`, {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        const imageUrl = await response.text();
        setFormData(prev => ({ ...prev, imageUrl }));
        toast.success('Upload ảnh thành công!');
      } else {
        toast.error("Lỗi upload ảnh!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Không thể kết nối server upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/api/promotion/update/${currentPromotionId}`
        : `${import.meta.env.VITE_API_URL}/api/promotion/create`;

      const method = isEditing ? 'POST' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success(isEditing ? 'Cập nhật ưu đãi thành công!' : 'Thêm ưu đãi thành công!');
        setIsModalOpen(false);
        setFormData({ title: '', imageUrl: '', description: '' });
        setIsEditing(false);
        setCurrentPromotionId(null);
        fetchPromotions();
      } else {
        toast.error('Có lỗi xảy ra!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi kết nối server');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (promotion) => {
    setFormData({
      title: promotion.title,
      imageUrl: promotion.imageUrl,
      description: promotion.description
    });
    setIsEditing(true);
    setCurrentPromotionId(promotion.id);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ưu đãi này?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/promotion/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`
        }
      });

      if (response.ok) {
        toast.success('Xóa ưu đãi thành công!');
        fetchPromotions();
      } else {
        toast.error('Có lỗi xảy ra khi xóa!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ title: '', imageUrl: '', description: '' });
    setIsEditing(false);
    setCurrentPromotionId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý ưu đãi</h2>
          <p className="text-slate-600 mt-1">Thêm, sửa, xóa các chương trình ưu đãi</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus />
          Thêm ưu đãi
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <div key={promotion.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-slate-100 relative">
              {promotion.imageUrl ? (
                <img
                  src={promotion.imageUrl}
                  alt={promotion.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <FaImage size={48} />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-slate-800 mb-2">{promotion.title}</h3>
              <p className="text-slate-600 text-sm mb-3 line-clamp-2">{promotion.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {new Date(promotion.createdAt).toLocaleDateString('vi-VN')}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(promotion)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {promotions.length === 0 && (
        <div className="text-center py-12">
          <FaImage size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">Chưa có ưu đãi nào</h3>
          <p className="text-slate-500">Hãy thêm ưu đãi đầu tiên của bạn</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  {isEditing ? 'Chỉnh sửa ưu đãi' : 'Thêm ưu đãi mới'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tiêu đề ưu đãi
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Nhập tiêu đề ưu đãi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                    placeholder="Nhập mô tả ưu đãi"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hình ảnh
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      className="w-full"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="text-sm text-orange-600">Đang upload ảnh...</div>
                    )}
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Đang xử lý...' : (isEditing ? 'Cập nhật' : 'Thêm mới')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagePromotions;