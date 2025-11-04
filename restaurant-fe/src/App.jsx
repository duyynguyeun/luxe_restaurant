import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Banner from "./components/Banner";
import Login from "./dndx/Login";
import Signup from "./dndx/Signup";
import FeaturedMenu from "./components/FeaturedMenu";
import Footer from "./components/Footer";
import Menu from "./components/Menu";



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
              <Menu title={"Rau Má"}/>
              <Menu title={"Rau 36"}/>
              <Menu title={"Rau"}/>
            </>
          }
        
        
        />
       
        
      </Routes>
    </Router>
  );
}

export default App;
