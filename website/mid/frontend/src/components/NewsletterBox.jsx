import { useContext, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const NewsletterBox = () => {
  const { backendUrl } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState({ status: "idle", message: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: "sending", message: "" });
    try {
      const { data } = await axios.post(`${backendUrl}/lead/create`, { type: "newsletter", email, website });
      setState({ status: data.success ? "done" : "error", message: data.message });
      if (data.success) setEmail("");
    } catch (err) {
      setState({ status: "error", message: err.response?.data?.message || "Could not subscribe right now." });
    }
  };

  return (
    <section className="section container-site">
      <div className="rounded-xl bg-cream-200 px-6 py-10 text-center sm:px-12 sm:py-14">
        <p className="eyebrow mb-2">Stay in touch</p>
        <h2 className="section-title">New arrivals & offers, first</h2>
        <p className="mx-auto mt-3 max-w-lg text-stone-600">
          Subscribers hear about new designs and sale dates before anyone else. One or two emails a month, no spam.
        </p>
        <form onSubmit={onSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="input flex-1"
            autoComplete="email"
          />
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" />
          <button type="submit" className="btn-primary" disabled={state.status === "sending"}>
            {state.status === "sending" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
        {state.message && (
          <p className={`mt-3 text-sm ${state.status === "error" ? "text-red-700" : "text-green-800"}`} role="status">
            {state.message}
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsletterBox;
