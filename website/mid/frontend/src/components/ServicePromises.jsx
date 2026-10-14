import { Link } from "react-router-dom";
import Icon from "./Icons";
import { SITE } from "../config/site";

const ServicePromises = () => {
  const items = [
    { icon: "truck", title: "Delivery & installation", text: "By our own team across Kolkata.", to: "/shipping-policy" },
    { icon: "ruler", title: "Custom sizes & fabrics", text: "Get any sofa or bed made to fit your room.", to: "/custom-furniture" },
    { icon: "shield", title: SITE.warrantyText.replace(/ against.*/, ""), text: "Against manufacturing defects.", to: "/warranty" },
    { icon: "wallet", title: "Cash, UPI & cards", text: SITE.emiAvailable ? "Easy EMI on credit cards." : "Pay on delivery or online.", to: "/faq" },
    { icon: "store", title: "Visit our showroom", text: `${SITE.address.line1}, ${SITE.address.locality}`, to: "/showroom" },
  ];

  return (
    <section aria-label="Why shop with us" className="border-y border-cream-300 bg-white">
      <div className="container-site no-scrollbar flex gap-6 overflow-x-auto py-6 lg:grid lg:grid-cols-5 lg:gap-4">
        {items.map((it) => (
          <Link key={it.title} to={it.to} className="flex min-w-[220px] items-start gap-3 lg:min-w-0">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-200 text-gold-800">
              <Icon name={it.icon} className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-medium text-stone-900">{it.title}</span>
              <span className="block text-xs text-stone-600">{it.text}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ServicePromises;
