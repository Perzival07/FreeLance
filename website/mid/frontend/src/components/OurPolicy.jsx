import React from "react";
import { assets } from "../assets/assets";

const OurPolicy = () => {
  return (
    <div className="relative flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-ivory-300">
      <div className="divider-gold absolute top-0 left-0 right-0"></div>

      <div className="group">
        <div className="w-16 h-16 m-auto mb-5 rounded-full border border-gold-500/40 flex items-center justify-center animate-glow-pulse group-hover:scale-110 transition-transform">
          <img
            src={assets.quality_icon}
            alt="icon"
            className="icon-luxury w-7"
          />
        </div>
        <p className="font-display text-lg tracking-wide text-ivory-100">Quality Assurance</p>
        <p className="text-ivory-500">We provide high quality products</p>
      </div>

      <div className="group">
        <div className="w-16 h-16 m-auto mb-5 rounded-full border border-gold-500/40 flex items-center justify-center animate-glow-pulse group-hover:scale-110 transition-transform">
          <img
            src={assets.support_img}
            alt="icon"
            className="icon-luxury w-7"
          />
        </div>
        <p className="font-display text-lg tracking-wide text-ivory-100">Best Customer Support</p>
        <p className="text-ivory-500">We provide 24/7 customer support</p>
      </div>

    </div>
  );
};

export default OurPolicy;
