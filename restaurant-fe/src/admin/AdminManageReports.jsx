import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaTrash, FaEnvelopeOpenText, FaUser, FaClock, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import moment from 'moment';

const API_URL = import.meta.env.VITE_API_URL;

const AdminManageReports = () => {
  const [reports, setReports] = useState([]);
  const { currentUser } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null); // Để xem chi tiết

  // 1. Tải danh sách Report
  const fetchReports = async () => {
    try {
      const res = await fetch(`${API_URL}/api/report/getAll`, {
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Sắp xếp mới nhất lên đầu
        setReports(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchReports(); }, []);

  // 2. Xóa Report
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa phản hồi này?")) return;
    try {
      
      const res = await fetch(`${API_URL}/api/report/delete?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      if (res.ok) {
        toast.success("Đã xóa.");
        fetchReports();
        setSelectedReport(null);
      } else {
        toast.error("Lỗi khi xóa.");
      }
    } catch (error) { toast.error("Lỗi kết nối."); }
  };

  // Helper: Phân tích nội dung text (vì ta sẽ lưu gộp nhiều trường vào text)
  const parseContent = (text) => {
    // Nếu text lưu dạng JSON hoặc chuỗi có định dạng, ta hiển thị nguyên văn
    // Ở đây ta hiển thị text gốc, dùng CSS để xuống dòng
    return <div className="whitespace-pre-wrap">{text}</div>;
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg h-[85vh] flex flex-col">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <FaEnvelopeOpenText className="text-[#174C34]" /> Quản lý Phản hồi & Góp ý
      </h2>

      <div className="flex gap-6 flex-1 overflow-hidden">
        
        {/* DANH SÁCH BÊN TRÁI */}
        <div className="w-1/3 overflow-y-auto border-r pr-4 custom-scrollbar">
          {reports.length === 0 ? (
            <p className="text-gray-500 italic text-center mt-10">Chưa có phản hồi nào.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((rpt) => (
                <div 
                  key={rpt.id}
                  onClick={() => setSelectedReport(rpt)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedReport?.id === rpt.id ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-gray-400">#{rpt.id}</span>
                    <span className="text-xs text-gray-500">{moment(rpt.date).format("DD/MM HH:mm")}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 line-clamp-1 mb-1">
                    {rpt.user?.userName || "Khách hàng"}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {rpt.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CHI TIẾT BÊN PHẢI */}
        <div className="w-2/3 pl-4 flex flex-col">
          {selectedReport ? (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full flex flex-col relative animate-fade-in">
              <button 
                onClick={() => setSelectedReport(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden"
              >
                <FaTimes />
              </button>

              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <div className="w-12 h-12 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xl font-bold">
                  {(selectedReport.user?.userName?.charAt(0) || "U").toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedReport.user?.userName}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaClock /> {moment(selectedReport.date).format("DD/MM/YYYY - HH:mm:ss")}
                  </p>
                </div>
                <button 
                    onClick={() => handleDelete(selectedReport.id)}
                    className="ml-auto bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 font-bold flex items-center gap-2 transition"
                >
                    <FaTrash /> Xóa
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg border border-gray-100 shadow-inner">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {selectedReport.text}
                </p>
                {selectedReport.imageUrl && (
                    <div className="mt-4">
                        <p className="text-sm font-bold text-gray-500 mb-2">Ảnh đính kèm:</p>
                        <img src={selectedReport.imageUrl} alt="Attachment" className="max-w-xs rounded-lg border shadow-sm" />
                    </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              <FaEnvelopeOpenText size={64} className="mb-4 opacity-50" />
              <p className="text-lg">Chọn một phản hồi để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageReports;