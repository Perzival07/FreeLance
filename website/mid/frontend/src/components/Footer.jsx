import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { assets } from "../assets/assets";
import Icon, { WhatsAppIcon } from "./Icons";
import { NAV_CATEGORIES, POPULAR_SEARCHES, SITE, fullAddress, whatsappLink } from "../config/site";
import { hoursSummary } from "../utils/format";

const collectionLink = (params) => `/collection?${new URLSearchParams(params)}`;

const FooterLinks = ({ title, links, columns = 1 }) => (
  <div>
    <h2 className="mb-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-white">{title}</h2>
    <ul className={`grid gap-x-6 gap-y-1.5 text-sm ${columns === 2 ? "grid-cols-2" : ""}`}>
      {links.map(([label, to]) => (
        <li key={label}>
          <Link to={to} className="hover:text-white">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

FooterLinks.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.array).isRequired,
  columns: PropTypes.number,
};

// Simple payment-method marks (not official artwork)
const PaymentMarks = () => (
  <>
    <span className="flex h-6 items-center rounded bg-white px-2 text-[11px] font-bold italic tracking-tight text-[#097939]" title="UPI">
      UPI<span className="text-[#ed752e]">▶</span>
    </span>
    <span className="flex h-6 items-center rounded bg-white px-2 text-xs font-extrabold italic text-[#1a1f71]" title="Visa">VISA</span>
    <span className="flex h-6 items-center gap-0 rounded bg-white px-2" title="Mastercard">
      <span className="h-4 w-4 rounded-full bg-[#eb001b]" />
      <span className="-ml-1.5 h-4 w-4 rounded-full bg-[#f79e1b] opacity-90" />
    </span>
    <span className="flex h-6 items-center rounded bg-white px-2 text-[11px] font-bold text-[#1b3d8f]" title="RuPay">
      Ru<span className="text-[#f37021]">Pay</span>
    </span>
    <span className="flex h-6 items-center gap-1 rounded border border-white/20 px-2 text-[11px] text-stone-200" title="Cash on delivery">
      <Icon name="wallet" className="h-3.5 w-3.5" /> Cash on delivery
    </span>
  </>
);

const SOCIAL = [
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["youtube", "YouTube"],
];

const Footer = () => {
  const year = new Date().getFullYear();
  const socials = SOCIAL.filter(([key]) => SITE.social[key]);

  return (
    <footer className="mt-12 bg-ink-900 text-stone-400">
      <div className="container-site grid grid-cols-2 gap-x-6 gap-y-8 py-8 lg:grid-cols-[1.5fr_1.3fr_1fr_1fr] lg:gap-x-10">
        <div className="col-span-2 lg:col-span-1">
          <div className="mb-3 flex items-center gap-3">
            <img src={assets.logo_dark} alt={SITE.name} width="56" height="56" className="h-14 w-14 shrink-0" loading="lazy" />
            <p className="text-sm leading-snug">Sofas & furniture from our {SITE.address.locality} showroom, delivered and installed across Kolkata.</p>
          </div>
          <address className="space-y-1 text-sm not-italic">
            <p className="flex gap-2">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {fullAddress()}{" "}
                <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap text-gold-300 hover:text-white">
                  Get directions
                </a>
              </span>
            </p>
            <p className="flex gap-2">
              <Icon name="clock" className="mt-0.5 h-4 w-4 shrink-0" /> {hoursSummary()}
            </p>
            <p className="flex gap-2">
              <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0" />
              <a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a>
            </p>
            <p className="flex gap-2">
              <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0" />
              <a href={`mailto:${SITE.email}`} className="break-all hover:text-white">{SITE.email}</a>
            </p>
          </address>
          <div className="mt-3 flex items-center gap-2">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="WhatsApp">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            {socials.map(([key, label]) => (
              <a key={key} href={SITE.social[key]} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label={label}>
                <Icon name={key} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="col-span-2 lg:col-span-1">
        <FooterLinks
          title="Shop"
          columns={2}
          links={[
            ["All furniture", "/collection"],
            ...NAV_CATEGORIES.map((c) => [c.label, collectionLink({ subCategory: c.subCategory })]),
          ]}
        />
        </div>
        <FooterLinks
          title="Help"
          links={[
            ["Track your order", "/track-order"],
            ["Shipping & delivery", "/shipping-policy"],
            ["Returns & refunds", "/return-policy"],
            ["Warranty", "/warranty"],
            ["Furniture care guide", "/care-guide"],
            ["FAQs", "/faq"],
            ["Contact us", "/contact"],
          ]}
        />
        <FooterLinks
          title="Company"
          links={[
            ["About us", "/about"],
            ["Visit our showroom", "/showroom"],
            ["Book a visit", "/book-visit"],
            ["Custom furniture", "/custom-furniture"],
            ["Bulk orders", "/bulk-orders"],
            ...(SITE.careersOpen ? [["Careers", "/careers"]] : []),
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="container-site space-y-1.5 py-4 text-xs leading-relaxed">
          <p>
            <span className="text-stone-200">We deliver to: </span>
            {SITE.deliveryAreas.join(" · ")}
          </p>
          <p>
            <span className="text-stone-200">Popular: </span>
            {POPULAR_SEARCHES.map(([label, to], i) => (
              <span key={label}>
                {i > 0 && " · "}
                <Link to={to} className="hover:text-white">{label}</Link>
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-3 py-4 text-xs md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {SITE.name}
            {SITE.gstin ? ` · GSTIN ${SITE.gstin}` : ""}
            {" · "}
            <Link to="/terms" className="hover:text-white">Terms</Link>
            {" · "}
            <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
            {" · "}
            <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
          </p>
          <div className="flex flex-wrap items-center gap-1.5" aria-label="Payment methods we accept">
            <PaymentMarks />
            <span className="ml-1 flex items-center gap-1 text-[11px] text-stone-300">
              <Icon name="shield" className="h-3.5 w-3.5" /> Secure checkout
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
