import React, { useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { FaQuestion } from 'react-icons/fa';

const OnboardingTour = () => {
  const [run, setRun] = useState(false);

  // Cấu hình các bước (Steps) dựa trên kịch bản của bạn
  const steps = [
    {
      target: 'body', // Hiện ở giữa màn hình
      content: (
        <div className="text-center">
          <h3 className="font-bold text-xl text-[#174C34] mb-2">Chào mừng đến với Luxe Restaurant! 🎉</h3>
          <p>Hãy để chúng tôi giới thiệu sơ qua về các tính năng trên website để bạn có trải nghiệm tốt nhất.</p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.tour-home',
      content: 'Đây là Trang chủ, nơi bạn có thể xem các thông tin nổi bật và không gian nhà hàng.',
    },
    {
      target: '.tour-menu',
      content: 'Khám phá Menu thực đơn đa dạng với các món ăn Á - Âu đẳng cấp thượng lưu.',
    },
    {
      target: '.tour-booking',
      content: 'Bạn muốn đặt chỗ trước? Hãy nhấn vào đây để Đặt bàn nhanh chóng.',
    },
    {
      target: '.tour-auth',
      content: 'Khu vực Đăng ký & Đăng nhập thành viên để tích điểm và nhận ưu đãi riêng.',
    },
    {
      target: '.tour-cart',
      content: 'Giỏ hàng của bạn. Sau khi chọn món, các món ăn hoặc bàn đã đặt sẽ xuất hiện tại đây để bạn thanh toán.',
    },
    {
      target: '.tour-orders',
      content: 'Tại đây sẽ hiển thị lịch sử các Đơn hàng và Bàn mà bạn đã đặt/thanh toán thành công.',
    },
    {
      target: '.tour-chatbot',
      content: 'Nếu cần hỗ trợ gấp, hãy chat ngay với "Luxe AI" thông minh của chúng tôi tại đây!',
    },
  ];

  // Xử lý khi tour kết thúc hoặc bị bỏ qua
  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  return (
    <>
      {/* Component Joyride quản lý tour */}
      <Joyride
        steps={steps}
        run={run}
        continuous={true} // Tự động chuyển bước tiếp theo
        showSkipButton={true} // Hiện nút bỏ qua
        showProgress={true} // Hiện tiến trình (1/8)
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000, // Đảm bảo nổi lên trên cùng
            primaryColor: '#174C34', // Màu xanh chủ đạo của nhà hàng
            textColor: '#333',
          },
          buttonNext: {
            backgroundColor: '#174C34',
            color: '#fff',
            fontWeight: 'bold',
          },
          buttonBack: {
            color: '#174C34',
          },
        }}
        locale={{
            back: 'Quay lại',
            close: 'Đóng',
            last: 'Hoàn tất',
            next: 'Tiếp theo',
            skip: 'Bỏ qua',
        }}
      />

      {/* Nút dấu hỏi kích hoạt tour */}
      <button
        onClick={() => setRun(true)}
        className="fixed bottom-24 left-6 z-50 w-12 h-12 bg-yellow-500 text-[#174C34] rounded-full shadow-xl flex items-center justify-center text-xl hover:bg-yellow-400 hover:scale-110 transition-all cursor-pointer animate-bounce-slow"
        title="Hướng dẫn sử dụng"
      >
        <FaQuestion />
      </button>
    </>
  );
};

export default OnboardingTour;