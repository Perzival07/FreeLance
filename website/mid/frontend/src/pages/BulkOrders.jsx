import PageHeader from "../components/PageHeader";
import LeadForm from "../components/LeadForm";
import Icon from "../components/Icons";
import useSeo from "../hooks/useSeo";
import { SITE } from "../config/site";

const BulkOrders = () => {
  useSeo({ title: "Bulk & Corporate Furniture Orders", description: `Furniture for offices, hotels, cafés, hostels and rental flats — bulk orders from ${SITE.name}, Kolkata.` });

  return (
    <>
      <PageHeader title="Bulk & corporate orders" subtitle="Furnishing an office, café, hotel, hostel or a set of rental flats? Get a single quote for everything." crumbs={[{ label: "Bulk orders" }]} />
      <div className="container-site grid gap-10 py-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="section-title">Why order with us</h2>
          <ul className="mt-5 space-y-4">
            {[
              ["wallet", "Volume pricing", "Better rates for larger quantities."],
              ["ruler", "Custom sizes and branding colours", "Built to your floor plan and colour scheme."],
              ["truck", "Scheduled delivery & installation", "Delivered in phases to fit your fit-out timeline."],
              ["shield", "After-sales support", "Repairs and replacements handled locally."],
            ].map(([icon, title, text]) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-200 text-gold-800">
                  <Icon name={icon} />
                </span>
                <span>
                  <span className="block font-medium text-stone-900">{title}</span>
                  <span className="text-sm text-stone-600">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6 sm:p-8">
          <h2 className="section-title">Ask for a quote</h2>
          <p className="mb-6 mt-2 text-stone-600">Tell us what you need and roughly how many pieces.</p>
          <LeadForm type="bulk" fields={["email", "budget", "message"]} submitLabel="Request a quote" messageRequired messageLabel="Requirements *" messagePlaceholder="e.g. 20 office chairs, 10 desks, delivery in Salt Lake by next month" />
        </div>
      </div>
    </>
  );
};

export default BulkOrders;
