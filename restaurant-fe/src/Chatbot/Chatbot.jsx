import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaPaperPlane, FaTimes, FaRobot } from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOtherOpen, setIsOtherOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Chào bạn! Tôi có thể giúp gì?' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Lắng nghe sự kiện để không bị đè với ChatWidget
  useEffect(() => {
    const handleClose = () => setIsOpen(false);
    const handleOtherState = (e) => setIsOtherOpen(e.detail);

    window.addEventListener('CLOSE_CHATBOT', handleClose);
    window.addEventListener('CHAT_WIDGET_STATE', handleOtherState);

    return () => {
      window.removeEventListener('CLOSE_CHATBOT', handleClose);
      window.removeEventListener('CHAT_WIDGET_STATE', handleOtherState);
    };
  }, []);

  // Auto scroll khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleOpen = () => {
    if (!isOpen) {
      // Đóng ChatWidget khi mở Luxe AI
      window.dispatchEvent(new CustomEvent('CLOSE_CHAT_WIDGET'));
    }
    const nextState = !isOpen;
    setIsOpen(nextState);
    window.dispatchEvent(new CustomEvent('CHATBOT_STATE', { detail: nextState }));
  };

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const userMessage = { sender: 'user', text: newMessage };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const API_URL = `${import.meta.env.VITE_API_URL}/api/chatbot`;
      const requestBody = { question: newMessage };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const botText = await response.text();
      const botMessage = { sender: 'bot', text: botText };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error('Lỗi khi gọi API chatbot:', error);
      const errorMessage = { 
        sender: 'bot', 
        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.' 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Cửa sổ chat Luxe AI */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#174C34] via-[#1f6646] to-teal-700 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FaRobot className="text-xl text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Luxe AI</h3>
                <p className="text-xs text-white/80">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className="bg-white/20 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              title="Đóng"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-[#174C34] to-teal-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <FaRobot className="text-amber-300 text-sm" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#174C34] to-teal-700 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4 animate-fade-in">
                <div className="w-8 h-8 bg-gradient-to-br from-[#174C34] to-teal-600 rounded-full flex items-center justify-center mr-2">
                  <FaRobot className="text-amber-300 text-sm" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <input
                type="text"
                className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-800 text-sm"
                placeholder="Nhập tin nhắn..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || newMessage.trim() === ''}
                className="bg-gradient-to-r from-[#174C34] to-teal-700 text-white p-3 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nút bong bóng chatbot Luxe AI - Chỉ hiển thị khi KHÔNG có cửa sổ chat nào đang mở */}
      {!isOpen && !isOtherOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-20 right-6 bg-gradient-to-br from-teal-600 via-emerald-600 to-[#174C34] text-white w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-xl z-40 hover:scale-110 transition-all duration-300 border-2 border-white/60 cursor-pointer"
          title="Trợ lý ảo Luxe AI"
        >
          <FaRobot />
        </button>
      )}

      {/* CSS Animation */}
      <style>
        {`
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          .animate-slide-up {
            animation: slide-up 0.3s ease-out;
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default Chatbot;
