import { Navigate, useParams } from "react-router-dom";
import { NAV_CATEGORIES, ROOMS } from "../config/site";
import { slugify } from "../utils/format";

// Friendly links like /collection/sofas or /collection/living-room
const CollectionAlias = () => {
  const { slug } = useParams();
  const type = NAV_CATEGORIES.find((c) => slugify(c.label) === slug || slugify(c.subCategory) === slug);
  if (type) return <Navigate to={`/collection?subCategory=${encodeURIComponent(type.subCategory)}`} replace />;
  const room = ROOMS.find((r) => slugify(r.label) === slug || slugify(r.category) === slug);
  if (room) return <Navigate to={`/collection?category=${encodeURIComponent(room.category)}`} replace />;
  return <Navigate to={`/collection?q=${encodeURIComponent(String(slug).replace(/-/g, " "))}`} replace />;
};

export default CollectionAlias;
