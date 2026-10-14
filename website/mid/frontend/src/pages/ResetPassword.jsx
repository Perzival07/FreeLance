import { useContext, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const ResetPassword = () => {
  const { backendUrl, navigate } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = searchParams.get("token") || "";
    setToken(t);
  }, [searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Invalid or missing reset link");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${backendUrl}/user/reset-password`, {
        token,
        newPassword: password,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
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
        <h1 className="font-display text-3xl text-gold-gradient text-center mb-8">Set new password</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gold-500/30 focus:border-gold-400 bg-ink-950 text-ivory-100 outline-none transition-colors"
            placeholder="New password (min 8 characters)"
          />
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-3 py-2 border border-gold-500/30 focus:border-gold-400 bg-ink-950 text-ivory-100 outline-none transition-colors"
            placeholder="Confirm password"
          />
          <button
            type="submit"
            disabled={submitting || !token}
            className="btn-gold disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Update password"}
          </button>
          <Link to="/login" className="text-center text-sm text-ivory-300 hover:text-gold-400 transition-colors">
            Back to login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
