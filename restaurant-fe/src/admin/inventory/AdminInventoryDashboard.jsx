import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { 
  FaBoxes, FaExclamationTriangle, FaTimesCircle, FaCoins, 
  FaTruck, FaSignOutAlt, FaHistory, FaArrowRight 
} from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const AdminInventoryDashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [lowStockList, setLowStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};

      const [dashRes, lowRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/inventory/dashboard`, { headers }),
        fetch(`${API_URL}/api/admin/ingredients/low-stock`, { headers })
      ]);

      if (dashRes.ok) {
        const data = await dashRes.json();
        setDashboardData(data);
      }
      if (lowRes.ok) {
        const lowData = await lowRes.json();
        setLowStockList(lowData || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi tải tổng quan kho');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('REFRESH_ADMIN_DATA', handleRefresh);
    return () => window.removeEventListener('REFRESH_ADMIN_DATA', handleRefresh);
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <FaBoxes className="text-orange-500" />
            Tổng Quan Quản Lý Kho
          </h1>
          <p className="text-sm text-slate-500 mt-1">Báo cáo tồn kho thực tế, giá trị nguyên liệu lưu kho và các cảnh báo nhập hàng gấp</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/inventory/import"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all text-sm"
          >
            <FaTruck /> Lập Phiếu Nhập
          </Link>
          <Link
            to="/admin/inventory/export"
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all text-sm"
          >
            <FaSignOutAlt /> Lập Phiếu Xuất
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Nguyên Liệu</span>
            <div className="text-2xl font-black text-slate-800 mt-1">
              {isLoading ? '...' : (dashboardData?.totalActiveIngredients || 0)}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Đang hoạt động trong menu</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
            <FaBoxes />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cảnh Báo Tồn Thấp</span>
            <div className="text-2xl font-black text-amber-600 mt-1">
              {isLoading ? '...' : (dashboardData?.lowStockCount || 0)}
            </div>
            <span className="text-xs text-amber-600 font-medium mt-1 block">Cần lên kế hoạch nhập</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
            <FaExclamationTriangle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã Hết Hàng</span>
            <div className="text-2xl font-black text-red-600 mt-1">
              {isLoading ? '...' : (dashboardData?.outOfStockCount || 0)}
            </div>
            <span className="text-xs text-red-500 font-medium mt-1 block">Ảnh hưởng chế biến món</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
            <FaTimesCircle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Giá Trị Tồn Kho</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {isLoading ? '...' : `${(dashboardData?.totalStockValue || 0).toLocaleString('vi-VN')} ₫`}
            </div>
            <span className="text-xs text-slate-500 mt-1 block">Tính theo giá vốn bình quân</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
            <FaCoins />
          </div>
        </div>
      </div>

      {/* Two columns: Low Stock List & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Low Stock List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FaExclamationTriangle className="text-amber-500" />
                Nguyên Liệu Cần Nhập Gấp
              </h2>
              <Link
                to="/admin/inventory/ingredients"
                className="text-xs text-orange-600 hover:underline font-semibold flex items-center gap-1"
              >
                Xem tất cả <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {lowStockList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  🎉 Tất cả nguyên liệu đều có số lượng tồn kho đạt chuẩn!
                </div>
              ) : (
                lowStockList.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/70 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                      <div className="text-slate-400 font-mono mt-0.5">{item.code}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-amber-700 text-sm">
                        Tồn: {item.quantityOnHand} {item.baseUnit}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Ngưỡng: {item.lowStockThreshold} {item.baseUnit}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Recent Transactions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FaHistory className="text-orange-500" />
                Giao Dịch Gần Đây
              </h2>
              <Link
                to="/admin/inventory/history"
                className="text-xs text-orange-600 hover:underline font-semibold flex items-center gap-1"
              >
                Lịch sử đầy đủ <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {!dashboardData?.recentTransactions || dashboardData.recentTransactions.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  Chưa có giao dịch kho gần đây.
                </div>
              ) : (
                dashboardData.recentTransactions.map(tx => (
                  <div
                    key={tx.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 font-mono">{tx.code}</div>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        {tx.type} • {tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : ''}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-slate-800">
                        {(tx.totalValue || 0).toLocaleString('vi-VN')} ₫
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInventoryDashboard;
