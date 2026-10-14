import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Accordion from "../components/Accordion";
import Icon, { WhatsAppIcon } from "../components/Icons";
import LeadForm from "../components/LeadForm";
import { HoursTable } from "../components/ShowroomBlock";
import useSeo from "../hooks/useSeo";
import { localBusinessSchema } from "../utils/schema";
import { NAV_CATEGORIES, SITE, fullAddress, whatsappLink } from "../config/site";
import { showroomStatus } from "../utils/format";
import { FAQS } from "../config/policies";
import { assets } from "../assets/assets";
import Stars from "../components/Stars";

const SHOWROOM_FAQ_QUESTIONS = ["Can I see the furniture before buying?", "Do you make furniture in custom sizes or fabrics?", "What payment methods do you accept?", "Which areas do you deliver to?"];

const Showroom = () => {
  const status = showroomStatus();
  const title = `Furniture Showroom in ${SITE.address.locality}, Kolkata`;
  useSeo({
    title,
    description: `Visit ${SITE.name} at ${fullAddress()}. Sofas, beds, wardrobes and custom furniture on display. Open daily — see timings, directions and book a visit.`,
    jsonLd: localBusinessSchema(),
  });

  return (
    <>
      <PageHeader title={`${SITE.name} — ${SITE.address.locality}`} subtitle="Our furniture showroom in Bidhan Park, Barasat. Come and sit on the sofas, feel the fabrics and talk to us about custom sizes." crumbs={[{ label: "Showroom" }]} />

      <div className="container-site py-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4">
            {SITE.showroomPhotos.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {SITE.showroomPhotos.map((src, i) => (
                  <img key={src} src={src} alt={`Inside ${SITE.name}, photo ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} className={`w-full rounded-xl object-cover ${i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`} />
                ))}
              </div>
            ) : (
              <img src={assets.hero_img} alt="Sofa in a bright living room" className="aspect-[16/10] w-full rounded-xl object-cover" />
            )}
            <div className="h-72 overflow-hidden rounded-xl border border-cream-300">
              <iframe src={SITE.mapsEmbedUrl} title={`Map showing ${SITE.name}`} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${status.open ? "bg-green-50 text-green-800" : "bg-cream-200 text-stone-700"}`}>
                <span className={`h-2 w-2 rounded-full ${status.open ? "bg-green-600" : "bg-stone-500"}`} aria-hidden="true" />
                {status.text}
              </p>
              <h2 className="mt-4 text-2xl font-semibold">Address</h2>
              <address className="mt-2 not-italic text-stone-700">
                {SITE.name}<br />
                {SITE.address.line1}, {SITE.address.locality}<br />
                {SITE.address.city} – {SITE.address.pincode}, {SITE.address.state}
              </address>
              {SITE.landmark && <p className="mt-1 text-sm text-stone-600">{SITE.landmark}</p>}
              <p className="mt-3 text-sm">
                <a href={`mailto:${SITE.email}`} className="link">{SITE.email}</a>
              </p>
              {SITE.googleRating && (
                <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 text-sm text-stone-700">
                  <Stars value={SITE.googleRating.value} /> {SITE.googleRating.value} on Google · {SITE.googleRating.count} reviews
                </a>
              )}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary col-span-2">
                  <Icon name="pin" className="h-4 w-4" /> Get directions
                </a>
                <a href={SITE.phoneHref} className="btn-outline"><Icon name="phone" className="h-4 w-4" /> Call</a>
                <a href={whatsappLink("Hi, I'd like to visit the showroom.")} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <WhatsAppIcon className="h-4 w-4 text-[#1f8f4e]" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="mb-3 text-2xl font-semibold">Opening hours</h2>
              <HoursTable />
            </div>

            <div className="card p-6">
              <h2 className="mb-3 text-2xl font-semibold">At the showroom</h2>
              <ul className="space-y-2 text-sm text-stone-700">
                {SITE.showroomAmenities.map((a) => (
                  <li key={a} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="section-title">On display</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {NAV_CATEGORIES.map((c) => (
              <Link key={c.label} to={`/collection?subCategory=${encodeURIComponent(c.subCategory)}`} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm hover:border-stone-900">
                {c.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">Book a visit</h2>
            <p className="mb-6 mt-2 text-stone-600">Walk-ins are always welcome. Book a time if you&apos;d like us to keep a specific piece ready or to discuss a custom order.</p>
            <LeadForm type="visit" fields={["purpose", "preferredDate", "preferredTime", "message"]} submitLabel="Book my visit" messageLabel="What are you looking for? (optional)" />
          </div>
          <div>
            <h2 className="section-title">Areas we deliver to</h2>
            <p className="mt-2 text-stone-600">Delivered and installed by our own team across North 24 Parganas and Kolkata:</p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-stone-700">
              {SITE.deliveryAreas.map((a) => (
                <li key={a} className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4 text-gold-800" /> {a}</li>
              ))}
            </ul>
            <h2 className="section-title mt-10">Good to know</h2>
            <div className="mt-4">
              <Accordion items={FAQS.filter((f) => SHOWROOM_FAQ_QUESTIONS.includes(f.q)).map((f) => ({ title: f.q, content: f.a }))} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Showroom;
