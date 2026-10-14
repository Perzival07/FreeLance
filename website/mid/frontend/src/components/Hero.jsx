import React, { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from './../assets/assets';
import Marquee from "./Marquee";

const CATEGORIES = ["SOFAS", "BEDS", "WARDROBES", "TABLES", "CHAIRS", "DESKS", "SHELVING", "STORAGE", "LIGHTING"];

const Hero = () => {
  const ref = useRef(null);
  const [minHeight, setMinHeight] = useState("calc(100svh - 10rem)");

  // Fill exactly the screen below the navbar, whatever height the navbar ends up being.
  useLayoutEffect(() => {
    const fit = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      setMinHeight(`calc(100svh - ${Math.round(top)}px)`);
    };
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
    // The navbar logo loads after first paint and changes the navbar height, so re-measure when the layout shifts.
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    observer?.observe(document.body);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("load", fit);
      observer?.disconnect();
    };
  }, []);

  return (
    // Full-bleed, fills the screen below the navbar
    <section
      ref={ref}
      style={{ minHeight }}
      className="full-bleed relative isolate flex flex-col overflow-hidden border-y border-gold-500/25 bg-ink-900"
    >
      {/* photo with slow ken-burns zoom */}
      <img
        src={assets.hero_img}
        alt=""
        fetchpriority="high"
        className="absolute inset-0 -z-30 h-full w-full object-cover animate-kenburns"
      />
      {/* legibility + colour grading over the (bright) photo */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-ink-950 via-ink-900/80 to-ink-900/25"></div>
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50"></div>

      {/* floating colour orbs */}
      <div className="pointer-events-none absolute -z-10 -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-gold-500/25 blur-3xl animate-float"></div>
      <div className="pointer-events-none absolute -z-10 bottom-10 right-[8%] h-80 w-80 rounded-full bg-ruby-500/25 blur-3xl animate-float [animation-delay:-4s]"></div>
      <div className="pointer-events-none absolute -z-10 top-[12%] right-[30%] h-64 w-64 rounded-full bg-amethyst-500/20 blur-3xl animate-float [animation-delay:-7s]"></div>

      {/* decorative gold ring */}
      <div className="pointer-events-none absolute -z-10 right-[6%] top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="h-[26rem] w-[26rem] rounded-full border border-gold-500/30 animate-float shadow-[0_0_80px_-10px_rgba(201,162,75,0.35)]"></div>
        <div className="absolute inset-6 rounded-full border border-dashed border-ruby-400/30"></div>

        {/* slowly rotating lettering around the rim */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-9 h-[calc(100%-4.5rem)] w-[calc(100%-4.5rem)] text-gold-300 [animation:spin_50s_linear_infinite]"
          aria-hidden="true"
        >
          <defs>
            <path id="hero-ring-text" d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0" />
          </defs>
          <text fill="currentColor" fontSize="9.5" fontWeight="600" letterSpacing="3" className="font-display">
            <textPath href="#hero-ring-text" textLength="512" lengthAdjust="spacing">
              LOKNATH SOFA CENTER ✦ PREMIUM FURNITURE ✦ CRAFTED FOR COMFORT ✦
            </textPath>
          </text>
        </svg>

        {/* centre emblem */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-ruby-500 text-lg">✦</span>
          <span className="font-display text-5xl italic font-semibold leading-none text-shimmer pb-1">Loknath</span>
          <span className="mt-2 text-[10px] tracking-[0.5em] text-ivory-300">SOFA CENTER</span>
          <span className="mt-3 h-px w-12 bg-gold-500/60"></span>
          <span className="mt-3 font-display text-sm italic text-ivory-400">Comfort, crafted.</span>
        </div>
      </div>

      {/* content */}
      <div className="flex flex-1 items-center px-4 py-16 [@media(max-height:720px)]:py-6 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <div className="max-w-3xl text-ivory-200">
          <div className="flex items-center gap-3 animate-fade-up">
            <span className="h-[1px] w-8 bg-gold-500 md:w-14"></span>
            <p className="eyebrow-gold text-xs font-medium md:text-sm">PREMIUM FURNITURE</p>
            <span className="text-ruby-500">✦</span>
          </div>

          <h1
            className="mt-5 font-display text-5xl font-semibold leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:sm:text-[clamp(2.75rem,10vh,4.5rem)] animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            Transform Your
            <span className="block pb-2 italic text-shimmer">Home</span>
          </h1>

          <p
            className="mt-6 max-w-xl text-base text-ivory-300 sm:text-lg [@media(max-height:720px)]:mt-3 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Sofas, beds, wardrobes and more — statement pieces, crafted for spaces that deserve to be noticed.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center gap-4 [@media(max-height:720px)]:mt-5 animate-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            <Link to="/collection" className="btn-gold px-10 py-4">
              Explore Collection
            </Link>
            <Link to="/contact" className="btn-gold-outline px-10 py-4">
              Visit Us
            </Link>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none flex flex-col items-center gap-1 pb-4 [@media(max-height:720px)]:hidden text-[10px] tracking-[0.35em] text-ivory-400">
        <span>SCROLL</span>
        <span className="animate-bounce-y text-gold-400">⌄</span>
      </div>

      {/* the moving bar */}
      <Marquee
        items={CATEGORIES}
        className="border-t border-gold-300/40 bg-gold-gradient py-3 shadow-[0_-10px_40px_-10px_rgba(201,162,75,0.6)]"
        itemClassName="font-display text-lg font-semibold tracking-[0.3em] text-ink-900 sm:text-xl"
      />
    </section>
  );
};

export default Hero;
