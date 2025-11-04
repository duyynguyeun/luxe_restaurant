import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ➕ Thêm món vào giỏ
  const addToCart = (mon) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.ten === mon.ten);
      if (exist) {
        // Nếu món đã có, tăng số lượng
        return prev.map((item) =>
          item.ten === mon.ten
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Nếu món mới, thêm vào giỏ
        return [...prev, { ...mon, quantity: 1 }];
      }
    });
  };

  // ➖ Giảm số lượng
  const decreaseItem = (ten) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.ten === ten
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // xoá nếu về 0
    );
  };

  // ❌ Xoá hoàn toàn món
  const removeFromCart = (ten) => {
    setCart((prev) => prev.filter((item) => item.ten !== ten));
  };

  // 💰 Tổng tiền
  const total = cart.reduce(
    (sum, item) => sum + item.gia * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, decreaseItem, removeFromCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};
