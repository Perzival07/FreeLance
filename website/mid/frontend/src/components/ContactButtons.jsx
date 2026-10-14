import { useLocation } from "react-router-dom";
import Icon, { WhatsAppIcon } from "./Icons";
import { SITE, whatsappLink } from "../config/site";

const WA_TEXT = "Hi Loknath Sofa Center, I'd like some help choosing furniture.";

// Call + WhatsApp: floating buttons on desktop, a bottom bar on phones.
// Checkout has neither (nothing should cover the pay button); product pages
// use their own bottom bar on phones, which already has call/WhatsApp.
const ContactButtons = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/place-order")) return null;
  const hasOwnMobileBar = pathname.startsWith("/product/");

  return (
    <>
      {/* Desktop / tablet landscape */}
      <div className="fixed bottom-5 right-5 z-30 hidden flex-col items-end gap-3 lg:flex">
        <a
          href={SITE.phoneHref}
          className="group flex h-14 min-w-14 items-center justify-center rounded-full bg-stone-900 px-4 text-white shadow-lg transition-colors hover:bg-gold-800"
          aria-label={`Call us on ${SITE.phone}`}
        >
          <Icon name="phone" className="h-6 w-6" />
          {/* collapsed: no width and no gap, so the button is a 56×56 circle */}
          <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-300 group-hover:ml-2 group-hover:max-w-[160px] group-focus-visible:ml-2 group-focus-visible:max-w-[160px]">
            {SITE.phone}
          </span>
        </a>
        <a
          href={whatsappLink(WA_TEXT)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Chat with us on WhatsApp"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>

      {/* Phones */}
      {!hasOwnMobileBar && (
        <>
          <div className="h-14 lg:hidden" aria-hidden="true" />
          <nav aria-label="Contact us" className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-2 border-t border-cream-300 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden">
            <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 text-sm font-medium text-stone-900 active:bg-cream-100">
              <Icon name="phone" className="h-5 w-5" /> Call us
            </a>
            <a
              href={whatsappLink(WA_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#1f8f4e] text-sm font-medium text-white active:bg-[#18733e]"
            >
              <WhatsAppIcon className="h-5 w-5" /> WhatsApp
            </a>
          </nav>
        </>
      )}
    </>
  );
};

export default ContactButtons;
