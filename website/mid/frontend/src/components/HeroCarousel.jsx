import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Icon from "./Icons";
import { imageUrl } from "../utils/format";

/**
 * slides: [{ eyebrow, title, text, cta: {label, to}, secondary?: {label, to}, image, imageSmall?, alt }]
 * Auto-advances every 6s; pauses on hover/focus and when the visitor prefers reduced motion.
 */
const HeroCarousel = ({ slides }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useRef(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  const count = slides.length;

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || reduceMotion.current || count < 2) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [paused, count]);

  return (
    <section
      className="relative overflow-hidden bg-cream-200"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative min-h-[560px] sm:min-h-[580px] lg:min-h-[560px]">
        {slides.map((s, i) => (
          <div
            key={s.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 grid transition-opacity duration-700 lg:grid-cols-2 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <div className="order-2 flex items-center lg:order-1">
              <div className="container-site lg:ml-auto lg:mr-0 lg:max-w-[660px] lg:pr-12">
                <div className="py-8 lg:py-0">
                  {s.eyebrow && <p className="eyebrow mb-3">{s.eyebrow}</p>}
                  {i === 0 ? (
                    <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">{s.title}</h1>
                  ) : (
                    <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">{s.title}</h2>
                  )}
                  <p className="mt-4 max-w-md text-base text-stone-600 sm:text-lg">{s.text}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link to={s.cta.to} className="btn-primary" tabIndex={i === index ? 0 : -1}>
                      {s.cta.label} <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
                    {s.secondary && (
                      <Link to={s.secondary.to} className="btn-outline" tabIndex={i === index ? 0 : -1}>
                        {s.secondary.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 h-[240px] sm:h-[280px] lg:order-2 lg:h-auto">
              <img
                src={typeof s.image === "string" && s.image.includes("cloudinary") ? imageUrl(s.image, 1400) : s.image}
                srcSet={s.imageSmall ? `${s.imageSmall} 960w, ${s.image} 1920w` : undefined}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={s.alt || ""}
                // eslint-disable-next-line react/no-unknown-property -- React 18 needs the lowercase attribute
                fetchpriority={i === 0 ? "high" : undefined}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <div className="container-site absolute inset-x-0 top-[192px] flex items-center justify-end gap-3 sm:top-[232px] lg:bottom-8 lg:top-auto lg:justify-start">
          <button type="button" onClick={() => go(index - 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white/90 hover:border-stone-900" aria-label="Previous slide">
            <Icon name="chevronLeft" className="h-4 w-4" />
          </button>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-stone-900" : "w-2 bg-stone-400 hover:bg-stone-600"}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
          <button type="button" onClick={() => go(index + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 bg-white/90 hover:border-stone-900" aria-label="Next slide">
            <Icon name="chevronRight" className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
};

HeroCarousel.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default HeroCarousel;
