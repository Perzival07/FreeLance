import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import HeroCarousel from "../components/HeroCarousel";
import ServicePromises from "../components/ServicePromises";
import CategoryTiles from "../components/CategoryTiles";
import ProductRail from "../components/ProductRail";
import RoomTiles from "../components/RoomTiles";
import CustomBanner from "../components/CustomBanner";
import Testimonials from "../components/Testimonials";
import ShowroomBlock from "../components/ShowroomBlock";
import MaterialGuide from "../components/MaterialGuide";
import NewsletterBox from "../components/NewsletterBox";
import SectionHeading from "../components/SectionHeading";
import useSeo from "../hooks/useSeo";
import { localBusinessSchema } from "../utils/schema";
import { SITE } from "../config/site";

const TABS = [
  { key: "new", label: "New arrivals", params: { sort: "new" }, link: "/collection?sort=new" },
  { key: "best", label: "Bestsellers", params: { bestseller: "true" }, link: "/collection?sort=bestseller" },
  { key: "budget", label: "Under ₹10,000", params: { maxPrice: 10000, sort: "price-desc" }, link: "/collection?maxPrice=10000" },
];

const ProductTabs = () => {
  const { fetchProducts } = useContext(ShopContext);
  const [active, setActive] = useState(TABS[0].key);
  const [lists, setLists] = useState({});
  const tab = TABS.find((t) => t.key === active);

  useEffect(() => {
    if (lists[active]) return;
    let cancelled = false;
    fetchProducts({ ...tab.params, limit: 12 })
      .then(({ products }) => !cancelled && setLists((l) => ({ ...l, [active]: products })))
      .catch(() => !cancelled && setLists((l) => ({ ...l, [active]: [] })));
    return () => {
      cancelled = true;
    };
  }, [active, tab, lists, fetchProducts]);

  return (
    <section className="section container-site">
      <SectionHeading eyebrow="Our picks" title="Popular right now" link={tab.link} />
      <div className="no-scrollbar -mt-2 mb-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Product lists">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === active}
            onClick={() => setActive(t.key)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
              t.key === active ? "bg-stone-900 text-white" : "border border-stone-300 bg-white text-stone-700 hover:border-stone-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        <ProductRail products={lists[active] || []} loading={!lists[active]} label={tab.label} />
      </div>
    </section>
  );
};

const Home = () => {
  const { facets } = useContext(ShopContext);
  const imageFor = (sub) => facets.subCategories.find((s) => s.name === sub)?.image;

  useSeo({ jsonLd: localBusinessSchema() });

  const slides = [
    {
      eyebrow: `${SITE.name} · ${SITE.address.locality}`,
      title: "Sofas made for real homes",
      text: "Sofas, beds, wardrobes and dining sets — built to last, delivered and installed across Kolkata.",
      cta: { label: "Shop sofas", to: "/collection?subCategory=Sofas" },
      secondary: { label: "Visit the showroom", to: "/showroom" },
      image: assets.hero_img,
      imageSmall: assets.hero_img_sm,
      alt: "Brown fabric sofa in a bright living room",
    },
    imageFor("Beds") && {
      eyebrow: "Bedroom",
      title: "Beds & wardrobes for a calmer bedroom",
      text: "Solid wood and engineered wood beds, sliding and hinged wardrobes in every size.",
      cta: { label: "Shop bedroom", to: "/collection?category=Bedroom" },
      image: imageFor("Beds"),
      alt: "Wooden bed in a styled bedroom",
    },
    imageFor("Sofas") && {
      eyebrow: "Made to order",
      title: "Any size. Any fabric.",
      text: "Tell us your room size and favourite colour — we'll build a sofa that fits perfectly.",
      cta: { label: "Request a custom sofa", to: "/custom-furniture" },
      secondary: { label: "Book a showroom visit", to: "/book-visit" },
      image: imageFor("Sofas"),
      alt: "Sofa in a living room",
    },
  ].filter(Boolean);

  return (
    <>
      <HeroCarousel slides={slides} />
      <ServicePromises />
      <CategoryTiles />
      <ProductTabs />
      <RoomTiles />
      <CustomBanner />
      <Testimonials />
      <ShowroomBlock />
      <MaterialGuide />
      <NewsletterBox />
    </>
  );
};

export default Home;
