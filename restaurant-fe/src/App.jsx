import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// 1. IMPORT LAZY VÀ SUSPENSE
import { Suspense, lazy } from "react";

// 2. IMPORT CÁC PROVIDER
import { CartProvider } from "./giohang/CartContext"; 
import { AuthProvider } from "./context/AuthContext"; // Provider cho Đăng nhập
import { LanguageProvider } from "./i18n/LanguageProvider";

// 3. IMPORT LAYOUT
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingSpinner from "./Loading/LoadingSpinner"; // Đường dẫn file loading
import OnboardingTour from "./components/OnboardingTour";

// --- THÊM IMPORT NÀY ---
import AdminRoute from "./components/AdminRoute";
// -----------------------
// --- 1. IMPORT TOASTIFY VÀ CSS ---
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// --------------------------------
// 4. "LAZY LOAD" CÁC COMPONENT
const Banner = lazy(() => import('./components/Banner'));
const FeaturedMenu = lazy(() => import('./components/FeaturedMenu'));
const Menu = lazy(() => import('./components/Menu'));
const CartPage = lazy(() => import('./giohang/CartPage'));
const Login = lazy(() => import('./dndx/Login'));
const Signup = lazy(() => import('./dndx/Signup'));
const ContactPage = lazy(() => import('./Lienhe/ContactPage'));
const ForgotPassword = lazy(() => import('./dndx/ForgotPassword'));
const MyOrders = lazy(() => import('./giohang/MyOrders'));
// Chúng ta vẫn cần lazy load trang Profile
const ProfilePage = lazy(() => import('./dndx/ProfilePage')); 
const PromotionsPage = lazy(() => import('./components/PromotionsPage'));
import Chatbot from "./Chatbot/Chatbot";
import ChatWidget from "./components/ChatWidget";

// 5. LAZY LOAD CÁC TRANG ADMIN
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminManageMenu = lazy(() => import('./admin/AdminManageMenu'));
const AdminManageOrders = lazy(() => import('./admin/AdminManageOrders'));
const AdminManageReservations = lazy(() => import('./admin/AdminManageReservations'));              
const AdminManageUsers = lazy(() => import('./admin/AdminManageUsers'));
const AdminManageStaff = lazy(() => import('./admin/AdminManageStaff')); // <--- Import component mới
const AdminManageReports = lazy(() => import('./admin/AdminManageReports'));
const AdminManagePromotions = lazy(() => import('./admin/AdminManagePromotions'));


function App() {
  return (
    // 6. BỌC CÁC PROVIDER
    <AuthProvider>
      <CartProvider>
        <LanguageProvider>
          <Router>
          {/* 7. BỌC SUSPENSE */}
          <Suspense fallback={<LoadingSpinner />}>
            <ToastContainer position="top-right" autoClose={3000} />
            <OnboardingTour />
            <Routes>
              
              {/* Nhóm 1: Các trang ADMIN (ĐƯỢC BẢO VỆ) */}
              {/* Chỉ Admin mới đi qua được lớp AdminRoute này */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="menu" element={<AdminManageMenu />} />
                  <Route path="orders" element={<AdminManageOrders />} />
                  <Route path="reservations" element={<AdminManageReservations />} />
                  <Route path="users" element={<AdminManageUsers />} />
                  <Route path="staff" element={<AdminManageStaff />} />
                  <Route path="reports" element={<AdminManageReports />} />
                  <Route path="promotions" element={<AdminManagePromotions />} />
                </Route>
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
                path="/forgot-password" // <-- THÊM ROUTE MỚI NÀY
                element={
                  <>
                    <Header />
                    <ForgotPassword />
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
                path="/promotions"
                element={
                  <>
                    <Header/>
                    <PromotionsPage/>
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
                path="/my-orders"
                element={
                  <>
                    <Header/>
                    <MyOrders />
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
            {/* Real-time chat widget */}
            <ChatWidget />
          </Suspense>
          </Router>
        </LanguageProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;