import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaBan, FaList, FaRegTrashAlt } from 'react-icons/fa';
import moment from 'moment';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  RESERVED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

// --- HÀM 1: NHÓM CÁC ĐẶT BÀN ĐƠN LẺ THÀNH CÁC ĐẶT BÀN LOGIC ---
const groupReservations = (reservations) => {
    const groups = {};

    reservations.forEach(res => {
        // Chuẩn hóa thời gian về UTC để đảm bảo nhóm đúng bất kể múi giờ client
        const startTimeUTC = moment.utc(res.startTime).toISOString();
        const endTimeUTC = moment.utc(res.endTime).toISOString();
        
        // Khóa nhóm: Tên Khách + SĐT + Khung giờ UTC
        const key = `${res.customerName}-${res.customerPhone}-${startTimeUTC}-${endTimeUTC}`;

        if (!groups[key]) {
            groups[key] = {
                // Thông tin chung của nhóm
                customerName: res.customerName,
                customerPhone: res.customerPhone,
                startTime: res.startTime,
                endTime: res.endTime,
                status: res.status, 
                // Danh sách các ID đặt bàn và Số bàn
                reservationIds: [], 
                tableNumbers: [],
                // Lấy ID bàn đại diện cho hành động Mark Available (Lưu ý: API này không hoàn hảo cho đa bàn)
                representativeTableId: res.table?.id, 
            };
        }
        
        // Thêm ID và Số bàn vào nhóm
        groups[key].reservationIds.push(res.id);
        
        if (res.table?.tableNumber && !groups[key].tableNumbers.includes(res.table.tableNumber)) {
             groups[key].tableNumbers.push(res.table.tableNumber);
        }
        
        // Cập nhật trạng thái nhóm (Ưu tiên: RESERVED > COMPLETED > CANCELLED)
        if (res.status === 'RESERVED') {
             groups[key].status = 'RESERVED';
        } else if (res.status === 'COMPLETED' && groups[key].status !== 'RESERVED') {
             groups[key].status = 'COMPLETED'; 
        }
        // Nếu tất cả đều CANCELLED, nó sẽ giữ nguyên CANCELLED.
    });
    
    const finalGroupedList = Object.values(groups);
    
    // Sắp xếp số bàn để hiển thị đẹp
    finalGroupedList.forEach(group => {
        group.tableNumbers.sort((a, b) => a - b);
    });
    
    // Sắp xếp nhóm theo thời gian đặt (mới nhất lên đầu)
    finalGroupedList.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    return finalGroupedList;
};

// --- HÀM CHUNG 2: XỬ LÝ HÀNH ĐỘNG ĐA ID (CANCEL) ---
const handleMultiAction = async (reservationIds, endpoint, successMessage) => {
    let successCount = 0;
    
    for (const id of reservationIds) {
        try {
            // API: PUT /api/reservations/{endpoint}/{id}
            const res = await fetch(`${API_URL}/api/reservations/${endpoint}/${id}`, { 
                method: 'PUT',
            });

            if (res.ok) {
                successCount++;
            }
        } catch (error) {
            console.error(`Error processing ID ${id}:`, error);
        }
    }
    
    if (successCount > 0) {
        toast.success(successMessage.replace('{count}', successCount).replace('{total}', reservationIds.length));
        fetchReservations(); 
    } else if (reservationIds.length > 0) {
        toast.error("Thực hiện hành động thất bại hoàn toàn.");
    }
};


