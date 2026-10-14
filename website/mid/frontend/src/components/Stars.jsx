import PropTypes from "prop-types";
import Icon from "./Icons";

const Stars = ({ value, className = "h-4 w-4" }) => (
  <span className="inline-flex items-center gap-0.5 text-gold-600" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Icon key={n} name="star" className={`${className} ${n <= Math.round(value) ? "" : "text-cream-400"}`} filled strokeWidth={1} />
    ))}
  </span>
);

Stars.propTypes = { value: PropTypes.number.isRequired, className: PropTypes.string };

export default Stars;
