import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import moment from 'moment'; 
import { FaChair, FaGift, FaTimes } from 'react-icons/fa'; 
import { Swiper, SwiperSlide } from "swiper/react"; 
import "swiper/css"; 
import { Autoplay } from "swiper/modules";

const API_URL = import.meta.env.VITE_API_URL;

const Datban = ({ onClose, prefillData, onBookingSuccess }) => {
  // --- 1. STATE FORM ---
  const [customerName, setCustomerName] = useState(prefillData?.customerName || ""); 
  const [customerPhone, setCustomerPhone] = useState(prefillData?.customerPhone || ""); 
  const [reservationDate, setReservationDate] = useState(prefillData?.date || moment().format('YYYY-MM-DD')); 
  const [startTime, setStartTime] = useState(prefillData?.startTime || "18:00"); 
  const [endTime, setEndTime] = useState(prefillData?.endTime || "20:00");     
  
  const [availableTables, setAvailableTables] = useState([]); 
  const [selectedTableIds, setSelectedTableIds] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false); 
  const [promotions, setPromotions] = useState([]);

  // --- 2. LẤY ƯU ĐÃI ---
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/promotion/getAll`);
        if (res.ok) setPromotions(await res.json());
      } catch (err) {
        console.error("Lỗi tải khuyến mãi", err);
      }
    };
    fetchPromotions();
  }, []);

  const toggleTableSelection = (tableId) => {
    setSelectedTableIds(prev => {
        if (prev.includes(tableId)) return prev.filter(id => id !== tableId);
        else return [...prev, tableId];
    });
  };

  // --- 3. KIỂM TRA BÀN ---
  const checkAvailability = async () => {
    setIsChecking(true);
    setAvailableTables([]); 
    setSelectedTableIds([]); 
    
    if (!reservationDate || !startTime || !endTime) {
        toast.warning("Vui lòng chọn ngày, giờ đến và giờ về.");
        setIsChecking(false); return;
    }

    try {
        const startMoment = moment(`${reservationDate} ${startTime}`, 'YYYY-MM-DD HH:mm');
        const endMoment = moment(`${reservationDate} ${endTime}`, 'YYYY-MM-DD HH:mm');

        if (startMoment.isBefore(moment())) {
            toast.error("Không thể đặt thời gian trong quá khứ.");
            setIsChecking(false); return;
        }
        if (startMoment.isSameOrAfter(endMoment)) {
            toast.error("Giờ về phải sau giờ đến.");
            setIsChecking(false); return;
        }

        const startISO = startMoment.toISOString();
        const endISO = endMoment.toISOString(); 

        const res = await fetch(`${API_URL}/api/reservations/available?start=${startISO}&end=${endISO}`);
        if (!res.ok) throw new Error("Lỗi kết nối.");
        
        const allTables = await res.json();
        const suitableTables = allTables.filter(t => t.seats >= 1).sort((a, b) => a.tableNumber - b.tableNumber); 

        setAvailableTables(suitableTables);
        if (suitableTables.length === 0) toast.warning(`Không còn bàn trống trong khung giờ này.`);
        else toast.success(`Tìm thấy ${suitableTables.length} bàn trống.`);

    } catch (error) { toast.error(error.message); } finally { setIsChecking(false); }
  };

  // --- 4. XỬ LÝ ĐẶT BÀN ---
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || selectedTableIds.length === 0) {
        toast.warning("Vui lòng nhập tên, SĐT và chọn ít nhất 1 bàn.");
        return;
    }
    
    setIsLoading(true);
    try {
        const startISO = moment(`${reservationDate} ${startTime}`, 'YYYY-MM-DD HH:mm').toISOString();
        const endISO = moment(`${reservationDate} ${endTime}`, 'YYYY-MM-DD HH:mm').toISOString();

        let successCount = 0;
        for (const tableId of selectedTableIds) {
            const res = await fetch(
                `${API_URL}/api/reservations/book?name=${customerName}&phone=${customerPhone}&tableId=${tableId}&start=${startISO}&end=${endISO}`,
                { method: 'POST' }
            );
            if (res.ok) successCount++;
        }
        
        if (successCount > 0) {
            toast.success(`🎉 Đặt thành công ${successCount} bàn!`);
            if (onBookingSuccess) await onBookingSuccess(); 
            onClose(); 
        } else {
            toast.error("Đặt bàn thất bại.");
        }
    } catch (error) { console.error(error); toast.error("Lỗi kết nối server."); } finally { setIsLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><FaTimes size={20}/></button>
        
        <h2 className="font-bold text-2xl mb-4 text-center text-gray-800 uppercase tracking-wide">
            {prefillData ? "Thay đổi giờ đặt" : "Đặt bàn giữ chỗ"}
        </h2>

        {/* --- KHUYẾN MÃI (Swiper) --- */}
        {promotions.length > 0 && !prefillData && (
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2 text-yellow-600 font-bold text-sm">
                    <FaGift /> <span>Ưu đãi đang diễn ra</span>
                </div>
                <Swiper modules={[Autoplay]} spaceBetween={10} slidesPerView={1.5} autoplay={{ delay: 3000 }} loop={true} className="rounded-lg">
                    {promotions.map((promo) => (
                        <SwiperSlide key={promo.id}>
                            <div className="relative h-28 w-full rounded-lg overflow-hidden border border-gray-200">
                                <img src={promo.imageUrl} alt={promo.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                                    <p className="text-white text-xs font-bold line-clamp-1">{promo.title}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        )}

        <form onSubmit={handleBooking} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Tên khách</label>
                <input type="text" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
             </div>
             <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Số điện thoại</label>
                <input type="tel" className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
             </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="mb-3">
                <label className="text-xs font-bold text-gray-500 uppercase">Ngày đặt</label>
                <input type="date" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} className="w-full border border-gray-300 p-2 rounded bg-white" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Bắt đầu</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border border-gray-300 p-2 rounded bg-white" required />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Kết thúc</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border border-gray-300 p-2 rounded bg-white" required />
                </div>
            </div>
          </div>

          <button type="button" onClick={checkAvailability} disabled={isChecking} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-colors">
            {isChecking ? '⏳ Đang tìm bàn...' : '🔍 Tìm bàn trống'}
          </button>

          {/* Chọn bàn */}
          {availableTables.length > 0 && (
            <div className="border border-green-200 p-3 rounded-lg bg-green-50">
                <p className="font-bold text-sm mb-2 text-green-800">Chọn bàn ({selectedTableIds.length}):</p>
                <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-1">
                    {availableTables.map(table => (
                        <button key={table.id} type="button" onClick={() => toggleTableSelection(table.id)}
                            className={`p-2 rounded border text-xs flex flex-col items-center transition-all ${selectedTableIds.includes(table.id) ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white border-gray-300 hover:bg-gray-50'}`}>
                            <FaChair /> Bàn {table.tableNumber}
                        </button>
                    ))}
                </div>
            </div>
          )}

          <button type="submit" className="w-full bg-[#174C34] text-white py-3 rounded-xl font-bold hover:bg-green-900 shadow-lg disabled:bg-gray-400 transition-transform active:scale-95" disabled={isLoading || selectedTableIds.length === 0}>
            {isLoading ? 'Đang xử lý...' : prefillData ? 'Lưu thay đổi' : 'XÁC NHẬN ĐẶT BÀN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Datban;