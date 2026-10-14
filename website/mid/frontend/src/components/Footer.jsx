import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { assets } from "../assets/assets";
import Icon, { WhatsAppIcon } from "./Icons";
import { NAV_CATEGORIES, SITE, fullAddress, whatsappLink } from "../config/site";
import { hoursSummary } from "../utils/format";

const collectionLink = (params) => `/collection?${new URLSearchParams(params)}`;

const FooterLinks = ({ title, links }) => (
  <div>
    <h2 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-white">{title}</h2>
    <ul className="space-y-2.5 text-sm">
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
};

const SOCIAL = [
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["youtube", "YouTube"],
];

const Footer = () => {
  const year = new Date().getFullYear();
  const socials = SOCIAL.filter(([key]) => SITE.social[key]);

  return (
    <footer className="mt-16 bg-ink-900 text-stone-400">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img src={assets.logo_dark} alt={SITE.name} width="96" height="96" className="mb-4 h-24 w-24" loading="lazy" />
          <p className="mb-5 max-w-xs text-sm leading-relaxed">
            Sofas, beds, wardrobes and made-to-order furniture from our showroom in {SITE.address.locality}, delivered and installed across Kolkata.
          </p>
          <address className="space-y-2 text-sm not-italic">
            <p className="flex gap-2">
              <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0" /> {fullAddress()}
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
          <div className="mt-5 flex items-center gap-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="WhatsApp">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
            {socials.map(([key, label]) => (
              <a key={key} href={SITE.social[key]} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label={label}>
                <Icon name={key} className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterLinks
          title="Shop"
          links={[
            ["All furniture", "/collection"],
            ...NAV_CATEGORIES.slice(0, 7).map((c) => [c.label, collectionLink({ subCategory: c.subCategory })]),
          ]}
        />
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
            ["Book a showroom visit", "/book-visit"],
            ["Custom furniture", "/custom-furniture"],
            ["Bulk & corporate orders", "/bulk-orders"],
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="container-site py-6 text-sm">
          <p className="mb-2 text-white">We deliver to</p>
          <p className="leading-relaxed">{SITE.deliveryAreas.join(" · ")}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p>
              © {year} {SITE.name}. All rights reserved.
              {SITE.gstin ? ` · GSTIN ${SITE.gstin}` : ""}
            </p>
            <p className="mt-1">
              <Link to="/terms" className="hover:text-white">Terms</Link>
              {" · "}
              <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
              {" · "}
              <a href="/sitemap.xml" className="hover:text-white">Sitemap</a>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2" aria-label="Payment methods we accept">
            {["UPI", "Cards", "Net banking", "Cash on delivery"].map((m) => (
              <span key={m} className="rounded border border-white/15 px-2 py-1 text-[11px] text-stone-300">
                {m}
              </span>
            ))}
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
