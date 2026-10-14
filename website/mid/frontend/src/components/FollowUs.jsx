import Icon from "./Icons";
import { SITE } from "../config/site";

// Shown only when an Instagram link is set in config/site.js
const FollowUs = () => {
  if (!SITE.social.instagram) return null;
  const handle = SITE.social.instagram.replace(/\/+$/, "").split("/").pop();
  return (
    <section className="container-site pb-4">
      <a
        href={SITE.social.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-between gap-4 rounded-xl border border-cream-300 bg-white p-6 text-center sm:flex-row sm:text-left"
      >
        <span className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
            <Icon name="instagram" className="h-6 w-6" />
          </span>
          <span>
            <span className="block font-display text-2xl font-semibold text-stone-900">Follow us on Instagram</span>
            <span className="text-sm text-stone-600">New arrivals, customer homes and behind-the-scenes from the workshop · @{handle}</span>
          </span>
        </span>
        <span className="btn-outline">Follow @{handle}</span>
      </a>
    </section>
  );
};

export default FollowUs;
