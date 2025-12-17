import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { FaQuestion, FaChevronRight, FaChevronLeft, FaTimes, FaCheck } from 'react-icons/fa';

// Tạo component nút bấm tùy chỉnh cho đẹp mắt
const CustomButton = ({ children, onClick, variant = 'primary', icon: Icon, ...props }) => {
    const baseStyle = "px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5";
    const variants = {
        primary: "bg-gradient-to-r from-[#174C34] to-[#0f3d2a] text-white hover:from-[#1e5e41] hover:to-[#174C34]", // Xanh đậm sang trọng
        secondary: "bg-white text-[#174C34] border-2 border-[#174C34] hover:bg-[#174C34] hover:text-white", // Viền xanh
        accent: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-[#174C34] hover:from-yellow-400 hover:to-yellow-500", // Vàng nổi bật
        text: "text-gray-500 hover:text-[#174C34] bg-transparent shadow-none hover:shadow-none hover:underline", // Nút Skip
    };
  
    return (
      <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`} {...props}>
        {children}
        {Icon && <Icon size={14} />}
      </button>
    );
  };

const OnboardingTour = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: 'body',
      content: (
        <div className="text-center px-2">
          <div className="mb-4 flex justify-center">
             {/* Icon chào mừng (ví dụ: logo hoặc icon vương miện) */}
            <div className="w-16 h-16 bg-[#174C34]/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🎉</span>
            </div>
          </div>
          <h3 className="font-extrabold text-2xl text-[#174C34] mb-3 leading-tight">Chào mừng đến với <br/> Luxe Restaurant!</h3>
          <p className="text-gray-600 text-base leading-relaxed">Hành trình ẩm thực thượng lưu bắt đầu từ đây. Hãy để chúng tôi giới thiệu nhanh các tính năng trên website để bạn có trải nghiệm tuyệt vời nhất.</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.tour-home',
      title: <span className="flex items-center gap-2 text-[#174C34]"><span className='text-xl'>🏠</span> Trang chủ</span>,
      content: 'Cửa sổ chính để khám phá không gian sang trọng, các sự kiện đặc biệt và những món ăn "best-seller" tại nhà hàng.',
    },
    {
      target: '.tour-menu',
      title: <span className="flex items-center gap-2 text-[#174C34]"><span className='text-xl'>🍽️</span> Thực đơn đẳng cấp</span>,
      content: 'Khám phá tinh hoa ẩm thực Á - Âu với thực đơn đa dạng được chế biến bởi các đầu bếp hàng đầu.',
    },
    {
      target: '.tour-booking',
      title: <span className="flex items-center gap-2 text-yellow-600"><span className='text-xl'>📅</span> Đặt bàn nhanh</span>,
      content: 'Đừng bỏ lỡ vị trí đẹp nhất! Nhấn vào đây để đặt bàn trước chỉ trong vài giây.',
    },
    {
      target: '.tour-auth',
      title: <span className="flex items-center gap-2 text-[#174C34]"><span className='text-xl'>👤</span> Tài khoản thành viên</span>,
      content: 'Đăng ký hoặc Đăng nhập để quản lý thông tin, tích điểm thưởng và nhận những ưu đãi độc quyền chỉ dành cho thành viên Luxe.',
    },
    {
      target: '.tour-cart',
      title: <span className="flex items-center gap-2 text-[#174C34]"><span className='text-xl'>🛒</span> Giỏ hàng của bạn</span>,
      content: 'Xem lại các món ăn đã chọn hoặc bàn đã đặt. Bạn có thể điều chỉnh số lượng và tiến hành thanh toán tại đây.',
    },
    {
      target: '.tour-orders',
      title: <span className="flex items-center gap-2 text-[#174C34]"><span className='text-xl'>📜</span> Lịch sử đơn hàng</span>,
      content: 'Theo dõi trạng thái các đơn đặt món và lịch sử đặt bàn của bạn một cách dễ dàng.',
    },
    {
      target: '.tour-chatbot',
      title: <span className="flex items-center gap-2 text-[#174C34]"><span className='text-xl'>🤖</span> Trợ lý ảo Luxe AI</span>,
      content: 'Bạn có câu hỏi cần giải đáp ngay? Hãy chat với trợ lý ảo thông minh của chúng tôi ở góc màn hình, hỗ trợ 24/7.',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        callback={handleJoyrideCallback}
        // TẮT CÁC NÚT MẶC ĐỊNH ĐỂ DÙNG NÚT TÙY CHỈNH
        floaterProps={{
            hideCloseButton: true, // Ẩn nút X mặc định
        }}
        
        // CẤU HÌNH STYLE GIAO DIỆN
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#174C34',
            // Màu lớp phủ (overlay) sang trọng hơn
            overlayColor: 'rgba(23, 76, 52, 0.6)', 
            textColor: '#333',
            width: 400, // Tăng chiều rộng hộp thoại
          },
          // Style cho hộp thoại (Tooltip)
          tooltip: {
            borderRadius: '20px', // Bo tròn mềm mại
            boxShadow: '0 10px 30px -10px rgba(23, 76, 52, 0.5)', // Đổ bóng sang trọng
            padding: '24px',
          },
          // Style cho vùng chứa nội dung
          tooltipContent: {
            padding: '10px 0 20px 0',
            fontSize: '15px',
            lineHeight: '1.6',
          },
          // Style cho tiêu đề (nếu có)
          tooltipTitle: {
            fontSize: '18px',
            fontWeight: '800',
            marginBottom: '8px',
          },
          // Ẩn footer mặc định vì ta sẽ dùng component tùy chỉnh
           footer: {
             display: 'none',
           }
        }}

        // TÙY CHỈNH HOÀN TOÀN PHẦN FOOTER CHỨA NÚT BẤM
        tooltipComponent={({
            continuous,
            index,
            isLastStep,
            step,
            backProps,
            primaryProps,
            skipProps,
            tooltipProps,
          }) => (
            <div {...tooltipProps} className="bg-white rounded-[20px] shadow-2xl p-6 max-w-md mx-auto border border-[#174C34]/10">
                {/* Nút đóng (X) thủ công ở góc */}
                 <button 
                    onClick={() => setRun(false)} 
                    className='absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1'
                >
                    <FaTimes />
                </button>

               {/* Phần nội dung và tiêu đề */}
               <div className="mb-6">
                   {step.title && <h4 className="text-xl font-extrabold mb-3">{step.title}</h4>}
                   <div className='text-gray-600 leading-relaxed text-[15px]'>{step.content}</div>
               </div>

               {/* Phần chân trang chứa nút bấm */}
               <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Nút Bỏ qua (Skip) - Chỉ hiện nếu chưa phải bước cuối */}
                    <div className="w-1/4">
                        {!isLastStep && (
                             <CustomButton {...skipProps} variant="text">
                                Bỏ qua
                             </CustomButton>
                        )}
                    </div>

                    {/* Nút Quay lại và Tiếp theo/Hoàn tất */}
                    <div className="flex items-center gap-3">
                         {index > 0 && (
                            <CustomButton {...backProps} variant="secondary" icon={FaChevronLeft}>
                                Trước
                            </CustomButton>
                        )}
                        
                        <CustomButton {...primaryProps} variant={isLastStep ? "accent" : "primary"} icon={isLastStep ? FaCheck : FaChevronRight}>
                            {isLastStep ? 'Hoàn tất' : 'Tiếp theo'}
                        </CustomButton>
                    </div>
               </div>
               
                {/* Hiển thị tiến trình dạng chấm hoặc số */}
                <div className="flex justify-center mt-4 gap-1.5">
                    {steps.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-[#174C34]' : 'w-1.5 bg-gray-300'}`}
                        ></div>
                    ))}
                </div>

            </div>
        )}
      />

      {/* Nút dấu hỏi kích hoạt tour (Giữ nguyên hoặc chỉnh sửa thêm) */}
      <button
        onClick={() => setRun(true)}
        className="fixed bottom-24 left-6 z-50 w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 text-[#174C34] rounded-full shadow-[0_8px_20px_-5px_rgba(234,179,8,0.5)] flex items-center justify-center text-2xl hover:scale-110 transition-all cursor-pointer animate-bounce-slow border-2 border-white/50"
        title="Hướng dẫn sử dụng"
      >
        <FaQuestion className="filter drop-shadow-sm" />
      </button>
    </>
  );
};

export default OnboardingTour;