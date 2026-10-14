import PropTypes from "prop-types";

// Native <details> — accessible and works without JS state
const Accordion = ({ items, defaultOpen = -1 }) => (
  <div className="divide-y divide-cream-300 border-y border-cream-300">
    {items.map((item, i) => (
      <details key={item.title} className="group" open={i === defaultOpen}>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-stone-900 [&::-webkit-details-marker]:hidden">
          {item.title}
          <span className="text-xl leading-none text-stone-500 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <div className="pb-5 text-sm leading-relaxed text-stone-700">{item.content}</div>
      </details>
    ))}
  </div>
);

Accordion.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, content: PropTypes.node.isRequired })).isRequired,
  defaultOpen: PropTypes.number,
};

export default Accordion;
