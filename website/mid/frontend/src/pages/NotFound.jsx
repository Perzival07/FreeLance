import { Link } from "react-router-dom";
import useSeo from "../hooks/useSeo";
import { NAV_CATEGORIES } from "../config/site";

const NotFound = () => {
  useSeo({ title: "Page not found" });
  return (
    <div className="container-site py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-5xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-3 max-w-md text-stone-600">It may have moved or no longer exists. Try one of these instead:</p>
      <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
        {NAV_CATEGORIES.slice(0, 6).map((c) => (
          <Link key={c.label} to={`/collection?subCategory=${encodeURIComponent(c.subCategory)}`} className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm hover:border-stone-900">
            {c.label}
          </Link>
        ))}
      </div>
      <Link to="/" className="btn-primary mt-8">Back to home</Link>
    </div>
  );
};

export default NotFound;
