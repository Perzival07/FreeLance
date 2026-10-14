import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Accordion from "../components/Accordion";
import useSeo from "../hooks/useSeo";
import { FAQS } from "../config/policies";
import { faqSchema } from "../utils/schema";
import { SITE, whatsappLink } from "../config/site";

const Faq = () => {
  useSeo({ title: "FAQs", description: `Answers about delivery, custom furniture, payments, warranty and returns at ${SITE.name}.`, jsonLd: faqSchema(FAQS) });

  return (
    <>
      <PageHeader title="Frequently asked questions" subtitle="Can't find your answer? Call or WhatsApp us — we're happy to help." crumbs={[{ label: "FAQs" }]} />
      <div className="container-site grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
        <Accordion items={FAQS.map((f) => ({ title: f.q, content: f.a }))} defaultOpen={0} />
        <aside className="card h-fit p-6">
          <h2 className="text-2xl font-semibold">Still have questions?</h2>
          <p className="mt-2 text-sm text-stone-600">Talk to us directly.</p>
          <div className="mt-5 space-y-3">
            <a href={SITE.phoneHref} className="btn-outline w-full">Call {SITE.phone}</a>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">WhatsApp us</a>
            <Link to="/contact" className="btn-primary w-full">Send a message</Link>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Faq;
