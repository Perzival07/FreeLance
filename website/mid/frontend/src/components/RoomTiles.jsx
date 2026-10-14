import { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { ROOMS } from "../config/site";
import { imageUrl } from "../utils/format";
import SectionHeading from "./SectionHeading";
import Icon from "./Icons";

const RoomTiles = () => {
  const { facets } = useContext(ShopContext);
  const byCat = new Map(facets.categories.map((c) => [c.name, c]));
  const photoFor = (room) =>
    facets.combos?.find((c) => c.category === room.category && c.subCategory === room.photoOf)?.image || byCat.get(room.category)?.image;

  return (
    <section className="section container-site">
      <SectionHeading eyebrow="Shop by room" title="Furnish one room at a time" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROOMS.map((r) => {
          const photo = photoFor(r);
          return (
            <Link key={r.label} to={`/collection?category=${encodeURIComponent(r.category)}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-cream-300">
                {photo && <img src={imageUrl(photo, 600)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <p className="mt-3 flex items-center gap-1 font-display text-2xl font-semibold text-stone-900 group-hover:text-gold-800">
                {r.label} <Icon name="arrowRight" className="h-4 w-4" />
              </p>
              <p className="text-sm text-stone-600">{r.blurb}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RoomTiles;
