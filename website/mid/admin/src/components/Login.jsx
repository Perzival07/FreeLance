import { useState } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { FiLogIn } from "react-icons/fi";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(backendUrl + "/api/user/admin", { email, password });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream-100 px-4">
      <div className="card-luxury w-full max-w-md px-8 py-10 shadow-sm">
        <img src={assets.logo} alt="Loknath Sofa Center" className="mx-auto mb-4 h-20 w-20" />
        <p className="eyebrow-gold mb-1 text-center text-[11px]">Loknath Sofa Center</p>
        <h1 className="mb-8 text-center text-4xl font-semibold">Admin panel</h1>
        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-medium text-stone-700">Email address</label>
            <input id="admin-email" onChange={(e) => setEmail(e.target.value)} value={email} type="email" autoComplete="username" required className="w-full px-3 py-2.5" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-medium text-stone-700">Password</label>
            <input id="admin-password" onChange={(e) => setPassword(e.target.value)} value={password} type="password" autoComplete="current-password" required className="w-full px-3 py-2.5" />
          </div>
          <button type="submit" disabled={loading} className="btn-gold w-full py-3">
            <FiLogIn /> {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-stone-500">
          <a href="/" className="hover:text-stone-900">← Back to the store</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
