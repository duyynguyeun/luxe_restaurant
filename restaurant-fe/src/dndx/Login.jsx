import React from "react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-600 mb-6">
          Đăng nhập Nhà Hàng
        </h2>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Dawng nhapppppppp
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <a href="/Signup" className="text-red-600 hover:underline cursor-pointer">
            Đăng ký ngay luon de
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
