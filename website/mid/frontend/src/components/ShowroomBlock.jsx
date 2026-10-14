import { Link } from "react-router-dom";
import Icon, { WhatsAppIcon } from "./Icons";
import { SITE, fullAddress, whatsappLink } from "../config/site";
import { DAY_NAMES, formatTime, showroomStatus } from "../utils/format";

export const HoursTable = () => {
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).getDay();
  // Monday first
  const ordered = [...SITE.hours].sort((a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7));
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {ordered.map((h) => (
          <tr key={h.day} className={h.day === today ? "font-semibold text-stone-900" : "text-stone-700"}>
            <th scope="row" className="py-1 pr-4 text-left font-[inherit]">
              {DAY_NAMES[h.day]}
              {h.day === today && <span className="ml-2 text-xs font-normal text-gold-800">Today</span>}
            </th>
            <td className="py-1 text-right">
              {formatTime(h.open)} – {formatTime(h.close)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ShowroomBlock = () => {
  const status = showroomStatus();
  return (
    <section className="section container-site">
      <div className="grid overflow-hidden rounded-xl border border-cream-300 bg-white lg:grid-cols-2">
        <div className="h-72 lg:h-auto">
          <iframe
            src={SITE.mapsEmbedUrl}
            title={`Map showing ${SITE.name}`}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="p-6 sm:p-10">
          <p className="eyebrow mb-2">Visit our showroom</p>
          <h2 className="section-title">See it, sit on it, then decide</h2>
          <p className="mt-3 text-stone-600">
            Furniture is personal. Come and feel the fabrics, test the cushions and talk to us about custom sizes — no appointment needed.
          </p>
          <p className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${status.open ? "bg-green-50 text-green-800" : "bg-cream-200 text-stone-700"}`}>
            <span className={`h-2 w-2 rounded-full ${status.open ? "bg-green-600" : "bg-stone-500"}`} aria-hidden="true" />
            {status.text}
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-sm text-stone-700">
              <p className="flex gap-2"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold-800" /> {fullAddress()}</p>
              <p className="flex gap-2"><Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-gold-800" /> <a href={SITE.phoneHref} className="hover:underline">{SITE.phone}</a></p>
            </div>
            <HoursTable />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Icon name="pin" className="h-4 w-4" /> Get directions
            </a>
            <Link to="/book-visit" className="btn-outline">
              <Icon name="calendar" className="h-4 w-4" /> Book a visit
            </Link>
            <a href={whatsappLink("Hi, I'd like to visit the showroom.")} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <WhatsAppIcon className="h-4 w-4 text-[#1f8f4e]" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowroomBlock;
