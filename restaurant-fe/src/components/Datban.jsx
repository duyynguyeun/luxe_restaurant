// file: restaurant-fe/src/components/Datban.jsx (ĐÃ CẬP NHẬT)

import React from "react";
import { useState } from "react";
import { toast } from 'react-toastify';
import moment from 'moment'; 
import { FaChair } from 'react-icons/fa'; 

const API_URL = import.meta.env.VITE_API_URL;

const Datban = ({onClose}) => {
  // State quản lý thông tin đặt bàn
  const [customerName, setCustomerName] = useState(""); 
  const [customerPhone, setCustomerPhone] = useState(""); 
  const [reservationDate, setReservationDate] = useState(moment().format('YYYY-MM-DD')); 
  const [startTime, setStartTime] = useState("18:00"); 
  const [endTime, setEndTime] = useState("20:00");     
  const [partySize, setPartySize] = useState(4); 
  
  // THAY ĐỔI: Sử dụng mảng để lưu nhiều ID bàn đã chọn
  const [availableTables, setAvailableTables] = useState([]); 
  const [selectedTableIds, setSelectedTableIds] = useState([]); // Array mới
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false); 

  const tang = () => { setPartySize(partySize + 1); }; 
  const giam = () => { setPartySize(Math.max(1, partySize - 1)); }; 
  
  // --- HÀM CHỌN/BỎ CHỌN NHIỀU BÀN ---
  const toggleTableSelection = (tableId) => {
    setSelectedTableIds(prev => {
        if (prev.includes(tableId)) {
            return prev.filter(id => id !== tableId); // Bỏ chọn
        } else {
            return [...prev, tableId]; // Chọn
        }
    });
  };

  // --- HÀM KIỂM TRA BÀN TRỐNG ---
  const checkAvailability = async () => {
    setIsChecking(true);
    setAvailableTables([]); 
    setSelectedTableIds([]); // Reset các bàn đã chọn
    
    if (!reservationDate || !startTime || !endTime || partySize < 1) {
        toast.error("Vui lòng chọn Ngày, Giờ Bắt đầu, Giờ Kết thúc và Số lượng người.");
        setIsChecking(false);
        return;
    }

    try {
        const startTimeMoment = moment(`${reservationDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
        const endTimeMoment = moment(`${reservationDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

        if (startTimeMoment.isBefore(moment())) {
            toast.error("Không thể đặt bàn trong quá khứ.");
            setIsChecking(false);
            return;
        }
        
        if (startTimeMoment.isSameOrAfter(endTimeMoment)) {
            toast.error("Giờ Kết thúc phải sau Giờ Bắt đầu.");
            setIsChecking(false);
            return;
        }

        const startISO = startTimeMoment.toISOString();
        const endISO = endTimeMoment.toISOString(); 

        // 1. TÌM TẤT CẢ BÀN TRỐNG (API GET /available)
        const availableRes = await fetch(`${API_URL}/api/reservations/available?start=${startISO}&end=${endISO}`);
        
        if (!availableRes.ok) throw new Error("Lỗi tìm kiếm bàn trống.");
        
        const allTables = await availableRes.json();

        // 2. Lọc chỉ lấy các bàn đủ chỗ
        // Chú ý: Ở chế độ đa bàn, ta chỉ lọc các bàn có sức chứa >= 1 (có thể chứa thêm 1 người)
        const suitableTables = allTables
            .filter(table => table.seats >= 1) // Lọc tất cả bàn trống (Không còn phụ thuộc vào partySize nữa)
            .sort((a, b) => a.tableNumber - b.tableNumber); 

        setAvailableTables(suitableTables);
        
        if (suitableTables.length === 0) {
            toast.warning(`Không tìm thấy bàn trống nào trong khung giờ này.`);
        } else {
            toast.success(`Tìm thấy ${suitableTables.length} bàn trống. Vui lòng CHỌN các bàn bạn muốn đặt.`);
        }

    } catch (error) {
      console.error("Lỗi kiểm tra bàn:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi kiểm tra bàn.");
    } finally {
      setIsChecking(false);
    }
  };


  // --- HÀM XỬ LÝ ĐẶT BÀN (LOOP) ---
  const handleBooking = async (e) => {
    e.preventDefault();

    if (!customerName || !customerPhone || selectedTableIds.length === 0) {
        toast.error("Vui lòng điền đủ Tên, SĐT và CHỌN ít nhất 1 BÀN.");
        return;
    }
    
    setIsLoading(true);

    try {
        const startTimeMoment = moment(`${reservationDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
        const endTimeMoment = moment(`${reservationDate} ${endTime}`, 'YYYY-MM-DD HH:mm');
        const startISO = startTimeMoment.toISOString();
        const endISO = endTimeMoment.toISOString();

        if (startTimeMoment.isSameOrAfter(endTimeMoment)) {
            toast.error("Giờ Kết thúc phải sau Giờ Bắt đầu.");
            setIsLoading(false);
            return;
        }

        let successfulBookings = 0;

        // BƯỚC QUAN TRỌNG: LẶP QUA TẤT CẢ CÁC BÀN ĐÃ CHỌN VÀ GỌI API ĐẶT BÀN ĐƠN LẺ
        for (const tableId of selectedTableIds) {
            const bookRes = await fetch(
                `${API_URL}/api/reservations/book?name=${customerName}&phone=${customerPhone}&tableId=${tableId}&start=${startISO}&end=${endISO}`,
                { method: 'POST' }
            );
            
            if (bookRes.ok) {
                successfulBookings++;
            } else {
                console.error(`Lỗi đặt bàn ${tableId}: ${await bookRes.text()}`);
                // Có thể toast.warning ở đây nếu bạn muốn thông báo lỗi từng bàn
            }
        }
        
        if (successfulBookings > 0) {
            toast.success(`🎉 Đặt thành công ${successfulBookings}/${selectedTableIds.length} bàn!`);
            onClose(); 
        } else {
            toast.error("Đặt bàn thất bại hoàn toàn. Vui lòng thử lại.");
        }

    } catch (error) {
      console.error("Lỗi đặt bàn:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi xử lý đặt bàn.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-full overflow-y-auto">
        
        <form onSubmit={handleBooking} className="space-y-3">
          <h2 className="font-bold text-3xl">Đặt bàn</h2>
          
          {/* Thông tin khách hàng */}
          <div className="py-2 text-red-500">Thông tin của bạn</div>
          <input type="text" placeholder="Nhập tên của bạn..." className="w-full border border-gray-300 px-2 py-2 rounded-lg" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          <input type="tel" placeholder="Nhập số điện thoại của bạn..." className="py-2 w-full border border-gray-300 px-2 rounded-lg" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
          
          {/* Thông tin bàn */}
          <div className="text-red-500">Thông tin bàn</div>
          <div className="space-y-3">
            
            {/* Ngày đặt */}
            <div className="font-semibold text-gray-700">Ngày đặt</div>
            <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="border rounded px-3 py-2" required />
            
            {/* Giờ Bắt đầu & Kết thúc */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="font-semibold text-gray-700">Giờ Bắt đầu</div>
                    <input 
                        type="time" 
                        value={startTime} 
                        onChange={(e) => setStartTime(e.target.value)} 
                        className="border rounded px-3 py-2 w-full" 
                        required 
                    />
                </div>
                
                <div>
                    <div className="font-semibold text-gray-700">Giờ Kết thúc</div>
                    <input 
                        type="time" 
                        value={endTime} 
                        onChange={(e) => setEndTime(e.target.value)} 
                        className="border rounded px-3 py-2 w-full" 
                        required 
                    />
                </div>
            </div>

            {/* Số lượng người (Vẫn giữ để kiểm tra sức chứa tối thiểu) */}
            <div className="font-semibold text-gray-700">Số lượng người</div>
            <div className="flex items-center">
              <button type="button" onClick={giam} className="bg-gray-200 px-4 py-1 rounded text-lg font-bold cursor-pointer hover:bg-gray-300"> - </button>
              <span className="text-xl font-semibold px-4 w-12 text-center">{partySize}</span> 
              <button type="button" onClick={tang} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold cursor-pointer hover:bg-gray-300"> + </button>
            </div>
            
          </div>
          
          {/* NÚT KIỂM TRA BÀN TRỐNG */}
          <div className="pt-2">
            <button
                type="button"
                onClick={checkAvailability}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
                disabled={isChecking}
            >
                {isChecking ? 'Đang kiểm tra...' : 'KIỂM TRA BÀN TRỐNG'}
            </button>
          </div>

          {/* HIỂN THỊ VÀ CHỌN BÀN */}
          {availableTables.length > 0 && (
            <div className="border p-3 rounded-lg bg-gray-50 space-y-3">
                <h4 className="font-bold text-gray-700">Chọn số bàn: <span className="text-sm text-green-600">({selectedTableIds.length} bàn đã chọn)</span></h4>
                
                {/* GRID HIỂN THỊ CÁC BÀN */}
                <div className="grid grid-cols-3 gap-3">
                    {availableTables.map(table => (
                        <button
                            key={table.id} 
                            type="button"
                            onClick={() => toggleTableSelection(table.id)} // Cho phép chọn nhiều
                            className={`
                                flex flex-col items-center p-3 rounded-lg border-2 transition-all 
                                ${selectedTableIds.includes(table.id)
                                    ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-500' 
                                    : 'border-gray-300 bg-white hover:bg-gray-100'
                                }
                            `}
                        >
                            <FaChair size={24} className="text-gray-600 mb-1" />
                            <span className="font-bold text-lg text-gray-800">Bàn {table.tableNumber}</span>
                            <span className="text-xs text-gray-500">({table.seats} chỗ)</span>
                        </button>
                    ))}
                </div>
            </div>
          )}

          {/* NÚT ĐẶT BÀN CHÍNH */}
          <div className="flex justify-between pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 font-medium bg-gray-200 text-gray-800 rounded-3xl cursor-pointer hover:bg-gray-300 mr-2 py-2"
                disabled={isLoading}
              >
                Đóng
              </button>
              <button 
                type="submit" 
                className="flex-1 font-medium bg-green-600 text-white rounded-3xl cursor-pointer hover:bg-green-700 ml-2 py-2 disabled:bg-gray-400"
                disabled={isLoading || selectedTableIds.length === 0} // Vô hiệu hóa nếu chưa chọn bàn nào
              >
                {isLoading ? 'Đang đặt...' : `ĐẶT ${selectedTableIds.length} BÀN`}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Datban;