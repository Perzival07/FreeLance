import PropTypes from "prop-types";
import PageHeader from "../components/PageHeader";
import useSeo from "../hooks/useSeo";
import { LAST_UPDATED, POLICIES } from "../config/policies";

const PolicyPage = ({ slug }) => {
  const policy = POLICIES[slug];
  useSeo({ title: policy.title, description: policy.description });

  return (
    <>
      <PageHeader title={policy.title} crumbs={[{ label: "Help", to: "/faq" }, { label: policy.title }]} />
      <div className="container-site py-10">
        <article className="prose-site max-w-3xl">
          <p className="text-sm text-stone-500">Last updated: {LAST_UPDATED}</p>
          {policy.body}
        </article>
      </div>
    </>
  );
};

PolicyPage.propTypes = { slug: PropTypes.oneOf(Object.keys(POLICIES)).isRequired };

export default PolicyPage;
