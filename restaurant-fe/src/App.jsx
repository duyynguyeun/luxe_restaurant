import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// 1. IMPORT LAZY VÀ SUSPENSE
import { Suspense, lazy } from "react";

// 2. IMPORT CÁC PROVIDER
import { CartProvider } from "./giohang/CartContext"; 
import { AuthProvider } from "./context/AuthContext"; // Provider cho Đăng nhập

// 3. IMPORT LAYOUT
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./Loading/LoadingSpinner"; // Đường dẫn file loading

// 4. "LAZY LOAD" CÁC COMPONENT
const Banner = lazy(() => import('./components/Banner'));
const FeaturedMenu = lazy(() => import('./components/FeaturedMenu'));
const Menu = lazy(() => import('./components/Menu'));
const CartPage = lazy(() => import('./giohang/CartPage'));
const Login = lazy(() => import('./dndx/Login'));
const Signup = lazy(() => import('./dndx/Signup'));
const ContactPage = lazy(() => import('./Lienhe/ContactPage'));
// Chúng ta vẫn cần lazy load trang Profile
const ProfilePage = lazy(() => import('./dndx/ProfilePage')); 
import Chatbot from "./Chatbot/Chatbot";

// 5. LAZY LOAD CÁC TRANG ADMIN
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminManageMenu = lazy(() => import('./admin/AdminManageMenu'));

function App() {
  return (
    // 6. BỌC CÁC PROVIDER
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* 7. BỌC SUSPENSE */}
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              
              {/* Nhóm 1: Các trang ADMIN */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="menu" element={<AdminManageMenu />} />
              </Route>

              {/* Nhóm 2: Các trang USER (Giữ nguyên cấu trúc cũ của bạn) */}
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
              <Route
                path="/banner"
                element={
                  <>
                    <Header />
                    <Banner />
                  </>
                }
              />
              <Route
                path="/login"
                element={
                  <>
                    <Header />
                    <Login />
                  </>
                }
              />
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
                    <Menu/>
                    <Footer />
                  </>
                }
              />
              <Route 
                path="/cart"
                element={
                  <>
                    <Header/>
                    <CartPage/>
                    <Footer />
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
              <Route 
                path="/profile" 
                element={
                  <>
                    <Header />
                    <ProfilePage />
                    <Footer />
                  </>
                } 
              />
              
              
            </Routes>
            <Chatbot/>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

