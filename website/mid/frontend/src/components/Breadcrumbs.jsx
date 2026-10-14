import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "./Icons";

const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-500">
    <ol className="flex flex-wrap items-center gap-1">
      <li>
        <Link to="/" className="hover:text-stone-900">Home</Link>
      </li>
      {items.map((item, i) => (
        <li key={item.label} className="flex items-center gap-1">
          <Icon name="chevronRight" className="h-3.5 w-3.5" />
          {item.to && i < items.length - 1 ? (
            <Link to={item.to} className="hover:text-stone-900">{item.label}</Link>
          ) : (
            <span className="text-stone-800" aria-current="page">{item.label}</span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, to: PropTypes.string })).isRequired,
};

export default Breadcrumbs;
