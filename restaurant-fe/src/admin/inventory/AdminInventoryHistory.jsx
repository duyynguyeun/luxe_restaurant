import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { 
  FaHistory, FaSearch, FaEye, FaCheckCircle, FaTruck, FaSignOutAlt, 
  FaSync, FaTimes, FaPlus 
} from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TYPE_BADGES = {
  IMPORT: { label: 'Nhập Kho', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  MANUAL_EXPORT: { label: 'Xuất Thủ Công', bg: 'bg-rose-100 text-rose-700 border-rose-200' },
  ORDER_CONSUMPTION: { label: 'Tiêu Thụ Đơn Hàng', bg: 'bg-blue-100 text-blue-700 border-blue-200' },
  ORDER_RETURN: { label: 'Hoàn Đơn Hủy', bg: 'bg-purple-100 text-purple-700 border-purple-200' },
  WASTE: { label: 'Hàng Hỏng', bg: 'bg-amber-100 text-amber-700 border-amber-200' },
  EXPIRED: { label: 'Hàng Hết Hạn', bg: 'bg-orange-100 text-orange-700 border-orange-200' },
  ADJUSTMENT_IN: { label: 'Điều Chỉnh Tăng', bg: 'bg-teal-100 text-teal-700 border-teal-200' },
  ADJUSTMENT_OUT: { label: 'Điều Chỉnh Giảm', bg: 'bg-slate-100 text-slate-700 border-slate-200' }
};

const STATUS_BADGES = {
  DRAFT: { label: 'Bản Nháp', bg: 'bg-amber-50 text-amber-600 border-amber-200' },
  CONFIRMED: { label: 'Đã Xác Nhận', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  CANCELLED: { label: 'Đã Hủy', bg: 'bg-slate-100 text-slate-500 border-slate-200' }
};

const AdminInventoryHistory = () => {
  const { currentUser } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [transactionCode, setTransactionCode] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const [currentPage, setCurrentPage] = useState(0);
  const [metadata, setMetadata] = useState({
    totalElements: 0,
    totalPages: 1,
    pageNumber: 0,
    pageSize: 10
  });

  // Modal Detail
  const [selectedTx, setSelectedTx] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const fetchTransactions = async (page = 0) => {
    setIsLoading(true);
    try {
      let url = `${API_URL}/api/admin/inventory/transactions?page=${page}&size=10`;
      if (transactionCode) url += `&transactionCode=${encodeURIComponent(transactionCode)}`;
      if (typeFilter) url += `&type=${typeFilter}`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (referenceId) url += `&referenceId=${encodeURIComponent(referenceId)}`;

      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};
      const res = await fetch(url, { headers });

      if (res.ok) {
        const data = await res.json();
        setTransactions(data.content || []);
        if (data.metadata) setMetadata(data.metadata);
      } else {
        toast.error('Lỗi khi tải lịch sử giao dịch kho');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, typeFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchTransactions(0);
  };

  const handleOpenDetail = async (txId) => {
    try {
      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};
      const res = await fetch(`${API_URL}/api/admin/inventory/transactions/${txId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSelectedTx(data);
        setIsDetailOpen(true);
      }
    } catch (err) {
      console.error(err);
      toast.error('Không thể lấy chi tiết phiếu kho');
    }
  };

  const handleConfirmTx = async (txId) => {
    if (!window.confirm('Xác nhận phiếu kho này? Tồn kho sẽ được cộng/trừ ngay lập tức.')) return;

    setIsConfirming(true);
    try {
      const headers = currentUser?.token ? { 'Authorization': `Bearer ${currentUser.token}` } : {};
      const res = await fetch(`${API_URL}/api/admin/inventory/transactions/${txId}/confirm`, {
        method: 'POST',
        headers
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Đã xác nhận phiếu ${data.code} thành công!`);
        setIsDetailOpen(false);
        fetchTransactions(currentPage);
      } else {
        toast.error(data.errorMessage || 'Xác nhận phiếu thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <FaHistory className="text-orange-500" />
            Lịch Sử Giao Dịch Kho
          </h1>
          <p className="text-sm text-slate-500 mt-1">Theo dõi nhật ký tất cả các hoạt động nhập, xuất, tự động tiêu thụ đơn hàng và điều chỉnh tồn kho</p>
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

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 space-y-3">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Mã phiếu (VD: IMP-20260802...)"
              value={transactionCode}
              onChange={(e) => setTransactionCode(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Mã tham chiếu / Order ID..."
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(0); }}
            className="px-3 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">Tất cả loại giao dịch</option>
            {Object.entries(TYPE_BADGES).map(([key, item]) => (
              <option key={key} value={key}>{item.label}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(0); }}
            className="px-3 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:ring-2 focus:ring-orange-500 focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="DRAFT">Bản Nháp (DRAFT)</option>
            <option value="CONFIRMED">Đã Xác Nhận (CONFIRMED)</option>
            <option value="CANCELLED">Đã Hủy (CANCELLED)</option>
          </select>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Thời Gian</th>
                <th className="py-4 px-6">Mã Phiếu</th>
                <th className="py-4 px-6">Loại Giao Dịch</th>
                <th className="py-4 px-6">Trạng Thái</th>
                <th className="py-4 px-6">Tổng Giá Trị</th>
                <th className="py-4 px-6">Người Thao Tác</th>
                <th className="py-4 px-6 text-center">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Đang tải lịch sử giao dịch...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Chưa có giao dịch kho nào.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const typeBadge = TYPE_BADGES[tx.type] || { label: tx.type, bg: 'bg-slate-100 text-slate-600 border-slate-200' };
                  const statusBadge = STATUS_BADGES[tx.status] || { label: tx.status, bg: 'bg-slate-100 text-slate-600 border-slate-200' };
                  const dateFormatted = tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : '-';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 text-xs font-medium text-slate-500">{dateFormatted}</td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-800">{tx.code}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${typeBadge.bg}`}>
                          {typeBadge.label}
                        </span>
                        {tx.referenceId && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Ref: #{tx.referenceId}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${statusBadge.bg}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {(tx.totalValue || 0).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                        {tx.confirmedBy || tx.createdBy || 'SYSTEM'}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleOpenDetail(tx.id)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Xem chi tiết phiếu"
                        >
                          <FaEye />
                        </button>
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
            itemsCount={transactions.length}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Modal Detail Transaction */}
      {isDetailOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  Phiếu Kho #{selectedTx.code}
                </h3>
                <span className="text-xs text-slate-500">Tạo ngày: {new Date(selectedTx.createdAt).toLocaleString('vi-VN')}</span>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Top Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Loại giao dịch</span>
                  <span className="font-bold text-slate-800">{selectedTx.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Trạng thái</span>
                  <span className="font-bold text-slate-800">{selectedTx.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Nhà cung cấp / Ref</span>
                  <span className="font-bold text-slate-800">{selectedTx.supplierName || selectedTx.referenceId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">Tổng giá trị</span>
                  <span className="font-bold text-orange-600 text-sm">{(selectedTx.totalValue || 0).toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              {selectedTx.note && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs">
                  <strong>Ghi chú:</strong> {selectedTx.note}
                </div>
              )}

              {/* Items Table */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3">Danh Sách Nguyên Liệu Chi Tiết</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-600">
                        <th className="p-3">Nguyên Liệu</th>
                        <th className="p-3">Số Lượng Nhập/Xuất</th>
                        <th className="p-3">Số Lượng Chuẩn</th>
                        <th className="p-3">Đơn Giá</th>
                        <th className="p-3">Thành Tiền</th>
                        <th className="p-3">Tồn Trước</th>
                        <th className="p-3">Tồn Sau</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedTx.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold text-slate-800">
                            {item.ingredientCode} - {item.ingredientName}
                          </td>
                          <td className="p-3 text-slate-700">
                            {item.inputQuantity} {item.inputUnit}
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            {item.baseQuantity} {item.baseUnit}
                          </td>
                          <td className="p-3 text-slate-600">
                            {(item.unitCost || 0).toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            {(item.totalCost || 0).toLocaleString('vi-VN')} ₫
                          </td>
                          <td className="p-3 text-slate-500">
                            {item.stockBefore != null ? `${item.stockBefore} ${item.baseUnit}` : '-'}
                          </td>
                          <td className="p-3 font-bold text-emerald-600">
                            {item.stockAfter != null ? `${item.stockAfter} ${item.baseUnit}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Đóng
              </button>
              {selectedTx.status === 'DRAFT' && (
                <button
                  disabled={isConfirming}
                  onClick={() => handleConfirmTx(selectedTx.id)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md flex items-center gap-1.5"
                >
                  <FaCheckCircle /> Xác Nhận Phiếu Ngay
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventoryHistory;
