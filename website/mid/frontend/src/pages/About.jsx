import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import Icon from "../components/Icons";
import NewsletterBox from "../components/NewsletterBox";
import useSeo from "../hooks/useSeo";
import { assets } from "../assets/assets";
import { SITE } from "../config/site";

const REASONS = [
  { icon: "shield", title: "Quality you can check", text: "Solid wood, high-density foam and durable fabrics. Every piece is inspected before it leaves us — and you can test it yourself in the showroom first." },
  { icon: "ruler", title: "Made to fit your home", text: "Choose ready-made designs or ask for custom sizes, colours and upholstery. We'll help you measure." },
  { icon: "truck", title: "Delivered & installed", text: "Our own team delivers, carries and assembles your furniture — and is a phone call away for after-sales service." },
];

const About = () => {
  useSeo({ title: "About Us", description: `${SITE.name} is a family furniture store in Bidhan Park, Barasat, making and selling sofas, beds, wardrobes and custom furniture.` });

  return (
    <>
      <PageHeader title="About Loknath Sofa Center" crumbs={[{ label: "About us" }]} />
      <div className="container-site py-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <img src={assets.about_img} alt="Furniture workshop" className="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy" />
          <div className="space-y-4 text-stone-700">
            <p className="eyebrow">Our story</p>
            <h2 className="section-title">A local furniture store that treats every customer like family</h2>
            <p>
              {SITE.name} is your neighbourhood furniture store in {SITE.address.locality}
              {SITE.establishedYear ? `, serving families since ${SITE.establishedYear}` : ""}. We help turn houses into homes with furniture that is comfortable, durable and designed for the way Indian families live.
            </p>
            <p>
              Our showroom at {SITE.address.line1} has sofas, beds, wardrobes, dining sets, tables and storage on display — and if you don&apos;t find exactly what you want, we&apos;ll make it for you.
            </p>
            <p>
              <strong className="text-stone-900">Our promise:</strong> honest prices, clear information about materials and delivery, and support long after the sale.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/showroom" className="btn-primary">Visit the showroom</Link>
              <Link to="/collection" className="btn-outline">Browse furniture</Link>
            </div>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="section-title">Why choose us</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {REASONS.map((r) => (
              <div key={r.title} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-200 text-gold-800">
                  <Icon name={r.icon} />
                </span>
                <h3 className="mt-4 text-2xl font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{r.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <NewsletterBox />
    </>
  );
};

export default About;
