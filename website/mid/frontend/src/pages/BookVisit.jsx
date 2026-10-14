import PageHeader from "../components/PageHeader";
import LeadForm from "../components/LeadForm";
import Icon from "../components/Icons";
import { HoursTable } from "../components/ShowroomBlock";
import useSeo from "../hooks/useSeo";
import { SITE, fullAddress } from "../config/site";

const BookVisit = () => {
  useSeo({ title: "Book a Showroom Visit or Design Consultation", description: `Book a visit or a free design consultation at ${SITE.name}, ${SITE.address.locality}. Pick a date and time and we'll keep pieces ready for you.` });

  return (
    <>
      <PageHeader title="Book a visit or free design consultation" subtitle="Pick a date and time. We'll call to confirm, keep the pieces you're interested in ready, and help plan your room — free of charge." crumbs={[{ label: "Showroom", to: "/showroom" }, { label: "Book a visit" }]} />
      <div className="container-site grid gap-10 py-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="card p-6 sm:p-8">
          <LeadForm type="visit" fields={["purpose", "preferredDate", "preferredTime", "message"]} submitLabel="Book my visit" messageLabel="What are you looking for? (optional)" messagePlaceholder="e.g. 3-seater sofa in grey, king-size bed" />
        </div>
        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold">Where</h2>
            <p className="mt-2 flex gap-2 text-sm text-stone-700"><Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-gold-800" /> {fullAddress()}</p>
            <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-block text-sm">Get directions</a>
          </div>
          <div className="card p-6">
            <h2 className="mb-3 text-2xl font-semibold">When we&apos;re open</h2>
            <HoursTable />
          </div>
        </aside>
      </div>
    </>
  );
};

export default BookVisit;
