import React from 'react'

const Signup = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 '>
      <div className= 'bg-white p-8 rounded-2xl shadow-lg w-full max-w-md'>
        <h2 className='font-bold text-2xl text-black text-center' >Đăng kí</h2>
        <form className='space-y-5'>
          <div>
            <label className='block text-gray-700 mb-1'>Email</label>
              <input type="email" placeholder='Nhập email của bạn...' className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none' />
            
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Số điện thoại</label>
              <input type="text" placeholder='Nhập số điện thoại của bạn...' className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none' />
            
          </div>
          <div>
            <label className='block text-gray-700 mb-1'>Tên đăng nhập</label>
              <input type="email" placeholder='Nhập tên đăng nhập của bạn...' className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none' />
            
          </div>
          <div>
            <label className='block text-gray-700 mb-1-5'>Mật khẩu</label>
              <input type="password" placeholder='Nhập mật khẩu của bạn...' className='w-full border border-gray-300 px-2 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none' />
            
          </div>
        </form>
        <br />
        <button
            type="submit"
            className="w-full bg-gray-500 text-white py-2 rounded-lg transition cursor-pointer"
          >
            <a href="/Login">Đăng kí</a>
        </button>

      </div>

    </div>
  )
}

export default Signup

