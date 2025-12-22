import React, { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { FaComments, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageProvider';

const WS_ENDPOINT = 'http://localhost:8080/ws';
const SUBSCRIBE_TOPIC = '/topic/public';
const SEND_DEST = '/app/chat';

const ChatWidget = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const clientRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // create STOMP client with SockJS
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      debug: function () {}
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(SUBSCRIBE_TOPIC, (msg) => {
        try {
          const body = JSON.parse(msg.body);
          setMessages((prev) => [...prev, body]);
        } catch (e) {
          console.error('Invalid message body', e);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };

    stompClient.activate();
    clientRef.current = stompClient;

    return () => {
      try {
        stompClient.deactivate();
      } catch (e) {}
      clientRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = {
      sender: currentUser ? currentUser.username : 'Guest',
      content: text.trim()
    };
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({ destination: SEND_DEST, body: JSON.stringify(msg) });
      setText('');
    } else {
      // fallback: append locally
      setMessages((prev) => [...prev, { ...msg, timestamp: new Date().toISOString() }]);
      setText('');
    }
  };

  return (
    <div>
      {/* floating button */}
      <div className="fixed bottom-4 right-6 z-50">
        <div className="flex items-end flex-col-reverse gap-2">
          {open && (
            <div className="w-80 md:w-96 bg-white shadow-2xl rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-[#174C34] text-white">
                <div className="flex items-center gap-2 font-semibold">
                  <FaComments />
                  <span>Chat</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-white/20"><FaTimes /></button>
              </div>

              <div ref={scrollRef} className="h-64 overflow-y-auto p-3 space-y-3 bg-gray-50">
                {messages.length === 0 && <div className="text-center text-sm text-gray-400">{t ? t('no_data') : 'No messages yet'}</div>}
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === (currentUser && currentUser.username) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-lg ${m.sender === (currentUser && currentUser.username) ? 'bg-[#dcfce7] text-gray-900' : 'bg-white text-gray-800'} shadow`}> 
                      <div className="text-xs text-gray-500 font-medium mb-1">{m.sender}</div>
                      <div className="text-sm">{m.content}</div>
                      <div className="text-[10px] text-gray-400 mt-1 text-right">{m.timestamp ? new Date(m.timestamp).toLocaleTimeString() : ''}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
                    className="flex-1 px-3 py-2 rounded-lg border focus:outline-none"
                    placeholder={t ? 'Type a message...' : 'Type a message...'}
                  />
                  <button onClick={sendMessage} className="bg-[#174C34] text-white px-4 py-2 rounded-lg">Send</button>
                </div>
              </div>
            </div>
          )}

          <button onClick={() => setOpen((v) => !v)} className="w-14 h-14 rounded-full bg-amber-400 text-[#174C34] flex items-center justify-center shadow-lg hover:scale-105 transition">
            <FaComments />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
