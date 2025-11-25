import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../giohang/CartContext";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Menu = () => {
  const { addToCart } = useContext(CartContext);
  
  // 1. State lưu trữ dữ liệu
  const [originalMenu, setOriginalMenu] = useState([]); // Lưu toàn bộ menu gốc (không bao giờ bị xóa khi tìm kiếm)
  const [groupedMenu, setGroupedMenu] = useState({});   // Lưu menu đã phân nhóm để hiển thị
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");     // Từ khóa tìm kiếm
  const [activeCategory, setActiveCategory] = useState("all");

  // 2. Lấy dữ liệu từ Server (CHỈ CHẠY 1 LẦN KHI VÀO TRANG)
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`);
        const data = await response.json();

        // Chỉ lấy món đang BẬT (Active)
        const activeDishes = data.filter(item => item.active === true);
        
        setOriginalMenu(activeDishes); // Lưu bản gốc
      } catch (error) {
        console.error("Lỗi tải menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, []);

  // 3. Xử lý Tìm kiếm & Gom nhóm (Chạy mỗi khi searchTerm hoặc originalMenu thay đổi)
  useEffect(() => {
    // a. Lọc món ăn theo từ khóa tìm kiếm
    const filtered = originalMenu.filter(dish => 
      dish.nameDish.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // b. Gom nhóm món ăn theo Danh mục
    const groups = {};
    filtered.forEach(dish => {
        const catName = dish.categoryName || "Khác"; 
        if (!groups[catName]) {
            groups[catName] = [];
        }
        groups[catName].push(dish);
    });

    setGroupedMenu(groups);
  }, [searchTerm, originalMenu]); // <--- Logic này giúp tìm kiếm siêu nhanh không cần gọi lại API

  // --- Hàm thêm vào giỏ (Giữ nguyên SweetAlert2 đẹp như bạn đã làm) ---
  const handleAddToCart = (item) => {
    Swal.fire({
      title: "Thêm vào giỏ?",
      text: `Bạn muốn thưởng thức "${item.nameDish}" chứ?`,
      imageUrl: item.urlImage,
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: item.nameDish,
      showCancelButton: true,
      confirmButtonColor: "#174C34",
      cancelButtonColor: "#d33",
      confirmButtonText: "Thêm ngay!",
      cancelButtonText: "Xem thêm",
      customClass: { popup: 'rounded-xl shadow-xl' }
    }).then((result) => {
      if (result.isConfirmed) {
        addToCart({
            id: item.id,
            ten: item.nameDish,
            gia: item.price,
            img: item.urlImage
        });
        toast.success(`Đã thêm ${item.nameDish} vào giỏ! 🛒`, { autoClose: 1500 });
      }
    });
  };

  const scrollToCategory = (catName) => {
    const element = document.getElementById(catName);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" }); // block center để nhìn rõ hơn
      setActiveCategory(catName);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#174C34]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* --- BANNER & TÌM KIẾM --- */}
      <div className="relative h-[350px] bg-cover bg-center flex flex-col items-center justify-center text-white"
           style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')" }}>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-wider drop-shadow-xl animate-fade-in-down">
          Thực Đơn Hảo Hạng
        </h1>
        
        {/* Ô TÌM KIẾM CHÍNH */}
        <div className="relative w-full max-w-xl px-4 group">
            <input 
              type="text" 
              placeholder="Bạn muốn ăn gì hôm nay?" 
              className="w-full py-4 pl-6 pr-14 rounded-full text-white-800 focus:outline-none shadow-2xl border-2 border-transparent focus:border-yellow-400 transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-[#174C34] p-2 rounded-full text-white shadow-md group-hover:scale-110 transition-transform duration-200">
                <FaSearch />
            </div>
        </div>
      </div>

      {/* --- THANH MENU DANH MỤC (STICKY) --- */}
      <div className="sticky top-[70px] z-30 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-8 py-4 whitespace-nowrap justify-center md:justify-start">
            {/* Nút hiển thị tất cả nếu đang tìm kiếm */}
            {Object.keys(groupedMenu).length === 0 && searchTerm !== "" && (
               <span className="text-gray-500 italic">Đang hiển thị kết quả cho "{searchTerm}"</span>
            )}

            {Object.keys(groupedMenu).map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`text-sm font-bold uppercase tracking-widest transition-all duration-300 px-2 py-1 rounded-md ${
                  activeCategory === cat 
                    ? "text-[#174C34] border-b-2 border-[#174C34] bg-green-50" 
                    : "text-gray-500 hover:text-[#174C34] hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH MÓN ĂN --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {Object.keys(groupedMenu).length === 0 ? (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🍲</div>
                <p className="text-gray-500 text-xl">Không tìm thấy món nào có tên "{searchTerm}".</p>
                <button onClick={() => setSearchTerm("")} className="mt-4 text-[#174C34] font-bold hover:underline">Xem tất cả menu</button>
            </div>
        ) : (
            Object.keys(groupedMenu).map((categoryName) => (
                <div key={categoryName} id={categoryName} className="mb-16 scroll-mt-40">
                    {/* Tiêu đề nhóm đẹp hơn */}
                    <div className="flex items-center mb-8">
                        <span className="w-1.5 h-8 bg-yellow-500 mr-4 rounded-full"></span>
                        <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
                            {categoryName}
                        </h2>
                    </div>

                    {/* Grid Món ăn */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {groupedMenu[categoryName].map((mon) => (
                            <div key={mon.id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
                                {/* Ảnh */}
                                <div className="relative h-56 overflow-hidden">
                                    <img 
                                        src={mon.urlImage || "https://via.placeholder.com/300"} 
                                        alt={mon.nameDish} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Nút thêm nhanh */}
                                    <button 
                                        onClick={() => handleAddToCart(mon)}
                                        className="absolute bottom-4 right-4 bg-white text-[#174C34] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#174C34] hover:text-white z-10"
                                        title="Thêm vào giỏ"
                                    >
                                        <FaShoppingCart size={18} />
                                    </button>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                
                                {/* Thông tin */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1 group-hover:text-[#174C34] transition-colors">
                                        {mon.nameDish}
                                    </h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                                        {mon.des || "Hương vị tuyệt hảo, nguyên liệu tươi ngon."}
                                    </p>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                        <span className="text-xl font-extrabold text-yellow-600">
                                            {mon.price?.toLocaleString()}₫
                                        </span>
                                        <button 
                                            onClick={() => handleAddToCart(mon)}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-[#174C34] hover:text-white transition-colors"
                                        >
                                            Chọn món
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Menu;