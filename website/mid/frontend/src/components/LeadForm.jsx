import { useContext, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import Icon, { WhatsAppIcon } from "./Icons";
import { SITE, whatsappLink } from "../config/site";
import PhotoPicker from "./PhotoPicker";
import { compressImage } from "../utils/compressImage";

const TIME_SLOTS = ["10 AM – 12 PM", "12 PM – 2 PM", "2 PM – 4 PM", "4 PM – 6 PM", "6 PM – 8 PM"];

const todayIso = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/**
 * Enquiry form that saves to the admin "Enquiries" inbox.
 * type: visit | custom | callback | bulk | product
 * fields: which optional fields to show (name and phone are always shown)
 */
const LeadForm = ({
  type,
  fields = ["message"],
  submitLabel = "Send enquiry",
  messageLabel = "Message",
  messagePlaceholder = "",
  product,
  compact = false,
  messageRequired = false,
  allowPhotos = false,
}) => {
  const { backendUrl } = useContext(ShopContext);
  const [values, setValues] = useState({ name: "", phone: "", email: "", preferredDate: "", preferredTime: "", budget: "", message: "", website: "", purpose: "" });
  const [state, setState] = useState({ status: "idle", message: "" });
  const [photos, setPhotos] = useState([]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const has = (f) => fields.includes(f);

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: "sending", message: "" });
    try {
      const { purpose, ...rest } = values;
      const payload = { type, ...rest };
      // the visit purpose travels with the message so it shows in the admin inbox
      if (purpose) payload.message = `[${purpose}] ${rest.message}`.trim();
      if (product) {
        payload.productId = String(product._id);
        payload.productName = product.name;
      }
      let body = payload;
      if (photos.length) {
        // multipart only when photos are attached
        body = new FormData();
        Object.entries(payload).forEach(([k, v]) => v !== "" && body.append(k, v));
        for (const file of await Promise.all(photos.map((f) => compressImage(f)))) body.append("images", file);
      }
      const { data } = await axios.post(`${backendUrl}/lead/create`, body);
      if (data.success) {
        setState({ status: "done", message: data.message });
      } else {
        setState({ status: "error", message: data.message || "Something went wrong." });
      }
    } catch (err) {
      setState({ status: "error", message: err.response?.data?.message || "Could not send. Please call or WhatsApp us." });
    }
  };

  if (state.status === "done") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center" role="status">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
          <Icon name="check" className="h-6 w-6" strokeWidth={2.5} />
        </div>
        <p className="font-medium text-stone-900">{state.message}</p>
        <p className="mt-2 text-sm text-stone-600">
          Need it sooner? Call <a href={SITE.phoneHref} className="link">{SITE.phone}</a>.
        </p>
      </div>
    );
  }

  const grid = compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate={false}>
      <div className={grid}>
        <div>
          <label className="label" htmlFor={`${type}-name`}>Your name *</label>
          <input id={`${type}-name`} className="input" required minLength={2} maxLength={100} value={values.name} onChange={set("name")} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor={`${type}-phone`}>Phone / WhatsApp *</label>
          <input id={`${type}-phone`} className="input" type="tel" required pattern="[+]?[0-9\s\-]{10,15}" title="10-digit mobile number" value={values.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" />
        </div>
        {has("email") && (
          <div>
            <label className="label" htmlFor={`${type}-email`}>Email</label>
            <input id={`${type}-email`} className="input" type="email" value={values.email} onChange={set("email")} autoComplete="email" />
          </div>
        )}
        {has("budget") && (
          <div>
            <label className="label" htmlFor={`${type}-budget`}>Budget</label>
            <select id={`${type}-budget`} className="input" value={values.budget} onChange={set("budget")}>
              <option value="">Select a range</option>
              <option>Under ₹25,000</option>
              <option>₹25,000 – ₹50,000</option>
              <option>₹50,000 – ₹1,00,000</option>
              <option>Above ₹1,00,000</option>
            </select>
          </div>
        )}
        {has("purpose") && (
          <div className="sm:col-span-2">
            <label className="label" htmlFor={`${type}-purpose`}>I&apos;d like to</label>
            <select id={`${type}-purpose`} className="input" value={values.purpose} onChange={set("purpose")}>
              <option value="">Visit the showroom</option>
              <option value="Free design consultation">Get a free design consultation</option>
              <option value="Custom order discussion">Discuss a custom order</option>
            </select>
          </div>
        )}
        {has("preferredDate") && (
          <div>
            <label className="label" htmlFor={`${type}-date`}>Preferred date *</label>
            <input id={`${type}-date`} className="input" type="date" required min={todayIso()} value={values.preferredDate} onChange={set("preferredDate")} />
          </div>
        )}
        {has("preferredTime") && (
          <div>
            <label className="label" htmlFor={`${type}-time`}>Preferred time</label>
            <select id={`${type}-time`} className="input" value={values.preferredTime} onChange={set("preferredTime")}>
              <option value="">Any time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {has("message") && (
        <div>
          <label className="label" htmlFor={`${type}-message`}>{messageLabel}</label>
          <textarea id={`${type}-message`} className="input min-h-[110px]" required={messageRequired} minLength={messageRequired ? 5 : undefined} maxLength={2000} placeholder={messagePlaceholder} value={values.message} onChange={set("message")} />
        </div>
      )}

      {allowPhotos && (
        <div>
          <p className="label">Reference photos (optional)</p>
          <PhotoPicker id={`${type}-photos`} files={photos} onChange={setPhotos} label="Add photo" />
        </div>
      )}

      {/* Honeypot — hidden from people, bots fill it in */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>

      {state.status === "error" && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.message}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending…" : submitLabel}
        </button>
        {!compact && (
          <a
            href={whatsappLink(product ? `Hi, I'm interested in "${product.name}".` : "Hi Loknath Sofa Center, I have an enquiry.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#1f8f4e]" /> Or chat on WhatsApp
          </a>
        )}
      </div>
      <p className="text-xs text-stone-500">We only use your details to reply to this enquiry.</p>
    </form>
  );
};

LeadForm.propTypes = {
  type: PropTypes.oneOf(["visit", "custom", "callback", "bulk", "product"]).isRequired,
  fields: PropTypes.arrayOf(PropTypes.string),
  submitLabel: PropTypes.string,
  messageLabel: PropTypes.string,
  messagePlaceholder: PropTypes.string,
  product: PropTypes.object,
  compact: PropTypes.bool,
  messageRequired: PropTypes.bool,
  allowPhotos: PropTypes.bool,
};

export default LeadForm;
