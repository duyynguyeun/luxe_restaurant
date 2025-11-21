import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../giohang/CartContext";
import { FaShoppingCart, FaSearch } from "react-icons/fa";

const Menu = () => {
  const { addToCart } = useContext(CartContext);
  
  const [groupedMenu, setGroupedMenu] = useState({}); 
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all"); // Để highlight menu

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dish/getall`);
        const data = await response.json();

        // 1. Lọc món đang BẬT
        const activeDishes = data.filter(item => item.active === true);
        
        // 2. Lọc theo tìm kiếm
        const filteredDishes = activeDishes.filter(item => 
             item.nameDish.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // 3. Gom nhóm theo Danh mục
        const groups = {};
        filteredDishes.forEach(dish => {
            const catName = dish.categoryName || "Khác"; 
            if (!groups[catName]) {
                groups[catName] = [];
            }
            groups[catName].push(dish);
        });

        setGroupedMenu(groups);
      } catch (error) {
        console.error("Lỗi tải menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, [searchTerm]);

  const handleAddToCart = (item) => {
    addToCart({
        id: item.id,
        ten: item.nameDish,
        gia: item.price,
        img: item.urlImage
    });
    // alert("Đã thêm vào giỏ!");
  };

  const scrollToCategory = (catName) => {
    const element = document.getElementById(catName);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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
      
      {/* --- BANNER --- */}
      <div className="relative h-[300px] bg-cover bg-center flex flex-col items-center justify-center text-white"
           style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')" }}>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider drop-shadow-lg">
          Thực Đơn Hảo Hạng
        </h1>
        <div className="relative w-full max-w-lg px-4">
            <input 
              type="text" 
              placeholder="Bạn muốn tìm món gì?..." 
              className="w-full py-3 pl-5 pr-12 rounded-full text-gray-800 focus:outline-none shadow-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-8 top-3.5 text-gray-400 text-xl" />
        </div>
      </div>

      {/* --- THANH MENU DANH MỤC (STICKY) --- */}
      <div className="sticky top-[70px] z-30 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-6 py-4 whitespace-nowrap">
            {Object.keys(groupedMenu).map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`text-sm font-bold uppercase tracking-wide transition-colors ${
                  activeCategory === cat 
                    ? "text-[#174C34] border-b-2 border-[#174C34]" 
                    : "text-gray-500 hover:text-[#174C34]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- DANH SÁCH MÓN ĂN --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {Object.keys(groupedMenu).length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-lg">Không tìm thấy món ăn nào.</div>
        ) : (
            Object.keys(groupedMenu).map((categoryName) => (
                <div key={categoryName} id={categoryName} className="mb-16 scroll-mt-32">
                    {/* Tiêu đề nhóm */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                        <span className="w-2 h-8 bg-yellow-500 mr-3 rounded-full"></span>
                        {categoryName}
                    </h2>

                    {/* Grid Món ăn */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {groupedMenu[categoryName].map((mon) => (
                            <div key={mon.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
                                {/* Ảnh */}
                                <div className="relative h-48 overflow-hidden">
                                    <img 
                                        src={mon.urlImage || "https://via.placeholder.com/300"} 
                                        alt={mon.nameDish} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Nút thêm nhanh */}
                                    <button 
                                        onClick={() => handleAddToCart(mon)}
                                        className="absolute bottom-3 right-3 bg-white text-[#174C34] p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#174C34] hover:text-white"
                                        title="Thêm vào giỏ"
                                    >
                                        <FaShoppingCart />
                                    </button>
                                </div>
                                
                                {/* Thông tin */}
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 group-hover:text-[#174C34] transition-colors">
                                        {mon.nameDish}
                                    </h3>
                                    <div className="flex justify-between items-end mt-4 border-t pt-3 border-gray-100">
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold uppercase">Giá</p>
                                            <span className="text-xl font-extrabold text-yellow-600">
                                                {mon.price?.toLocaleString()}₫
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleAddToCart(mon)}
                                            className="text-sm font-semibold text-[#174C34] hover:underline"
                                        >
                                            Chi tiết
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