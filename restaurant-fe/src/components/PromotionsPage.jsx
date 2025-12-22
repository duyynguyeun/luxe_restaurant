import React, { useState, useEffect } from 'react';
import { FaGift, FaCalendarAlt, FaTag } from 'react-icons/fa';
import LoadingSpinner from '../Loading/LoadingSpinner';

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${API_URL}/api/promotion/getAll`);
        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
        }
      } catch (error) {
        console.error('Lỗi tải ưu đãi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGift className="text-4xl text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Ưu đãi đặc biệt</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá những chương trình ưu đãi hấp dẫn đang diễn ra tại Luxe Restaurant
          </p>
        </div>

        {/* Promotions Grid */}
        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <FaTag className="text-xs" />
                      ƯU ĐÃI
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {promo.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {promo.description}
                  </p>

                  {/* Date info if available */}
                  {promo.createdAt && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FaCalendarAlt />
                      <span>
                        {new Date(promo.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">
              Chưa có ưu đãi nào
            </h3>
            <p className="text-gray-500">
              Vui lòng quay lại sau để xem các chương trình ưu đãi mới nhất
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionsPage;