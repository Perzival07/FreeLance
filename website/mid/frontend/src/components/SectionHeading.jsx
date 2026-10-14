import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "./Icons";

const SectionHeading = ({ eyebrow, title, subtitle, link, linkLabel = "View all", align = "left" }) => (
  <div className={`mb-8 flex flex-col gap-3 sm:flex-row sm:items-end ${align === "center" ? "items-center text-center sm:flex-col sm:items-center" : "sm:justify-between"}`}>
    <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="mt-2 text-stone-600">{subtitle}</p>}
    </div>
    {link && (
      <Link to={link} className="flex shrink-0 items-center gap-1 text-sm font-medium text-stone-900 hover:text-gold-800">
        {linkLabel} <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    )}
  </div>
);

SectionHeading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  link: PropTypes.string,
  linkLabel: PropTypes.string,
  align: PropTypes.oneOf(["left", "center"]),
};

export default SectionHeading;
