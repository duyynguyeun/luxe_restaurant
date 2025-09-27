import React from "react";
import { useState } from "react";


const Banner = ({onClose}) => {
  // const [date, setDate] = useState("");
  const [Soluong,  setSoluong] = useState(1)
  const giam = () =>{
      if(soluong > 1) setSoluong(soluong -1);
  };

  const tang = () =>{
      setSoluong = soluong + 1;
  }; 
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative space-x-4 max-h-full overflow-y-auto">
        <div className="space-y-3">
          <h2 className="font-bold text-3xl">Đặt bàn</h2>
          <div className="py-2">Thông tin của bạn</div>
          <input type="text" placeholder = "Nhập tên của bạn..." className="w-full border border-gray-300 px-2 py-2 rounded-lg" />
          <input type="text" placeholder = "Nhập số điện thoại của bạn..." className="py-2 w-full border border-gray-300 px-2 rounded-lg " />
          <div>Thông tin bàn</div>
          <div className="space-y-3">
            <div className="">Ngày đặt</div>
            <input
              type="date"
              // value={date}
              // onChange={(e) => setDate(e.target.value)}
              className="border rounded px-3 py-2"
            />
            <div>Số lượng</div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setSoluong(Math.max(1, Soluong - 1))}
                className="bg-gray-200 px-4 py-1 rounded text-lg font-bold cursor-pointer"
              >
                -
              </button>
              <span className="text-xl font-semibold px-4">{Soluong}</span>
              <button
                type="button"
                onClick = {() => setSoluong(Soluong + 1)}
                className="bg-gray-200 px-3 py-1 rounded text-lg font-bold cursor-pointer"
              >
                +
              </button>
            </div>
            <div>Giờ đến</div>
            <input type="time"
              className="border rounded px-3 py-2 "
            />

            <div>Chọn ưu đãi</div>
            <div>
              <select name="Chọn ưu đãi" id="" className="w-full px-3 py-2 border rounded cursor-pointer ">
                <option value="">-- Chọn ưu đãi --</option>
                <option value="">Ưu đãi sinh nhật 15% hóa đơn</option>
                <option value="">Có mã ưu đãi riêng </option>
                <option value="">Đầy tiền, không cần ưu đãi</option>
              </select>
            </div>

            <div className="">
              <textarea placeholder="Ghi chú..." className="w-full h-25 border rounded px-2 py-2 "
              
              ></textarea>
            </div>
            <div className="flex justify-between">
              <button onClick={onClose}
                className="w-33 h-10 font-medium bg-amber-400  rounded-3xl cursor-pointer hover:bg-green-800 hover:text-amber-400"

              >
                Đóng
              </button>
              <button type="submit" className="w-33 h-10 font-medium bg-amber-400  rounded-3xl cursor-pointer hover:bg-green-800 hover:text-amber-400">
                ĐẶT BÀN NGAY
              </button>
            </div>
          </div>
         
        </div>
        

      </div>
      

    </div>
  );
};

export default Banner;
