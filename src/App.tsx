import { useEffect, useState, Suspense } from "react";
import * as Notifications from "./utils/notifications";
import "antd/dist/reset.css";
import {  Link, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Checkout from "./pages/Checkout";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import Explore from "./pages/Explore";
import Orders from "./pages/Orders";

function App() {
  const {pathname} = useLocation()
  useEffect(() => {}, []);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
      {!["/login","/signup","/reset-password"].includes(pathname) &&(

        <>

<Header/>

<MobileNav/>
        </>
      )
      
      }
      <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100vh',
          maxWidth: '480px',
          margin: '0 auto'
        }}>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            paddingBottom: '56px' 
          }}>
            <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/product/:id" element={<></>} />
              <Route path="/vendor/:id" element={<></>} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </ErrorBoundary>
       
          </div>
          </div>
          
      </Suspense>
    </>
  );
}

export default App;
