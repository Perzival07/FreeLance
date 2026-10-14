import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import LeadForm from "../components/LeadForm";
import Icon, { WhatsAppIcon } from "../components/Icons";
import { HoursTable } from "../components/ShowroomBlock";
import useSeo from "../hooks/useSeo";
import { SITE, fullAddress, whatsappLink } from "../config/site";

const Contact = () => {
  useSeo({ title: "Contact Us", description: `Call, WhatsApp, email or visit ${SITE.name} at ${fullAddress()}.` });

  const channels = [
    { icon: "phone", label: "Call us", value: SITE.phone, href: SITE.phoneHref },
    { icon: "mail", label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: "pin", label: "Visit", value: fullAddress(), href: SITE.mapsUrl, external: true },
  ];

  return (
    <>
      <PageHeader title="Contact us" subtitle="Questions about a product, an order or a custom piece? We usually reply within a few hours during opening times." crumbs={[{ label: "Contact" }]} />
      <div className="container-site grid gap-10 py-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-6">
          <a href={whatsappLink("Hi Loknath Sofa Center, I have a question.")} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl bg-[#e8f5ec] p-5 hover:bg-[#dcefe2]">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f8f4e] text-white">
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-medium text-stone-900">Chat on WhatsApp</span>
              <span className="text-sm text-stone-600">Fastest way to reach us — send photos too</span>
            </span>
          </a>
          {channels.map((c) => (
            <a key={c.label} href={c.href} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener noreferrer" : undefined} className="card flex items-start gap-4 p-5 hover:border-stone-400">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-200 text-gold-800">
                <Icon name={c.icon} />
              </span>
              <span>
                <span className="block text-sm text-stone-500">{c.label}</span>
                <span className="break-words text-stone-900">{c.value}</span>
              </span>
            </a>
          ))}
          <div className="card p-5">
            <h2 className="mb-3 text-2xl font-semibold">Opening hours</h2>
            <HoursTable />
          </div>
        </div>

        <div className="card h-fit p-6 sm:p-8">
          <h2 className="section-title">Request a call back</h2>
          <p className="mb-6 mt-2 text-stone-600">Leave your number and we&apos;ll call you. For order questions, include your order ID.</p>
          <LeadForm type="callback" fields={["email", "preferredTime", "message"]} submitLabel="Request a call back" messageLabel="How can we help?" />
          <p className="mt-6 text-sm text-stone-600">
            Looking for something specific? See our <Link to="/faq" className="link">FAQs</Link>, <Link to="/custom-furniture" className="link">custom furniture</Link> or <Link to="/track-order" className="link">track your order</Link>.
          </p>
        </div>
      </div>
    </>
  );
};

export default Contact;
