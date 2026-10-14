import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";

const PageHeader = ({ title, subtitle, crumbs }) => (
  <div className="border-b border-cream-300 bg-cream-200/60">
    <div className="container-site py-8 sm:py-10">
      <Breadcrumbs items={crumbs || [{ label: title }]} />
      <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-stone-600">{subtitle}</p>}
    </div>
  </div>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  crumbs: PropTypes.array,
};

export default PageHeader;
