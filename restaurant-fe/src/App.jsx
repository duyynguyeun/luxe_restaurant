import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import CartPage from "./giohang/CartPage";
import { CartContext } from "./giohang/CartContext";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Login from "./dndx/Login";
import Signup from "./dndx/Signup";
import FeaturedMenu from "./components/FeaturedMenu"; 
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import ContactPage from "./Lienhe/ContactPage";





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
