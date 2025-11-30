import React from "react";
import { useState } from "react";
import { toast } from 'react-toastify';
import moment from 'moment'; 
// THÊM ICON FACHAIR
import { FaChair } from 'react-icons/fa'; 

const API_URL = import.meta.env.VITE_API_URL;

const Datban = ({onClose}) => {
  // State quản lý thông tin đặt bàn
  const [customerName, setCustomerName] = useState(""); 
  const [customerPhone, setCustomerPhone] = useState(""); 
  const [reservationDate, setReservationDate] = useState(moment().format('YYYY-MM-DD')); 
  const [reservationTime, setReservationTime] = useState("18:00"); 
  const [partySize, setPartySize] = useState(4); 
  
  // STATES MỚI CHO CHỌN BÀN
  const [availableTables, setAvailableTables] = useState([]); 
  const [selectedTableId, setSelectedTableId] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false); 

  const tang = () => { setPartySize(partySize + 1); }; 
  const giam = () => { setPartySize(Math.max(1, partySize - 1)); }; 
  
  
  // --- HÀM KIỂM TRA BÀN TRỐNG ---
  const checkAvailability = async () => {
    setIsChecking(true);
    setAvailableTables([]); 
    setSelectedTableId(""); 
    
    if (!reservationDate || !reservationTime || partySize < 1) {
        toast.error("Vui lòng chọn Ngày, Giờ và Số lượng người.");
        setIsChecking(false);
        return;
    }

    try {
        const startTimeMoment = moment(`${reservationDate} ${reservationTime}`, 'YYYY-MM-DD HH:mm');
        const endTimeMoment = startTimeMoment.clone().add(2, 'hours');

        if (startTimeMoment.isBefore(moment())) {
            toast.error("Không thể đặt bàn trong quá khứ.");
            setIsChecking(false);
            return;
        }

        const startISO = startTimeMoment.toISOString();
        const endISO = endTimeMoment.toISOString();

        // 1. TÌM BÀN TRỐNG (API GET /available)
        const availableRes = await fetch(`${API_URL}/api/reservations/available?start=${startISO}&end=${endISO}`);
        
        if (!availableRes.ok) throw new Error("Lỗi tìm kiếm bàn trống.");
        
        const allTables = await availableRes.json();

        // 2. Lọc chỉ lấy các bàn đủ chỗ
        const suitableTables = allTables
            .filter(table => table.seats >= partySize)
            .sort((a, b) => a.tableNumber - b.tableNumber); 

        setAvailableTables(suitableTables);
        setSelectedTableId(suitableTables.length > 0 ? suitableTables[0].id : ""); // Tự động chọn bàn đầu tiên
        
        if (suitableTables.length === 0) {
            toast.warning(`Không tìm thấy bàn trống phù hợp cho ${partySize} người.`);
        } else {
            toast.success(`Tìm thấy ${suitableTables.length} bàn trống. Vui lòng CHỌN BÀN.`);
        }

    } catch (error) {
      console.error("Lỗi kiểm tra bàn:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi kiểm tra bàn.");
    } finally {
      setIsChecking(false);
    }
  };


  // --- HÀM XỬ LÝ ĐẶT BÀN ---
  const handleBooking = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!customerName || !customerPhone || !selectedTableId) {
        toast.error("Vui lòng điền Tên, SĐT và CHỌN BÀN.");
        setIsLoading(false);
        return;
    }
    
    try {
        const startTimeMoment = moment(`${reservationDate} ${reservationTime}`, 'YYYY-MM-DD HH:mm');
        const endTimeMoment = startTimeMoment.clone().add(2, 'hours');
        const startISO = startTimeMoment.toISOString();
        const endISO = endTimeMoment.toISOString();

        // API POST: /api/reservations/book
        const bookRes = await fetch(
            `${API_URL}/api/reservations/book?name=${customerName}&phone=${customerPhone}&tableId=${selectedTableId}&start=${startISO}&end=${endISO}`,
            { method: 'POST' }
        );
        
        if (!bookRes.ok) {
           const errorText = await bookRes.text();
           throw new Error(`Đặt bàn thất bại: ${errorText}`);
        }
        
        const bookedReservation = await bookRes.json();
        toast.success(`🎉 Đặt bàn thành công! Bàn số ${bookedReservation.table.tableNumber}.`);
        onClose(); 

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
            
            {/* Số lượng */}
            <div className="font-semibold text-gray-700">Số lượng người</div>
            <div className="flex items-center">
              <button type="button" onClick={giam} className="bg-gray-200 px-4 py-1 rounded text-lg font-bold cursor-pointer hover:bg-gray-300"> - </button>
              <span className="text-xl font-semibold px-4 w-12 text-center">{partySize}</span> 
              <button type="button" onClick={tang} className="bg-gray-200 px-3 py-1 rounded text-lg font-bold cursor-pointer hover:bg-gray-300"> + </button>
            </div>
            
            {/* Thời gian */}
            <div className="font-semibold text-gray-700">Thời gian</div>
            <input type="time" value={reservationTime} onChange={(e) => setReservationTime(e.target.value)} className="border rounded px-3 py-2" required />
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

          {/* HIỂN THỊ VÀ CHỌN BÀN (THAY THẾ SELECT BẰNG GRID CARDS) */}
          {availableTables.length > 0 && (
            <div className="border p-3 rounded-lg bg-gray-50 space-y-3">
                <h4 className="font-bold text-gray-700">Chọn số bàn:</h4>
                
                {/* GRID HIỂN THỊ CÁC BÀN */}
                <div className="grid grid-cols-3 gap-3">
                    {availableTables.map(table => (
                        <button
                            key={table.id} 
                            type="button"
                            onClick={() => setSelectedTableId(table.id)} // Chọn bàn khi click
                            className={`
                                flex flex-col items-center p-3 rounded-lg border-2 transition-all 
                                ${selectedTableId == table.id 
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
                disabled={isLoading || !selectedTableId} // Vô hiệu hóa nếu chưa chọn bàn
              >
                {isLoading ? 'Đang đặt...' : 'ĐẶT BÀN NGAY'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Datban;