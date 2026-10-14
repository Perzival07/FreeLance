import PropTypes from "prop-types";

// Endless scrolling ribbon. The item list is rendered twice so the -50% keyframe loops seamlessly.
const Marquee = ({ items, reverse = false, className = "", itemClassName = "", separator = "✦", slow = false }) => {
  const renderSet = (hidden) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className={`whitespace-nowrap px-6 sm:px-10 ${itemClassName}`}>{item}</span>
          <span className="text-ruby-500" aria-hidden="true">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`group overflow-hidden ${className}`}>
      <div
        className={`flex w-max ${slow ? "animate-marquee-slow" : "animate-marquee"} group-hover:[animation-play-state:paused]`}
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {renderSet(false)}
        {renderSet(true)}
      </div>
    </div>
  );
};

Marquee.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  reverse: PropTypes.bool,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  separator: PropTypes.string,
  slow: PropTypes.bool,
};

export default Marquee;
