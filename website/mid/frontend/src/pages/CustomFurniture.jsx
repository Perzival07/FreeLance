import PageHeader from "../components/PageHeader";
import LeadForm from "../components/LeadForm";
import Icon, { WhatsAppIcon } from "../components/Icons";
import useSeo from "../hooks/useSeo";
import { SITE, whatsappLink } from "../config/site";

const STEPS = [
  { icon: "ruler", title: "Tell us what you need", text: "Share the size, style and a reference photo — or visit the showroom." },
  { icon: "sofa", title: "Choose fabric & finish", text: "Pick from fabric, leatherette and wood finish samples." },
  { icon: "wallet", title: "Get a clear quote", text: "We confirm the price and delivery date before we start." },
  { icon: "truck", title: "Made & installed", text: "Built to order and installed at your home by our team." },
];

const CustomFurniture = () => {
  useSeo({ title: "Custom Furniture in Kolkata", description: `Made-to-order sofas, beds, wardrobes and TV units in your size, fabric and finish — ${SITE.name}, ${SITE.address.locality}.` });

  return (
    <>
      <PageHeader title="Custom furniture, made to fit" subtitle="Sofas, beds, wardrobes, TV units and more in the exact size, fabric and finish you want." crumbs={[{ label: "Custom furniture" }]} />
      <div className="container-site py-10">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-200 text-gold-800">
                <Icon name={s.icon} />
              </span>
              <p className="mt-4 text-xs font-medium text-stone-500">Step {i + 1}</p>
              <h2 className="text-2xl font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-stone-600">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-6 sm:p-8">
            <h2 className="section-title">Request a quote</h2>
            <p className="mb-6 mt-2 text-stone-600">Describe the piece and we&apos;ll call you back with options and a price.</p>
            <LeadForm
              type="custom"
              fields={["email", "budget", "message"]}
              submitLabel="Request a quote"
              messageRequired
              messageLabel="What would you like made? *"
              messagePlaceholder="e.g. L-shaped sofa, 9 ft × 6 ft, dark grey fabric, wooden legs"
            />
          </div>
          <aside className="space-y-6">
            <div className="rounded-xl bg-[#e8f5ec] p-6">
              <h2 className="text-2xl font-semibold">Have a photo?</h2>
              <p className="mt-2 text-sm text-stone-700">The quickest way is to send a picture of what you like with your room measurements on WhatsApp.</p>
              <a href={whatsappLink("Hi, I'd like a custom piece made. Sending a photo and measurements.")} target="_blank" rel="noopener noreferrer" className="btn-whatsapp mt-4">
                <WhatsAppIcon className="h-4 w-4" /> Send on WhatsApp
              </a>
            </div>
            <div className="card p-6">
              <h2 className="text-2xl font-semibold">Good to know</h2>
              <ul className="mt-3 space-y-2 text-sm text-stone-700">
                <li>• Custom pieces usually take 2–4 weeks.</li>
                <li>• An advance may be needed to start work — we&apos;ll explain when we quote.</li>
                <li>• Custom-made items can&apos;t be returned, so we confirm every detail with you first.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default CustomFurniture;
