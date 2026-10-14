import { useLocation } from "react-router-dom";
import { WhatsAppIcon } from "./Icons";
import { whatsappLink } from "../config/site";

// Floating chat button; hidden on checkout so it doesn't cover the pay button
const WhatsAppButton = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/place-order") || pathname.startsWith("/product/")) return null;

  return (
    <a
      href={whatsappLink("Hi Loknath Sofa Center, I'd like some help choosing furniture.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      aria-label="Chat with us on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppButton;
