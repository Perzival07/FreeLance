import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const ForgotPassword = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${backendUrl}/user/forgot-password`, {
        email,
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t hairline-gold pt-14 pb-14 max-w-md mx-auto px-4">
      <div className="card-luxury px-8 py-10 shadow-gold">
        <h1 className="font-display text-3xl text-gold-gradient text-center mb-2">Forgot password</h1>
        <p className="text-sm text-ivory-300 text-center mb-8">
          Enter your email and we will send you a reset link if an account exists.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gold-500/30 focus:border-gold-400 bg-ink-950 text-ivory-100 outline-none transition-colors"
            placeholder="Email"
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-gold disabled:opacity-50"
          >
            {submitting ? "Sending…" : "Send reset link"}
          </button>
          <Link to="/login" className="text-center text-sm text-ivory-300 hover:text-gold-400 transition-colors">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
