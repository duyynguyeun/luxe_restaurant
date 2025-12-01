import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../giohang/CartContext";
import { FaQrcode, FaMoneyBillWave, FaTimes, FaCalendarAlt, FaHistory, FaTrash, FaEdit, FaChair, FaClock, FaHashtag, FaCheckCircle, FaBan } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/vi'; 
import Datban from "../components/Datban";

moment.locale('vi');

const MY_BANK = {
  BANK_ID: "MB", 
  ACCOUNT_NO: "0386984907", 
  ACCOUNT_NAME: "NGUYEN DUY HIEU", 
};

// --- HÀM GOM NHÓM & SẮP XẾP ---
const groupReservations = (reservations) => {
    const groups = {};
    reservations.forEach(res => {
        const startRaw = res.startTime;
        const endRaw = res.endTime;
        const key = `${res.customerPhone}-${startRaw}-${endRaw}`;
        
        if (!groups[key]) {
            groups[key] = {
                ids: [],
                tableNumbers: [],
                customerName: res.customerName,
                customerPhone: res.customerPhone,
                startTime: res.startTime,
                endTime: res.endTime,
                status: res.status
            };
        }
        groups[key].ids.push(res.id);
        if (res.table?.tableNumber) groups[key].tableNumbers.push(res.table.tableNumber);
        if (res.status === 'RESERVED') groups[key].status = 'RESERVED';
    });
    
    return Object.values(groups).sort((a, b) => {
        if (a.status === 'RESERVED' && b.status !== 'RESERVED') return -1;
        if (a.status !== 'RESERVED' && b.status === 'RESERVED') return 1;
        
        if (a.status === 'RESERVED') {
            return new Date(a.startTime) - new Date(b.startTime);
        } else {
            return new Date(b.startTime) - new Date(a.startTime);
        }
    });
};

