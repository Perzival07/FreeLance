import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Icon, { WhatsAppIcon } from "../components/Icons";
import useSeo from "../hooks/useSeo";
import { SITE, whatsappLink } from "../config/site";

const ROLES = [
  { icon: "store", title: "Showroom sales", text: "Help customers choose furniture, explain fabrics and sizes, and take orders." },
  { icon: "truck", title: "Delivery & installation", text: "Deliver, carry and assemble furniture in customers' homes across Kolkata." },
  { icon: "ruler", title: "Carpentry & upholstery", text: "Build, repair and upholster sofas, beds and custom pieces." },
];

const Careers = () => {
  useSeo({ title: "Careers", description: `Work with ${SITE.name} in Barasat — sales, delivery, carpentry and upholstery roles.` });
  const subject = encodeURIComponent("Job application");

  return (
    <>
      <PageHeader title="Work with us" subtitle={`${SITE.name} is a local team in ${SITE.address.locality}. We're always happy to hear from people who care about good furniture and good service.`} crumbs={[{ label: "Careers" }]} />
      <div className="container-site py-10">
        <h2 className="section-title">Kinds of work we do</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-200 text-gold-800">
                <Icon name={r.icon} />
              </span>
              <h3 className="mt-4 text-2xl font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-stone-600">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="card mt-10 p-6 sm:p-8">
          <h2 className="section-title">How to apply</h2>
          <p className="mt-2 max-w-2xl text-stone-600">
            Send your name, phone number, the kind of work you&apos;re looking for and your experience. You can also drop in at the{" "}
            <Link to="/showroom" className="link">showroom</Link> during opening hours.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${SITE.email}?subject=${subject}`} className="btn-primary">
              <Icon name="mail" className="h-4 w-4" /> Email us
            </a>
            <a href={whatsappLink("Hi, I'd like to apply for a job at Loknath Sofa Center.")} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <WhatsAppIcon className="h-4 w-4 text-[#1f8f4e]" /> Apply on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Careers;
