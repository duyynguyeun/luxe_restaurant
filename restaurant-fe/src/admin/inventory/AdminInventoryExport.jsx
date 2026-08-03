import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaCheckCircle, FaSave, FaSignOutAlt, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const EXPORT_TYPES = [
  { value: 'MANUAL_EXPORT', label: 'Xuất kho sử dụng nội bộ' },
  { value: 'WASTE', label: 'Xuất bỏ hàng hỏng' },
  { value: 'EXPIRED', label: 'Xuất bỏ hàng hết hạn' },
  { value: 'ADJUSTMENT_OUT', label: 'Điều chỉnh giảm kho (Kểm kê thiếu)' },
  { value: 'ADJUSTMENT_IN', label: 'Điều chỉnh tăng kho (Kiểm kê thừa)' }
];

const UNIT_OPTIONS = [
  { value: 'GRAM', label: 'Gram (g)' },
  { value: 'KILOGRAM', label: 'Kilogram (kg)' },
  { value: 'MILLILITER', label: 'Milliliter (ml)' },
  { value: 'LITER', label: 'Lít (l)' },
  { value: 'PIECE', label: 'Cái / Quả / Miếng (Piece)' }
];

const AdminInventoryExport = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeIngredients, setActiveIngredients] = useState([]);
  const [transactionType, setTransactionType] = useState('MANUAL_EXPORT');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState([
    { ingredientId: '', quantity: 1, unit: 'GRAM' }
  ]);

  useEffect(() => {
    fetchActiveIngredients();
  }, []);

  const fetchActiveIngredients = async () => {
    try {
      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};
      const res = await fetch(`${API_URL}/api/admin/ingredients?active=true&size=1000`, { headers });
      if (res.ok) {
        const data = await res.json();
        setActiveIngredients(data.content || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải danh sách nguyên liệu');
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { ingredientId: '', quantity: 1, unit: 'GRAM' }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      toast.warn('Phiếu xuất phải có ít nhất 1 nguyên liệu');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'ingredientId') {
      const selected = activeIngredients.find(ing => String(ing.id) === String(value));
      if (selected) {
        newItems[index].unit = selected.baseUnit;
      }
    }

    setItems(newItems);
  };

  const handleSubmit = async (confirmImmediately = false) => {
    if (items.some(item => !item.ingredientId)) {
      toast.warn('Vui lòng chọn nguyên liệu cho tất cả các dòng');
      return;
    }
    if (items.some(item => parseFloat(item.quantity) <= 0)) {
      toast.warn('Số lượng xuất phải lớn hơn 0');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: transactionType,
        note: note.trim(),
        items: items.map(item => ({
          ingredientId: parseInt(item.ingredientId),
          quantity: parseFloat(item.quantity),
          unit: item.unit
        }))
      };

      const headers = {
        'Content-Type': 'application/json',
        ...(currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {})
      };

      const endpoint = (transactionType === 'ADJUSTMENT_IN' || transactionType === 'ADJUSTMENT_OUT')
        ? `${API_URL}/api/admin/inventory/adjustments`
        : `${API_URL}/api/admin/inventory/exports`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const transData = await res.json();

      if (!res.ok) {
        toast.error(transData.errorMessage || 'Tạo phiếu xuất thất bại');
        setIsSubmitting(false);
        return;
      }

      if (confirmImmediately) {
        if (!window.confirm(`Xác nhận phiếu xuất kho ${transData.code}? Tồn kho sẽ bị giảm lập tức!`)) {
          toast.info('Đã lưu bản nháp phiếu!');
          navigate('/admin/inventory/history');
          return;
        }

        const confirmRes = await fetch(`${API_URL}/api/admin/inventory/transactions/${transData.id}/confirm`, {
          method: 'POST',
          headers
        });

        const confirmData = await confirmRes.json();
        if (confirmRes.ok) {
          toast.success(`Đã xác nhận thành công phiếu ${confirmData.code}! Tồn kho đã được cập nhật.`);
        } else {
          toast.error(confirmData.errorMessage || 'Xác nhận phiếu thất bại');
        }
      } else {
        toast.success(`Đã tạo bản nháp phiếu ${transData.code}`);
      }

      navigate('/admin/inventory/history');

    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi gửi phiếu xuất kho');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/inventory/history')}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <FaSignOutAlt className="text-red-500" />
              Lập Phiếu Xuất / Điều Chỉnh Kho
            </h1>
            <p className="text-sm text-slate-500 mt-1">Xuất kho thủ công, hủy nguyên liệu hỏng/hết hạn hoặc điều chỉnh sau kiểm kê</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={isSubmitting}
            onClick={() => handleSubmit(false)}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            <FaSave /> Lưu Bản Nháp
          </button>
          <button
            disabled={isSubmitting}
            onClick={() => handleSubmit(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <FaCheckCircle /> Xác Nhận Xuất Kho
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
            Thông Tin Phiếu Xuất Kho
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              Loại Giao Dịch <span className="text-red-500">*</span>
            </label>
            <select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              {EXPORT_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              Lý Do / Ghi Chú Xuất Kho
            </label>
            <textarea
              rows="5"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi rõ nguyên nhân xuất hỏng, sự cố kiểm kê hoặc bộ phận yêu cầu xuất..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
            ></textarea>
          </div>
        </div>

        {/* Right Column: Items Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-800">Danh Sách Nguyên Liệu Xuất</h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                <FaPlus /> Thêm Dòng
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item, idx) => {
                const selectedIng = activeIngredients.find(ing => String(ing.id) === String(item.ingredientId));
                const currentStock = selectedIng ? selectedIng.quantityOnHand : 0;

                return (
                  <div key={idx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3 relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Nguyên Liệu ({idx + 1}) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={item.ingredientId}
                          onChange={(e) => handleItemChange(idx, 'ingredientId', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                        >
                          <option value="">-- Chọn nguyên liệu --</option>
                          {activeIngredients.map(ing => (
                            <option key={ing.id} value={ing.id}>
                              {ing.code} - {ing.name} (Hiện có: {ing.quantityOnHand} {ing.baseUnit})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Đơn Vị Tính <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                        >
                          {UNIT_OPTIONS.map(u => (
                            <option key={u.value} value={u.value}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Số Lượng Xuất <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0.001"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                      </div>

                      {selectedIng && (
                        <div className="text-xs text-slate-500">
                          Tồn khả dụng: <strong className="text-slate-800 font-bold">{currentStock} {selectedIng.baseUnit}</strong>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-2 rounded transition-colors"
                        title="Xóa dòng"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryExport;