const CartPage = () => {
  const navigate = useNavigate(); 
  const { cart, decreaseItem, addToCart, removeFromCart, total } = useContext(CartContext);
  const { currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("CART");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "", address: "", note: "" });

  const [myReservations, setMyReservations] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  
  const [realUserPhone, setRealUserPhone] = useState(""); 
  const [realUserName, setRealUserName] = useState("");

  // --- 1. LẤY THÔNG TIN USER ---
  useEffect(() => {
    const getUserInfo = async () => {
        if (currentUser?.id) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/find/${currentUser.id}`);
                if (res.ok) {
                    const userData = await res.json();
                    setRealUserPhone(userData.phone || "");
                    setRealUserName(userData.userName || "");
                }
            } catch (error) { console.error(error); }
        }
    };
    getUserInfo();
  }, [currentUser]);

  // --- 2. TẢI ĐẶT BÀN ---
  const fetchMyReservations = async () => {
    if (!realUserPhone) return;
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/getall`);
        if (res.ok) {
            const data = await res.json();
            const myData = data.filter(r => r.customerPhone === realUserPhone);
            setMyReservations(groupReservations(myData));
        }
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    if (activeTab === "RESERVATION") fetchMyReservations();
  }, [activeTab, realUserPhone]);

  // --- CÁC HÀM XỬ LÝ ĐẶT BÀN ---
  const handleCancelReservation = async (group) => {
    const localTime = moment.utc(group.startTime).local().format('HH:mm');
    Swal.fire({
        title: 'Hủy đặt bàn?',
        text: `Hủy bàn số ${group.tableNumbers.join(', ')} lúc ${localTime}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đồng ý hủy',
        cancelButtonText: 'Không'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                for (const id of group.ids) {
                    await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/cancel/${id}`, { method: 'PUT' });
                }
                toast.success("Đã hủy thành công.");
                fetchMyReservations();
            } catch { toast.error("Lỗi khi hủy."); }
        }
    });
  };

  const openEditModal = (group) => { setEditingGroup(group); setIsEditModalOpen(true); };
  
  const onEditSuccess = async () => {
    if (editingGroup) {
        for (const id of editingGroup.ids) await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/cancel/${id}`, { method: 'PUT' });
        toast.info("Cập nhật lịch thành công!"); setEditingGroup(null); fetchMyReservations();
    }
  };

  const onNewBookingSuccess = () => { fetchMyReservations(); };

  // --- HÀM THANH TOÁN (ĐÃ SỬA LỖI THIẾU HÀM NÀY) ---
  const handleCheckoutClick = () => {
    if (!currentUser) {
      Swal.fire({
        title: "Chưa đăng nhập!",
        text: "Vui lòng đăng nhập để thanh toán.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy"
      }).then((result) => {
        if (result.isConfirmed) navigate("/login");
      });
      return;
    }
    // Mở modal thanh toán
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) { toast.warning("Vui lòng điền đủ thông tin!"); return; }
    const orderData = { userId: currentUser?.id, customerName: customerInfo.name, customerPhone: customerInfo.phone, customerAddress: customerInfo.address, note: customerInfo.note, paymentMethod, totalPrice: total, items: cart.map(i => ({ dishName: i.ten, quantity: i.quantity, price: i.gia })) };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(orderData) });
      if (res.ok) { toast.success("Đặt hàng thành công!"); setIsPaymentModalOpen(false); window.location.href = "/my-orders"; }
      else toast.error("Lỗi đặt hàng.");
    } catch { toast.error("Lỗi kết nối."); }
  };

  const handleOpenBooking = () => {
      if(!realUserPhone) {
          toast.warning("Vui lòng cập nhật Số điện thoại trong Hồ sơ trước!");
          navigate("/profile");
          return;
      }
      setIsNewBookingModalOpen(true);
  }

  // --- HELPER RENDER ---
  const renderStatusBadge = (status) => {
      switch (status) {
          case 'RESERVED':
              return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 shadow-sm flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Đang giữ chỗ</span>;
          case 'CANCELLED':
              return <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1"><FaBan size={10}/> Đã hủy</span>;
          default:
              return <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Hoàn thành</span>;
      }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER TAB */}
        <div className="flex justify-center mb-10">
            <div className="bg-white p-1.5 rounded-full shadow-lg border border-gray-100 inline-flex gap-1">
                <button onClick={() => setActiveTab("CART")} className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === "CART" ? "bg-[#174C34] text-white shadow-lg transform scale-105" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                    🛒 Giỏ hàng <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1">{cart.length}</span>
                </button>
                <button onClick={() => setActiveTab("RESERVATION")} className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 ${activeTab === "RESERVATION" ? "bg-[#174C34] text-white shadow-lg transform scale-105" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                    <FaCalendarAlt /> Bàn đã đặt
                </button>
            </div>
        </div>

        {/* --- CONTENT 1: GIỎ HÀNG --- */}
        {activeTab === "CART" && (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                {cart.length === 0 ? (
                    <div className="text-center py-24 flex flex-col items-center">
                        <div className="bg-green-50 p-8 rounded-full mb-6 animate-bounce-slow">
                            <span className="text-5xl text-[#174C34]">🛒</span>
                        </div>
                        <p className="text-gray-500 text-lg font-medium">Giỏ hàng của bạn đang trống.</p>
                        <button onClick={() => navigate("/menu")} className="mt-8 bg-[#174C34] text-white px-10 py-3.5 rounded-full font-bold hover:bg-green-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Xem Thực Đơn
                        </button>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full mb-8">
                                <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider rounded-xl">
                                    <tr><th className="p-4 text-left rounded-l-xl">Món ăn</th><th className="p-4 text-center">Đơn giá</th><th className="p-4 text-center">Số lượng</th><th className="p-4 text-center">Thành tiền</th><th className="p-4 rounded-r-xl"></th></tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {cart.map((item) => (
                                        <tr key={item.ten} className="hover:bg-gray-50 transition-colors group">
                                            <td className="p-4 flex items-center gap-4">
                                                <img src={item.img} className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-100 group-hover:scale-105 transition-transform" alt=""/> 
                                                <span className="font-bold text-gray-800 text-lg">{item.ten}</span>
                                            </td>
                                            <td className="p-4 text-center text-gray-600 font-medium">{item.gia.toLocaleString()}₫</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center border border-gray-200 rounded-xl w-fit mx-auto bg-white shadow-sm overflow-hidden">
                                                    <button onClick={() => decreaseItem(item.ten)} className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-bold transition">-</button>
                                                    <span className="px-4 font-bold text-gray-800">{item.quantity}</span>
                                                    <button onClick={() => addToCart(item)} className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-bold transition">+</button>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center font-extrabold text-[#174C34] text-xl">{(item.gia * item.quantity).toLocaleString()}₫</td>
                                            <td className="p-4 text-center"><button onClick={() => removeFromCart(item.ten)} className="text-gray-300 hover:text-red-500 transition p-2"><FaTrash size={20}/></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col md:flex-row justify-end items-center gap-8 border-t border-gray-100 pt-8">
                            <div className="text-gray-600 text-lg">Tổng cộng: <span className="text-[#174C34] text-4xl font-extrabold ml-3">{total.toLocaleString()}₫</span></div>
                            
                            {/* Nút thanh toán đã gọi đúng hàm handleCheckoutClick */}
                            <button onClick={handleCheckoutClick} className="bg-yellow-500 text-white px-12 py-4 rounded-full font-bold shadow-lg hover:bg-yellow-600 transition transform hover:-translate-y-1 hover:shadow-2xl text-lg">
                                Thanh toán ngay
                            </button>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* --- CONTENT 2: QUẢN LÝ ĐẶT BÀN --- */}
        {activeTab === "RESERVATION" && (
            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                {!currentUser ? (
                    <div className="bg-white p-12 rounded-3xl shadow-xl text-center border border-gray-100">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500"><FaCalendarAlt size={32}/></div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập để xem</h3>
                        <p className="text-gray-500 mb-8">Vui lòng đăng nhập để quản lý lịch đặt bàn của bạn.</p>
                        <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition">Đăng nhập ngay</button>
                    </div>
                ) : myReservations.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl shadow-xl text-center border border-gray-100">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                            <FaCalendarAlt className="text-5xl text-[#174C34] opacity-60"/>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Chưa có lịch đặt bàn</h3>
                        <p className="text-gray-500">Bạn chưa đặt bàn nào sắp tới. Đặt ngay để giữ chỗ!</p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm text-gray-600">
                            <FaClock className="text-gray-400"/> SĐT đăng ký: <span className="font-bold text-gray-800">{realUserPhone || "..."}</span>
                        </div>
                        <br/>
                        <button onClick={handleOpenBooking} className="mt-8 bg-[#174C34] text-white px-10 py-3.5 rounded-full font-bold shadow-xl hover:bg-green-800 transition transform hover:-translate-y-1">
                            + Đặt bàn ngay
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6 px-2">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-[#174C34] rounded-full"></span> Lịch sử đặt bàn
                            </h2>
                            <button onClick={handleOpenBooking} className="bg-[#174C34] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-800 shadow-md transition flex items-center gap-2">
                                <FaCalendarAlt/> + Đặt thêm
                            </button>
                        </div>

                        {myReservations.map((group, idx) => {
                            const isCancelled = group.status === 'CANCELLED';
                            const isReserved = group.status === 'RESERVED';
                            
                            const localStartTime = moment.utc(group.startTime).local();
                            const localEndTime = moment.utc(group.endTime).local();

                            return (
                                <div key={idx} className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-300 ${isCancelled ? 'opacity-60 grayscale-[0.5] border border-gray-200' : 'shadow-lg border border-green-100 hover:shadow-xl hover:border-green-300'}`}>
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isReserved ? 'bg-green-500' : isCancelled ? 'bg-red-400' : 'bg-gray-400'}`}></div>
                                    <div className="p-6 pl-8">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-dashed border-gray-200">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3.5 rounded-2xl shadow-sm ${isReserved ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                                                    <FaCalendarAlt size={24}/>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Ngày đặt</p>
                                                    <h3 className="text-xl font-extrabold text-gray-800 capitalize">
                                                        {localStartTime.format("dddd, DD/MM/YYYY")}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="mt-3 md:mt-0 flex flex-col items-end">
                                                {renderStatusBadge(group.status)}
                                                <span className="text-xs text-gray-400 mt-1.5 font-mono flex items-center gap-1">
                                                    <FaHashtag size={10}/> Mã đơn: {group.ids[0]}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-2xl mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1"><FaClock/> Thời gian</div>
                                                <p className="text-gray-800 font-bold text-xl tracking-tight">
                                                    {localStartTime.format("HH:mm")} 
                                                    <span className="text-gray-400 mx-2 font-light">⸺</span> 
                                                    {localEndTime.format("HH:mm")}
                                                </p>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase mb-1"><FaChair/> Bàn đã chọn</div>
                                                <div className="flex flex-wrap gap-2">
                                                    {group.tableNumbers.map(num => (
                                                        <span key={num} className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-bold shadow-sm">
                                                            Bàn {num}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {isReserved && (
                                            <div className="flex justify-end gap-3 pt-2">
                                                <button onClick={() => openEditModal(group)} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition shadow-sm text-sm">
                                                    <FaEdit /> Thay đổi
                                                </button>
                                                <button onClick={() => handleCancelReservation(group)} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-red-500 rounded-xl font-bold hover:bg-red-50 hover:border-red-200 transition shadow-sm text-sm">
                                                    <FaTrash /> Hủy bàn
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
            </div>
        )}
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in relative">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition"><FaTimes size={22}/></button>
            <h2 className="text-2xl font-extrabold mb-6 text-center text-gray-800">Thanh toán đơn hàng</h2>
            <div className="space-y-4 mb-6">
               <input className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="Tên người nhận" onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
               <input className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="Số điện thoại" onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
               <input className="w-full border border-gray-300 p-3.5 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition bg-gray-50 focus:bg-white" placeholder="Địa chỉ giao hàng" onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
               <textarea className="w-full border border-gray-300 p-3.5 rounded-xl bg-yellow-50 focus:ring-2 focus:ring-yellow-400 outline-none resize-none transition" rows="2" placeholder="Ghi chú món ăn" onChange={e => setCustomerInfo({...customerInfo, note: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={()=>setPaymentMethod("CASH")} className={`p-3 rounded-xl flex flex-col items-center gap-1 transition border-2 ${paymentMethod==="CASH"?"border-green-500 bg-green-50 text-green-700 font-bold":"border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><FaMoneyBillWave size={20}/> Tiền mặt</button>
                <button onClick={()=>setPaymentMethod("QR_CODE")} className={`p-3 rounded-xl flex flex-col items-center gap-1 transition border-2 ${paymentMethod==="QR_CODE"?"border-blue-500 bg-blue-50 text-blue-700 font-bold":"border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200"}`}><FaQrcode size={20}/> Chuyển khoản</button>
            </div>
            {paymentMethod === "QR_CODE" && (
                <div className="text-center mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <img src={generateQRUrl(total)} className="w-32 mx-auto mb-2 mix-blend-multiply" alt="QR"/>
                    <p className="text-xs text-blue-600 font-medium">Quét mã để thanh toán nhanh</p>
                </div>
            )}
            <button onClick={handlePayment} className="w-full bg-[#174C34] text-white py-4 rounded-xl font-bold hover:bg-green-800 shadow-xl transition transform active:scale-95 text-lg">ĐẶT HÀNG NGAY • {total.toLocaleString()}₫</button>
          </div>
        </div>
      )}

      {isEditModalOpen && editingGroup && (
        <Datban 
            onClose={() => setIsEditModalOpen(false)}
            prefillData={{
                customerName: editingGroup.customerName,
                customerPhone: editingGroup.customerPhone,
                date: moment.utc(editingGroup.startTime).local().format('YYYY-MM-DD'),
                startTime: moment.utc(editingGroup.startTime).local().format('HH:mm'),
                endTime: moment.utc(editingGroup.endTime).local().format('HH:mm')
            }}
            onBookingSuccess={onEditSuccess}
        />
      )}

      {isNewBookingModalOpen && (
        <Datban 
            onClose={() => setIsNewBookingModalOpen(false)} 
            onBookingSuccess={onNewBookingSuccess}
            prefillData={{
                customerName: realUserName,
                customerPhone: realUserPhone 
            }}
        />
      )}
    </div>
  );
};

export default CartPage;