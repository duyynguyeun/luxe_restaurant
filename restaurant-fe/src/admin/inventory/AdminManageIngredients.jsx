import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaPlus, FaSearch, FaEdit, FaToggleOn, FaToggleOff, 
  FaExclamationTriangle, FaBoxes, FaTimes 
} from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UNIT_LABELS = {
  GRAM: 'Gram (g)',
  KILOGRAM: 'Kilogram (kg)',
  MILLILITER: 'Milliliter (ml)',
  LITER: 'Lít (l)',
  PIECE: 'Cái / Quả / Miếng (Piece)'
};

const AdminManageIngredients = () => {
  const { currentUser } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [metadata, setMetadata] = useState({
    totalElements: 0,
    totalPages: 1,
    pageNumber: 0,
    pageSize: 10
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    baseUnit: 'GRAM',
    description: '',
    lowStockThreshold: 1000,
    active: true
  });

  const fetchIngredients = async (page = 0) => {
    setIsLoading(true);
    try {
      let url = `${API_URL}/api/admin/ingredients?page=${page}&size=10`;
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      if (activeFilter !== '') url += `&active=${activeFilter}`;

      // Nếu bấm lọc lowStock
      if (lowStockOnly) {
        url = `${API_URL}/api/admin/inventory/stocks?page=${page}&size=10&lowStockOnly=true`;
        if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;
      }

      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};
      const res = await fetch(url, { headers });

      if (res.ok) {
        const data = await res.json();
        setIngredients(data.content || []);
        if (data.metadata) setMetadata(data.metadata);
      } else {
        toast.error('Không thể tải danh sách nguyên liệu');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIngredients(currentPage);
  }, [currentPage, activeFilter, lowStockOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchIngredients(0);
  };

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      code: `ING_${Date.now().toString().slice(-4)}`,
      name: '',
      baseUnit: 'GRAM',
      description: '',
      lowStockThreshold: 1000,
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      code: item.code || '',
      name: item.name || '',
      baseUnit: item.baseUnit || 'GRAM',
      description: item.description || '',
      lowStockThreshold: item.lowStockThreshold || 0,
      active: item.active ?? true
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      toast.warn('Vui lòng điền mã và tên nguyên liệu');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {})
      };

      const url = isEditing 
        ? `${API_URL}/api/admin/ingredients/${currentId}` 
        : `${API_URL}/api/admin/ingredients`;

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      });

      const resData = await res.json();

      if (res.ok) {
        toast.success(isEditing ? 'Cập nhật nguyên liệu thành công!' : 'Tạo mới nguyên liệu thành công!');
        setIsModalOpen(false);
        fetchIngredients(currentPage);
      } else {
        toast.error(resData.errorMessage || 'Thao tác thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi lưu nguyên liệu');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};
      const res = await fetch(`${API_URL}/api/admin/ingredients/${id}/status`, {
        method: 'PATCH',
        headers
      });

      if (res.ok) {
        toast.success('Đã thay đổi trạng thái nguyên liệu');
        fetchIngredients(currentPage);
      } else {
        const data = await res.json();
        toast.error(data.errorMessage || 'Không thể đổi trạng thái');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối');
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <FaBoxes className="text-orange-500" />
            Danh Mục Nguyên Liệu
          </h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý định danh, đơn vị cơ sở và ngưỡng cảnh báo tồn kho tối thiểu</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200"
        >
          <FaPlus /> Thêm Nguyên Liệu
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên nguyên liệu..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm transition-all"
          />
          <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={activeFilter}
            onChange={(e) => { setActiveFilter(e.target.value); setCurrentPage(0); }}
            className="px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Tạm ngưng</option>
          </select>

          <button
            onClick={() => { setLowStockOnly(!lowStockOnly); setCurrentPage(0); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              lowStockOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FaExclamationTriangle className={lowStockOnly ? 'text-white' : 'text-amber-500'} />
            Cảnh báo sắp hết
          </button>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Mã</th>
                <th className="py-4 px-6">Tên Nguyên Liệu</th>
                <th className="py-4 px-6">Đơn Vị Gốc</th>
                <th className="py-4 px-6">Tồn Kho Hiện Tại</th>
                <th className="py-4 px-6">Giá Vốn TB (VND)</th>
                <th className="py-4 px-6">Ngưỡng Tồn Thấp</th>
                <th className="py-4 px-6">Trạng Thái</th>
                <th className="py-4 px-6 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Đang tải dữ liệu nguyên liệu...
                  </td>
                </tr>
              ) : ingredients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Không tìm thấy nguyên liệu nào.
                  </td>
                </tr>
              ) : (
                ingredients.map((item) => {
                  const qty = item.quantityOnHand || 0;
                  const threshold = item.lowStockThreshold || 0;
                  const isLow = item.active && qty <= threshold;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-semibold text-slate-700">{item.code}</td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">{item.name}</div>
                        {item.description && (
                          <div className="text-xs text-slate-400 truncate max-w-xs">{item.description}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                          {item.baseUnit}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold">
                        <span className={isLow ? 'text-amber-600 flex items-center gap-1.5' : 'text-slate-800'}>
                          {qty.toLocaleString('vi-VN')} {item.baseUnit}
                          {isLow && <FaExclamationTriangle className="text-amber-500 text-xs animate-bounce" />}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-700">
                        {(item.averageCost || 0).toLocaleString('vi-VN')} ₫ / {item.baseUnit}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {threshold.toLocaleString('vi-VN')} {item.baseUnit}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.active
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {item.active ? 'Đang hoạt động' : 'Tạm ngưng'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa nguyên liệu"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(item.id)}
                            className={`p-2 text-xl transition-colors ${
                              item.active ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-slate-400'
                            }`}
                            title={item.active ? 'Tắt hoạt động' : 'Bật hoạt động'}
                          >
                            {item.active ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-2 bg-slate-50 border-t border-slate-200">
          <Pagination
            currentPage={currentPage}
            totalPages={metadata.totalPages}
            totalElements={metadata.totalElements}
            pageSize={metadata.pageSize || 10}
            itemsCount={ingredients.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">
                {isEditing ? 'Chỉnh Sửa Nguyên Liệu' : 'Thêm Nguyên Liệu Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Mã Nguyên Liệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="VD: ING_BO_UC"
                    required
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                    Đơn Vị Tính Gốc <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.baseUnit}
                    onChange={(e) => setFormData({ ...formData, baseUnit: e.target.value })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {Object.entries(UNIT_LABELS).map(([unitKey, label]) => (
                      <option key={unitKey} value={unitKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Tên Nguyên Liệu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Thịt bò Úc phi lê"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Ngưỡng Tồn Kho Cảnh Báo
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400 uppercase">
                    {formData.baseUnit}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Khi tồn kho xuống thấp hơn ngưỡng này, hệ thống sẽ cảnh báo nhập thêm.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
                  Mô Tả Nguyên Liệu
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ghi chú thêm về điều kiện bảo quản, đặc tính..."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 border-slate-300"
                />
                <label htmlFor="activeCheck" className="text-sm font-medium text-slate-700 cursor-pointer">
                  Kích hoạt nguyên liệu
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md transition-all"
                >
                  {isEditing ? 'Lưu Thay Đổi' : 'Thêm Nguyên Liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageIngredients;
