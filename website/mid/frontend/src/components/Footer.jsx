import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="relative bg-ink-900 border-t border-gold-500/15 mt-10 full-bleed">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-ruby-500 to-transparent"></div>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 py-16 text-sm">
          <div>
            <img src={assets.logo_dark} alt="Loknath Sofa Center" className="w-28 mb-5 drop-shadow-[0_0_14px_rgba(201,162,75,0.25)]" />
            <p className="w-full md:w-2/3 text-ivory-400 leading-relaxed">
              Transforming your house into a home with thoughtfully designed furniture built to last a lifetime.
            </p>
          </div>

          <div>
            <p className="font-display text-xl tracking-wide text-shimmer mb-5">Company</p>
            <ul className="flex flex-col gap-2 text-ivory-400">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About us</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-gold-400 transition-colors">Privacy policy</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xl tracking-wide text-shimmer mb-5">Get in Touch</p>
            <ul className="flex flex-col gap-2 text-ivory-400">
              <li>+91 91239 24645</li>
              <li><a href="mailto:loknathsofacenter@gmail.com" className="hover:text-gold-400 transition-colors">loknathsofacenter@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="divider-gold"></div>
        <p className="py-6 text-xs text-center text-ivory-500 tracking-wide">Designed by Koustav Das with ❤️</p>
      </div>
    </div>
  );
};

export default Footer;
