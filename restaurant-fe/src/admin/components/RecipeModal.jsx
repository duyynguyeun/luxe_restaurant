import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTimes, FaPlus, FaTrash, FaSave, FaUtensils, FaCoins, FaExclamationTriangle } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const RecipeModal = ({ dishId, dishName, isOpen, onClose }) => {
  const { currentUser } = useAuth();

  const [activeIngredients, setActiveIngredients] = useState([]);
  const [recipeItems, setRecipeItems] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && dishId) {
      fetchRecipeData();
    }
  }, [isOpen, dishId]);

  const fetchRecipeData = async () => {
    setIsLoading(true);
    try {
      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};

      const [recipeRes, availRes, ingRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/menu-items/${dishId}/ingredients`, { headers }),
        fetch(`${API_URL}/api/menu-items/${dishId}/availability`, { headers }),
        fetch(`${API_URL}/api/admin/ingredients?active=true&size=1000`, { headers })
      ]);

      if (recipeRes.ok) {
        const recipeData = await recipeRes.json();
        setRecipeItems(recipeData || []);
      }
      if (availRes.ok) {
        setAvailability(await availRes.json());
      }
      if (ingRes.ok) {
        const ingData = await ingRes.json();
        setActiveIngredients(ingData.content || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải công thức món ăn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLine = () => {
    setRecipeItems([
      ...recipeItems,
      { ingredientId: '', quantity: 1, note: '' }
    ]);
  };

  const handleRemoveLine = (index) => {
    setRecipeItems(recipeItems.filter((_, i) => i !== index));
  };

  const handleLineChange = (index, field, value) => {
    const newItems = [...recipeItems];
    newItems[index][field] = value;

    if (field === 'ingredientId') {
      const selected = activeIngredients.find(ing => String(ing.id) === String(value));
      if (selected) {
        newItems[index].ingredientCode = selected.code;
        newItems[index].ingredientName = selected.name;
        newItems[index].baseUnit = selected.baseUnit;
        newItems[index].averageCost = selected.averageCost || 0;
        newItems[index].estimatedCost = (parseFloat(newItems[index].quantity) || 0) * (selected.averageCost || 0);
      }
    } else if (field === 'quantity') {
      const avgCost = newItems[index].averageCost || 0;
      newItems[index].estimatedCost = (parseFloat(value) || 0) * avgCost;
    }

    setRecipeItems(newItems);
  };

  const calculateTotalEstimatedCost = () => {
    return recipeItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  };

  const handleSaveRecipe = async () => {
    // Validate
    if (recipeItems.some(item => !item.ingredientId)) {
      toast.warn('Vui lòng chọn nguyên liệu cho tất cả các dòng');
      return;
    }
    if (recipeItems.some(item => parseFloat(item.quantity) <= 0)) {
      toast.warn('Số lượng nguyên liệu phải lớn hơn 0');
      return;
    }

    // Check trùng lặp ingredientId
    const ingredientIds = recipeItems.map(item => String(item.ingredientId));
    if (new Set(ingredientIds).size !== ingredientIds.length) {
      toast.error('Công thức món không được chứa các dòng nguyên liệu trùng lặp!');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        items: recipeItems.map(item => ({
          ingredientId: parseInt(item.ingredientId),
          quantity: parseFloat(item.quantity),
          note: item.note ? item.note.trim() : ''
        }))
      };

      const headers = {
        'Content-Type': 'application/json',
        ...(currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {})
      };

      const res = await fetch(`${API_URL}/api/admin/menu-items/${dishId}/ingredients`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success(`Cập nhật công thức món '${dishName}' thành công!`);
        onClose();
      } else {
        const errorData = await res.json();
        toast.error(errorData.errorMessage || 'Lỗi khi lưu công thức');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <FaUtensils className="text-orange-500" />
              Công Thức Nguyên Liệu: {dishName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Cấu hình định lượng và tự động tính giá vốn món ăn</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Availability Badge & Estimated Cost Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Khả năng chế biến hiện tại</span>
                <div className="text-xl font-black text-orange-600 mt-0.5">
                  {availability ? `${availability.availableServings} suất` : '0 suất'}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                availability?.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {availability?.status || 'N/A'}
              </span>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Giá vốn món dự kiến</span>
                <div className="text-xl font-black text-emerald-600 mt-0.5">
                  {calculateTotalEstimatedCost().toLocaleString('vi-VN')} ₫
                </div>
              </div>
              <FaCoins className="text-emerald-500 text-2xl" />
            </div>
          </div>

          {/* Lines Table */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-slate-800 text-sm">Danh Sách Thành Phần Nguyên Liệu</h4>
              <button
                type="button"
                onClick={handleAddLine}
                className="flex items-center gap-1.5 bg-orange-100 text-orange-600 hover:bg-orange-200 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
              >
                <FaPlus /> Thêm Dòng
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-slate-400 text-sm">Đang tải công thức...</div>
            ) : recipeItems.length === 0 ? (
              <div className="py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">
                Món ăn này chưa được cấu hình công thức nguyên liệu nào.
              </div>
            ) : (
              <div className="space-y-3">
                {recipeItems.map((item, idx) => {
                  const selectedIng = activeIngredients.find(ing => String(ing.id) === String(item.ingredientId));
                  const baseUnit = item.baseUnit || (selectedIng ? selectedIng.baseUnit : '-');
                  const estCost = item.estimatedCost || 0;

                  return (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                      {/* Ingredient Select (5 cols) */}
                      <div className="sm:col-span-4">
                        <select
                          value={item.ingredientId || ''}
                          onChange={(e) => handleLineChange(idx, 'ingredientId', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        >
                          <option value="">-- Chọn nguyên liệu --</option>
                          {activeIngredients.map(ing => (
                            <option key={ing.id} value={ing.id}>
                              {ing.code} - {ing.name} ({ing.baseUnit})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity Input (3 cols) */}
                      <div className="sm:col-span-3 flex items-center gap-2">
                        <input
                          type="number"
                          min="0.001"
                          step="any"
                          value={item.quantity || ''}
                          onChange={(e) => handleLineChange(idx, 'quantity', e.target.value)}
                          placeholder="Số lượng"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                        <span className="font-semibold text-slate-500 text-xs w-12">{baseUnit}</span>
                      </div>

                      {/* Estimated Cost (3 cols) */}
                      <div className="sm:col-span-3 text-slate-600 font-medium">
                        Giá vốn: <strong className="text-slate-800 font-bold">{estCost.toLocaleString('vi-VN')} ₫</strong>
                      </div>

                      {/* Delete Button (2 cols) */}
                      <div className="sm:col-span-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(idx)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Xóa nguyên liệu này"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Hủy Bỏ
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveRecipe}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md transition-all flex items-center gap-1.5"
          >
            <FaSave /> Lưu Công Thức
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
