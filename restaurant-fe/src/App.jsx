import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
// 1. IMPORT LAZY VÀ SUSPENSE ĐỂ TẠO HIỆU ỨNG LOADING
import { Suspense, lazy } from "react";

// 2. IMPORT CÁC PROVIDER
import { CartProvider } from "./giohang/CartContext"; 
import { AuthProvider } from "./context/AuthContext"; // Provider cho Đăng nhập

// 3. IMPORT CÁC COMPONENT LAYOUT
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./Loading/LoadingSpinner"; // Đường dẫn file loading của bạn

// 4. "LAZY LOAD" (TẢI LƯỜI) CÁC TRANG CỦA USER
const Banner = lazy(() => import('./components/Banner'));
const FeaturedMenu = lazy(() => import('./components/FeaturedMenu'));
const Menu = lazy(() => import('./components/Menu'));
const CartPage = lazy(() => import('./giohang/CartPage'));
const Login = lazy(() => import('./dndx/Login'));
const Signup = lazy(() => import('./dndx/Signup'));
const ProfilePage = lazy(() => import('./dndx/ProfilePage')); // Trang Profile
const ContactPage = lazy(() => import('./Lienhe/ContactPage'));


// 5. (MỚI) LAZY LOAD CÁC TRANG ADMIN
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminManageMenu = lazy(() => import('./admin/AdminManageMenu'));


// 6. TẠO CÁC LAYOUT ĐỂ TRÁNH LẶP CODE
// Layout chính: Có Header và Footer
const MainLayout = () => (
  <>
    <Header />
    <Outlet /> {/* Nơi các trang con (HomePage, MenuPage...) sẽ render */}
    <Footer />
  </>
);

// Layout Đăng nhập/Giỏ hàng: Chỉ có Header (không có Footer)
const AuthLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

function App() {
  return (
    // 7. BỌC CẢ 2 PROVIDER
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* 8. BỌC SUSPENSE ĐỂ HIỂN THỊ HIỆU ỨNG LOADING */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              
              {/* Nhóm 1: Các trang ADMIN (dùng AdminLayout) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="menu" element={<AdminManageMenu />} />
              </Route>

              {/* Nhóm 2: Các trang USER (dùng MainLayout) */}
              <Route element={<MainLayout />}>
                <Route
                  path="/"
                  element={
                    <>
                      <Banner />
                      <FeaturedMenu/>
                    </>
                  }
                />
                <Route
                  path="/menu"
                  element={
                    <>
                      <Menu title={'Món Á'}/>
                      <Menu title={'Món Âu'}/>
                      <Menu title={"Rau Xanh"}/>
                      <Menu title={"Đồ uống"}/>
                      <Menu title={"Đồ nướng"}/>
                    </>
                  }
                />
                <Route path="/ContactPage" element={<ContactPage/>} />
                <Route path="/banner" element={<Banner />} />
                <Route path="/profile" element={<ProfilePage />} /> {/* Thêm route Profile */}
              </Route>
              
              {/* Nhóm 3: Các trang USER (dùng AuthLayout) */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<CartPage />} />
              </Route>
              
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

