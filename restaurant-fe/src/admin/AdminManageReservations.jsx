import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaBan, FaList } from 'react-icons/fa'; // FaList đã được thêm
import moment from 'moment';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  RESERVED: 'bg-blue-100 text-blue-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const AdminManageReservations = () => {
  // 💡 BẮT ĐẦU VỚI MẢNG RỖNG (SẼ ĐƯỢC LOAD TỪ SERVER)
  const [reservations, setReservations] = useState([]); 
  
  // --- HÀM TẢI DỮ LIỆU THỰC TẾ ---
  const fetchReservations = async () => {
    try {
      // GỌI API THỰC TẾ VỪA TẠO
      const res = await fetch(`${API_URL}/api/reservations/getall`); 
      if (res.ok) {
        const data = await res.json();
        // Sắp xếp: Đơn đặt bàn mới nhất lên đầu
        setReservations(data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
      } else {
        console.error("Lỗi tải đặt bàn:", res.status, await res.text());
        toast.error("Không thể tải đơn đặt bàn.");
      }
    } catch (err) {
      console.error("Lỗi tải đặt bàn:", err);
      toast.error("Lỗi kết nối Server.");
    }
  };
  // --------------------------------

  useEffect(() => { fetchReservations(); }, []);

  // Xử lý Hủy đặt bàn (PUT /api/reservations/cancel/{id})
  const handleCancel = async (id) => {
    if (!window.confirm("Xác nhận HỦY đơn đặt bàn này?")) return;

    try {
      const res = await fetch(`${API_URL}/api/reservations/cancel/${id}`, { 
        method: 'PUT',
      });

      if (res.ok) {
        toast.success(`Đã hủy đặt bàn #${id}.`);
        fetchReservations(); // Tải lại dữ liệu từ Server
      } else {
        toast.error("Lỗi khi hủy đặt bàn.");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Xử lý Đánh dấu Hoàn thành/Bàn Trống (PUT /api/reservations/table-status/{tableId})
  const handleMarkAvailable = async (reservation) => {
      if (!window.confirm(`Xác nhận khách bàn ${reservation.table.tableNumber} đã dùng xong? Bàn sẽ được đánh dấu TRỐNG.`)) return;

      try {
        const res = await fetch(`${API_URL}/api/reservations/table-status/${reservation.table.id}?status=AVAILABLE`, {
            method: 'PUT',
        });
        
        if (res.ok) {
             toast.success(`Bàn ${reservation.table.tableNumber} đã được đánh dấu TRỐNG.`);
             fetchReservations(); // Tải lại dữ liệu từ Server
        } else {
            toast.error("Lỗi khi cập nhật trạng thái bàn.");
        }

      } catch (error) {
        console.error(error);
      }
  };


  return (
    <div className="bg-white p-8 rounded-lg shadow-lg min-h-[80vh]">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3"><FaList/> Quản lý Đặt Bàn</h2>
      
      {/* 💡 XOÁ DÒNG CẢNH BÁO DỮ LIỆU GIẢ LẬP Ở ĐÂY */}
      
      {reservations.length === 0 ? (
        <p className="text-center text-gray-500 py-10">Không có đơn đặt bàn nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3 text-left">ID Đặt chỗ</th>
                <th className="p-3 text-left">Khách hàng</th>
                <th className="p-3 text-center">Bàn & Sức chứa</th>
                <th className="p-3 text-center">Thời gian</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {reservations.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  
                  <td className="p-3 font-bold text-gray-600">#{r.id}</td>

                  <td className="p-3">
                    <div className="font-bold text-gray-800">{r.customerName}</div>
                    <div className="text-sm text-gray-500">📞 {r.customerPhone}</div>
                  </td>

                  <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded text-sm font-semibold text-white ${r.table?.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-gray-500'}`}>
                          Bàn {r.table?.tableNumber}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">({r.table?.seats} chỗ)</div>
                  </td>
                  
                  <td className="p-3 text-center text-sm">
                      <div className="font-semibold text-gray-800">
                          {moment(r.startTime).format('HH:mm')} - {moment(r.endTime).format('HH:mm')}
                      </div>
                      <div className="text-gray-500">
                          {moment(r.startTime).format('DD/MM/YYYY')}
                      </div>
                  </td>

                  <td className="p-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusColors[r.status] || 'bg-gray-200 text-gray-600'}`}>
                      {r.status === 'RESERVED' ? 'Đã Đặt' :
                       r.status === 'CANCELLED' ? 'Đã Hủy' :
                       'Hoàn thành'}
                    </span>
                  </td>

                  <td className="p-3 text-center space-x-2">

                    {r.status === 'RESERVED' && (
                      <>
                        <button
                          onClick={() => handleMarkAvailable(r)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 shadow-md transition-transform active:scale-95 flex items-center justify-center mx-auto mb-1"
                          title="Đánh dấu Khách đã dùng xong và giải phóng bàn"
                        >
                          <FaCheckCircle className='mr-2'/> Bàn Trống
                        </button>

                        <button
                          onClick={() => handleCancel(r.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 shadow-md transition-transform active:scale-95 flex items-center justify-center mx-auto"
                          title="Hủy đặt bàn"
                        >
                          <FaBan className='mr-2'/> Hủy Đặt
                        </button>
                      </>
                    )}
                    {r.status !== 'RESERVED' && <span className="text-gray-500 italic text-sm">Không thể thao tác</span>}
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