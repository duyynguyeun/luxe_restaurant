import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaCheckCircle, FaSave, FaTruck, FaBoxes, FaArrowLeft } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const UNIT_OPTIONS = [
  { value: 'GRAM', label: 'Gram (g)' },
  { value: 'KILOGRAM', label: 'Kilogram (kg)' },
  { value: 'MILLILITER', label: 'Milliliter (ml)' },
  { value: 'LITER', label: 'Lít (l)' },
  { value: 'PIECE', label: 'Cái / Quả / Miếng (Piece)' }
];

const AdminInventoryImport = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [activeIngredients, setActiveIngredients] = useState([]);
  const [supplierName, setSupplierName] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [items, setItems] = useState([
    { ingredientId: '', quantity: 1, unit: 'KILOGRAM', unitCost: 0, batchCode: '', expiryDate: '' }
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
      { ingredientId: '', quantity: 1, unit: 'KILOGRAM', unitCost: 0, batchCode: '', expiryDate: '' }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      toast.warn('Phiếu nhập phải có ít nhất 1 nguyên liệu');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    // Nếu chọn nguyên liệu, tự động đề xuất đơn vị tính tương ứng với baseUnit của nguyên liệu
    if (field === 'ingredientId') {
      const selected = activeIngredients.find(ing => String(ing.id) === String(value));
      if (selected) {
        newItems[index].unit = selected.baseUnit;
      }
    }

    setItems(newItems);
  };

  const calculateTotalValue = () => {
    return items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const cost = parseFloat(item.unitCost) || 0;
      return sum + (qty * cost);
    }, 0);
  };

  const handleSubmit = async (confirmImmediately = false) => {
    // Validate
    if (items.some(item => !item.ingredientId)) {
      toast.warn('Vui lòng chọn nguyên liệu cho tất cả các dòng');
      return;
    }
    if (items.some(item => parseFloat(item.quantity) <= 0)) {
      toast.warn('Số lượng nhập phải lớn hơn 0');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        type: 'IMPORT',
        supplierName: supplierName.trim(),
        note: note.trim(),
        items: items.map(item => ({
          ingredientId: parseInt(item.ingredientId),
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          unitCost: parseFloat(item.unitCost) || 0,
          batchCode: item.batchCode ? item.batchCode.trim() : null,
          expiryDate: item.expiryDate ? item.expiryDate : null
        }))
      };

      const headers = {
        'Content-Type': 'application/json',
        ...(currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {})
      };

      // 1. Tạo phiếu DRAFT
      const res = await fetch(`${API_URL}/api/admin/inventory/imports`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const transData = await res.json();

      if (!res.ok) {
        toast.error(transData.errorMessage || 'Tạo phiếu nhập thất bại');
        setIsSubmitting(false);
        return;
      }

      // 2. Nếu chọn Confirm ngay
      if (confirmImmediately) {
        if (!window.confirm(`Xác nhận nhập kho phiếu ${transData.code}? Tồn kho sẽ được cộng dồn ngay lập tức!`)) {
          toast.info('Đã lưu bản nháp phiếu nhập!');
          navigate('/admin/inventory/history');
          return;
        }

        const confirmRes = await fetch(`${API_URL}/api/admin/inventory/transactions/${transData.id}/confirm`, {
          method: 'POST',
          headers
        });

        const confirmData = await confirmRes.json();
        if (confirmRes.ok) {
          toast.success(`Đã xác nhận thành công phiếu nhập ${confirmData.code}! Kho đã được cập nhật.`);
        } else {
          toast.error(confirmData.errorMessage || 'Xác nhận phiếu thất bại');
        }
      } else {
        toast.success(`Đã tạo bản nháp phiếu nhập ${transData.code}`);
      }

      navigate('/admin/inventory/history');

    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi gửi phiếu nhập kho');
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
              <FaTruck className="text-orange-500" />
              Lập Phiếu Nhập Kho
            </h1>
            <p className="text-sm text-slate-500 mt-1">Tạo phiếu nhập nguyên liệu từ nhà cung cấp và tự động tính giá vốn bình quân gia quyền</p>
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
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all"
          >
            <FaCheckCircle /> Xác Nhận Nhập Kho
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Supplier & Header Info */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FaBoxes className="text-orange-500" /> Thông Tin Chung Phiếu Nhập
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              Nhà Cung Cấp
            </label>
            <input
              type="text"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="VD: Công ty Thực phẩm Sạch Chăn Nuôi Việt"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">
              Ghi Chú Phiếu Nhập
            </label>
            <textarea
              rows="4"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm về chứng từ, hóa đơn GTGT, số xe giao hàng..."
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 bg-orange-50/50 p-4 rounded-xl">
            <div className="text-xs text-slate-500 uppercase font-semibold">Tổng giá trị dự kiến:</div>
            <div className="text-2xl font-black text-orange-600 mt-1">
              {calculateTotalValue().toLocaleString('vi-VN')} ₫
            </div>
          </div>
        </div>

        {/* Right Column: Line Items Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-800">Chi Tiết Danh Sách Nguyên Liệu Nhập</h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-orange-100 text-orange-600 hover:bg-orange-200 font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                <FaPlus /> Thêm Dòng
              </button>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item, idx) => {
                const selectedIng = activeIngredients.find(ing => String(ing.id) === String(item.ingredientId));
                const itemTotal = (parseFloat(item.quantity) || 0) * (parseFloat(item.unitCost) || 0);

                return (
                  <div key={idx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-3 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Ingredient Select */}
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Nguyên Liệu ({idx + 1}) <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={item.ingredientId}
                          onChange={(e) => handleItemChange(idx, 'ingredientId', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                          <option value="">-- Chọn nguyên liệu --</option>
                          {activeIngredients.map(ing => (
                            <option key={ing.id} value={ing.id}>
                              {ing.code} - {ing.name} (Tồn: {ing.quantityOnHand} {ing.baseUnit})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Input Unit */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Đơn Vị Nhập <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                          {UNIT_OPTIONS.map(u => (
                            <option key={u.value} value={u.value}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Số Lượng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min="0.001"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Đơn Giá Mua (VND)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Mã Lô (Option)
                        </label>
                        <input
                          type="text"
                          placeholder="BATCH01"
                          value={item.batchCode}
                          onChange={(e) => handleItemChange(idx, 'batchCode', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                          Hạn Sử Dụng
                        </label>
                        <input
                          type="date"
                          value={item.expiryDate}
                          onChange={(e) => handleItemChange(idx, 'expiryDate', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500">
                        Thành tiền: <strong className="text-slate-800 font-bold">{itemTotal.toLocaleString('vi-VN')} ₫</strong>
                        {selectedIng && (
                          <span className="ml-2 text-slate-400">
                            (Base Unit: {selectedIng.baseUnit})
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
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

export default AdminInventoryImport;
