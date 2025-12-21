import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Nếu backend dùng route khác, sửa lại ở đây:
const API_URL = 'http://localhost:8080/api/orders/top-dishes';

import { useLanguage } from '../i18n/LanguageProvider';

const AdminManageReportDish = () => {
    const [stats, setStats] = useState([]);
    const [filterType, setFilterType] = useState('day'); // 'day', 'week', 'month'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { t } = useLanguage();

    useEffect(() => {
        fetchDishStats();
    }, [filterType, selectedDate]);

    const fetchDishStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL, {
                params: {
                    type: filterType,
                    date: selectedDate
                }
            });
            setStats(response.data);
        } catch (err) {
            console.error("Lỗi khi tải báo cáo:", err);
            setError("Không thể tải dữ liệu báo cáo. Vui lòng kiểm tra kết nối Backend.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="p-6 bg-gray-50 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">{t('report_title')}</h2>
                
                <div className="flex gap-3 bg-white p-2 rounded shadow-sm">
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                        <option value="day">Theo Ngày</option>
                        <option value="week">Theo Tuần</option>
                        <option value="month">Theo Tháng</option>
                    </select>
                    
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
                    />
                </div>
            </div>

            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div className="bg-white p-6 rounded-lg shadow-md h-[500px]">
                        <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">{t('chart_title')}</h3>
                        {stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart
                                    data={stats}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis 
                                        dataKey="dishName" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        interval={0} 
                                        height={80}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name) => [
                                            value,
                                            name === 'totalQuantity' ? 'Số lượng' : name
                                        ]}
                                        labelStyle={{ color: '#333' }}
                                    />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar
                                        dataKey="totalQuantity"
                                        name="Số lượng bán"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <p>Chưa có dữ liệu bán hàng trong thời gian này</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col h-[500px]">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">{t('details_title')}</h3>
                        <div className="overflow-x-auto flex-1 overflow-y-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_dish')}</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_category')}</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_qty')}</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">{t('table_revenue')}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {stats.map((item, index) => (
                                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-150">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.dishName}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {item.categoryName || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                                                {item.totalQuantity}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-bold text-right">
                                                {formatCurrency(item.totalRevenue)}
                                            </td>
                                        </tr>
                                    ))}
                                    {stats.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="text-center py-10 text-gray-500">
                                                {t('no_data_table')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {stats.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm font-medium">
                                <span>{t('total_items')} {stats.length}</span>
                                <span className="text-green-700 text-lg">
                                    {t('total_revenue_label')} {formatCurrency(stats.reduce((sum, item) => sum + (item.totalRevenue || 0), 0))} 
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManageReportDish;