const AdminManageReservations = () => {
    const [reservations, setReservations] = useState([]); 
    const [groupedReservations, setGroupedReservations] = useState([]); // State mới cho dữ liệu đã nhóm
    const [isLoading, setIsLoading] = useState(true);

    // --- HÀM TẢI DỮ LIỆU THỰC TẾ ---
    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/reservations/getall`); 
            if (!res.ok) throw new Error("Không thể tải đơn đặt bàn.");
            
            const data = await res.json();
            setReservations(data); 
            
            // BƯỚC QUAN TRỌNG: GÁN DỮ LIỆU ĐÃ NHÓM VÀO STATE MỚI
            setGroupedReservations(groupReservations(data));

        } catch (err) {
            console.error("Lỗi tải đặt bàn:", err);
            toast.error(err.message || "Lỗi kết nối Server.");
            setGroupedReservations([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchReservations(); }, []);

    // Xử lý Hủy đặt bàn (PUT /api/reservations/cancel/{id}) -> Dùng MultiAction
    const handleCancelGroup = (reservationIds) => {
        if (!window.confirm(`Xác nhận HỦY tất cả ${reservationIds.length} đơn đặt bàn này?`)) return;
        handleMultiAction(reservationIds, 'cancel', 'Đã hủy {count}/{total} đơn đặt bàn.');
    };
    
    // Xử lý Đánh dấu Bàn Trống (API dùng tableId, áp dụng cho bàn đại diện)
    const handleMarkAvailableSingle = async (representativeTableId) => {
        if (!window.confirm("Xác nhận khách đã dùng xong? Bàn đại diện sẽ được đánh dấu TRỐNG.")) return;

        try {
            // API: PUT /api/reservations/table-status/{tableId}?status=AVAILABLE
            const res = await fetch(`${API_URL}/api/reservations/table-status/${representativeTableId}?status=AVAILABLE`, {
                method: 'PUT',
            });
            
            if (res.ok) {
                 toast.success(`Bàn đại diện đã được đánh dấu TRỐNG.`);
                 fetchReservations(); 
            } else {
                toast.error("Lỗi khi cập nhật trạng thái bàn.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Lỗi kết nối Server.");
        }
    };


    if (isLoading) {
        return <div className="text-center py-10"><p>Đang tải dữ liệu...</p></div>; // Thay bằng component LoadingSpinner nếu muốn
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg min-h-[80vh]">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3"><FaList/> Quản lý Đặt Bàn</h2>
          
          {groupedReservations.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Không có đơn đặt bàn nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-3 text-left">Khách hàng</th>
                    <th className="p-3 text-center">Các Bàn đã đặt</th>
                    <th className="p-3 text-center">Ngày</th>
                    <th className="p-3 text-center">Giờ Bắt đầu</th>
                    <th className="p-3 text-center">Giờ Kết thúc</th>
                    <th className="p-3 text-center">Trạng thái</th>
                    <th className="p-3 text-center">Hành động</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {groupedReservations.map(group => (
                    <tr key={group.reservationIds.join('-')} className="hover:bg-gray-50 transition-colors">
                      
                      {/* KHÁCH HÀNG & SĐT */}
                      <td className="p-3">
                        <div className="font-bold text-gray-800">{group.customerName}</div>
                        <div className="text-sm text-gray-500">📞 {group.customerPhone}</div>
                        <div className="text-xs text-gray-400 mt-1">IDs: {group.reservationIds.join(', ')}</div>
                      </td>

                      {/* CÁC BÀN ĐÃ ĐẶT (ĐÃ NHÓM) */}
                      <td className="p-3 text-center">
                          <span className="font-bold text-lg text-blue-600">
                              {group.tableNumbers.join(', ')}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">({group.tableNumbers.length} bàn)</div>
                      </td>
                      
                      {/* NGÀY (Fix Timezone) */}
                      <td className="p-3 text-center text-sm font-medium text-gray-700">
                          {moment.utc(group.startTime).local().format('DD/MM/YYYY')}
                      </td>
                      
                      {/* GIỜ BẮT ĐẦU (Fix Timezone) */}
                      <td className="p-3 text-center text-sm font-semibold text-green-600">
                          {moment.utc(group.startTime).local().format('HH:mm')}
                      </td>

                      {/* GIỜ KẾT THÚC (Fix Timezone) */}
                      <td className="p-3 text-center text-sm font-semibold text-red-600">
                          {moment.utc(group.endTime).local().format('HH:mm')}
                      </td>


                      {/* TRẠNG THÁI CHUNG */}
                      <td className="p-3 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusColors[group.status] || 'bg-gray-200 text-gray-600'}`}>
                          {group.status === 'RESERVED' ? 'Đã Đặt' :
                           group.status === 'CANCELLED' ? 'Đã Hủy' :
                           'Hoàn thành'}
                        </span>
                      </td>

                      {/* HÀNH ĐỘNG (Áp dụng cho Nhóm) */}
                      <td className="p-3 text-center space-x-2">

                        {group.status === 'RESERVED' && (
                          <>
                            <button
                              onClick={() => handleMarkAvailableSingle(group.representativeTableId)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 shadow-md transition-transform active:scale-95 flex items-center justify-center mx-auto mb-1"
                              title={`Đánh dấu Bàn đại diện ${group.tableNumbers[0]} TRỐNG (áp dụng cho Bàn đại diện)`}
                            >
                              <FaCheckCircle className='mr-2'/> Bàn Trống
                            </button>

                            <button
                              onClick={() => handleCancelGroup(group.reservationIds)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 shadow-md transition-transform active:scale-95 flex items-center justify-center mx-auto"
                              title={`Hủy tất cả ${group.tableNumbers.length} đơn đặt bàn`}
                            >
                              <FaBan className='mr-2'/> Hủy Đặt (Tất cả)
                            </button>
                          </>
                        )}
                        {group.status !== 'RESERVED' && <span className="text-gray-500 italic text-sm">Không thể thao tác</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
    );
};

export default AdminManageReservations;