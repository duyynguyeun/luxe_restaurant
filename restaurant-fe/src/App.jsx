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
    
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Banner />
              <FeaturedMenu/>
              <Footer/>
              
              
            </>
          }
        />

        {/* Trang Banner riêng */}
        <Route
          path="/banner"
          element={
            <>
              <Header />
              <Banner />
            </>
          }
        />

        {/* Trang đăng nhập */}
        <Route
          path="/login"
          element={
            <>
              <Header />
              <Login />
              
            </>
          }
        />

        {/* Trang đăng ký */}
        <Route
          path="/signup"
          element={
            <>
              <Header />
              <Signup />
            </>
          }
        />
        <Route
          path="/menu"
          element={
            <>
              <Header/>
              <Menu title={'Món Á'}/>
              <Menu title={'Món Âu'}/>
              <Menu title={"Rau Xanh"}/>
              <Menu title={"Đồ uống"}/>
              <Menu title={"Đồ nướng"}/>
              
            </>
          }
        
        
        />
        <Route 
          path="/cart"
          element={
            <>
              <Header/>
              <CartPage/>
              
            </>
            }
            
        />
        <Route 
          path="/ContactPage"
          element={
            <>
              <Header />
              <ContactPage/>
              <Footer/>
            </>
            }
            
        />
        
       
        
      </Routes>
    </Router>
  );
}

export default App;

