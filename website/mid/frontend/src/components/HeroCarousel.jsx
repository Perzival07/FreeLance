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
  // slides can arrive later (photos from the catalogue), so keep the index in range
  const slide = slides[Math.min(index, count - 1)];

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
      <div className="relative grid min-h-[560px] sm:min-h-[580px] lg:min-h-[600px] lg:grid-cols-2">
        {/* Photos: fixed-size layer that cross-fades; never affects the text layout */}
        <div className="relative order-1 h-[240px] sm:h-[280px] lg:order-2 lg:h-auto">
          {slides.map((s, i) => (
            <img
              key={s.title}
              src={typeof s.image === "string" && s.image.includes("cloudinary") ? imageUrl(s.image, 1400) : s.image}
              srcSet={s.imageSmall ? `${s.imageSmall} 960w, ${s.image} 1920w` : undefined}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={i === index ? s.alt || "" : ""}
              aria-hidden={i !== index}
              // eslint-disable-next-line react/no-unknown-property -- React 18 needs the lowercase attribute
              fetchpriority={i === 0 ? "high" : undefined}
              loading={i === 0 ? "eager" : "lazy"}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
              style={s.position ? { objectPosition: s.position } : undefined}
            />
          ))}
        </div>

        {/* Text: only the current slide is rendered, so slides can't overlap */}
        <div className="order-2 flex items-center lg:order-1">
          <div className="container-site lg:ml-auto lg:mr-0 lg:max-w-[660px] lg:pr-12">
            <div key={slide.title} className="animate-[heroIn_600ms_ease-out] py-8 lg:pb-24 lg:pt-12" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`}>
              {slide.eyebrow && <p className="eyebrow mb-3">{slide.eyebrow}</p>}
              {index === 0 ? (
                <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl xl:text-6xl">{slide.title}</h1>
              ) : (
                <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl xl:text-6xl">{slide.title}</h2>
              )}
              <p className="mt-4 max-w-md text-base text-stone-600 sm:text-lg">{slide.text}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={slide.cta.to} className="btn-primary">
                  {slide.cta.label} <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
                {slide.secondary && (
                  <Link to={slide.secondary.to} className="btn-outline">
                    {slide.secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
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
