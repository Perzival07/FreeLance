import React, { useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { MdEmail, MdLock } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full relative overflow-hidden">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gold-500/10 blur-3xl rounded-full"></div>

      <div className="relative card-luxury shadow-gold-lg rounded-lg px-8 py-8 max-w-md w-full mx-4">
        {/* Logo/Image */}
        <span className="mx-auto mb-3 block w-fit rounded-2xl bg-gradient-to-b from-ivory-50 to-ivory-200 p-2 ring-1 ring-gold-500/40">
          <img
            src={assets.logo_login}
            alt="Admin Logo"
            className="w-40 h-12 object-contain"
          />
        </span>

        <p className="eyebrow-gold text-[11px] text-center mb-1">LOKNATH SOFA CENTER</p>
        <h1 className="font-display text-3xl text-gold-gradient font-semibold mb-6 text-center">Admin Panel</h1>
        <form onSubmit={onSubmitHandler}>
          {/* Email Field */}
          <div className="mb-4 min-w-72">
            <p className="flex items-center text-sm font-medium text-ivory-200 mb-2">
              <MdEmail className="mr-2 text-gold-400 text-lg" /> Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="your@email.com"
              required
              className="rounded-md w-full px-3 py-2.5 outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="mb-5 min-w-72">
            <p className="flex items-center text-sm font-medium text-ivory-200 mb-2">
              <MdLock className="mr-2 text-gold-400 text-lg" /> Password
            </p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="enter your password"
              required
              className="rounded-md w-full px-3 py-2.5 outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn-gold w-full rounded-md"
          >
            <FiLogIn className="text-lg" /> Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
