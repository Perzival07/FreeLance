import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Enquiries from "./pages/Enquiries";
import Reviews from "./pages/Reviews";
import Login from "./components/Login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




export const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
export const currency = '₹';




const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") 
  ? localStorage.getItem("token") 
  : "");


  useEffect(() =>{
    localStorage.setItem("token", token);
  },[token])


  return (
    <div className="min-h-screen">
      <ToastContainer position="bottom-center" autoClose={2500} hideProgressBar theme="light" />
      {token === "" ?
        <Login setToken={setToken} />
       :
        <>
          <Navbar setToken={setToken} />
          <div className="flex w-full">
            <Sidebar />

            <main className="min-w-0 flex-1 px-4 py-8 text-base text-stone-700 sm:px-8">
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/add" element={<Add token={token}/>} />
                <Route path="/list" element={<List token={token}/>} />
                <Route path="/orders" element={<Orders token={token}/>} />
                <Route path="/customers" element={<Customers token={token}/>} />
                <Route path="/enquiries" element={<Enquiries token={token}/>} />
                <Route path="/reviews" element={<Reviews token={token}/>} />
              </Routes>
            </main>
          </div>
        </>
      }
    </div>
  );
};

export default App;
