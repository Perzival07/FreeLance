import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { WhatsAppIcon } from "./Icons";
import { whatsappLink } from "../config/site";

const CustomBanner = () => (
  <section className="section container-site">
    <div className="grid overflow-hidden rounded-xl bg-ink-900 text-stone-300 md:grid-cols-2">
      <div className="flex flex-col justify-center p-8 sm:p-12">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-gold-400">Made to order</p>
        <h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">Your size. Your fabric. Your sofa.</h2>
        <p className="mt-4 max-w-md">
          Send us a photo or a measurement and we&apos;ll build it — sofas, beds, wardrobes and TV units in the exact size, colour and finish you want.
        </p>
        <ul className="mt-5 space-y-1.5 text-sm">
          <li>✓ Free measurement advice</li>
          <li>✓ Fabric & finish samples at the showroom</li>
          <li>✓ Clear quote before we start</li>
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/custom-furniture" className="btn-accent">Request a custom piece</Link>
          <a href={whatsappLink("Hi, I want a custom-made piece of furniture.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white hover:border-white">
            <WhatsAppIcon className="h-4 w-4" /> Send a photo on WhatsApp
          </a>
        </div>
      </div>
      <img src={assets.about_img} alt="Furniture being built in a workshop" loading="lazy" className="h-64 w-full object-cover md:h-full" />
    </div>
  </section>
);

export default CustomBanner;
