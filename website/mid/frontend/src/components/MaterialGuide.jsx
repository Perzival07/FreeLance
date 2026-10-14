import { Link } from "react-router-dom";
import { MATERIALS } from "../config/site";
import SectionHeading from "./SectionHeading";

const MaterialGuide = () => (
  <section className="section container-site">
    <SectionHeading eyebrow="Buying guide" title="Know your materials" subtitle="Quick notes to help you choose furniture that suits your home and the Kolkata weather." link="/care-guide" linkLabel="Care guide" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {MATERIALS.map((m) => (
        <div key={m.name} className="card p-6">
          <h3 className="text-2xl font-semibold">{m.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{m.text}</p>
          {m.link && (
            <Link to={m.link} className="link mt-3 inline-block text-sm">
              Shop {m.name.toLowerCase()}
            </Link>
          )}
        </div>
      ))}
    </div>
  </section>
);

export default MaterialGuide;
