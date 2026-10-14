import { Link } from "react-router-dom";
import { SITE, fullAddress } from "./site";

// Policy pages. TODO(owner): review every policy before going live — they are commitments to customers.
// Update LAST_UPDATED whenever the wording changes.
export const LAST_UPDATED = "15 October 2026";

const Contact = () => (
  <p>
    Questions? Call <a href={SITE.phoneHref} className="link">{SITE.phone}</a>, email{" "}
    <a href={`mailto:${SITE.email}`} className="link">{SITE.email}</a> or visit us at {fullAddress()}.
  </p>
);

export const POLICIES = {
  "shipping-policy": {
    title: "Shipping & Delivery",
    description: `How ${SITE.name} delivers and installs furniture across Barasat and Kolkata, delivery charges and timelines.`,
    body: (
      <>
        <h2>Where we deliver</h2>
        <p>We deliver with our own team across Barasat and greater Kolkata, including {SITE.deliveryAreas.join(", ")}. For other locations, call or WhatsApp us before ordering.</p>

        <h2>Delivery charges</h2>
        <p>Delivery, carrying and installation are charged by distance from our showroom. Extra charges apply for upper floors without a lift, dismantling old furniture and extra packing. The exact charge is calculated and shown at checkout before you pay — there are no hidden costs.</p>

        <h2>Delivery time</h2>
        <ul>
          <li>In-stock items: usually 3–7 days.</li>
          <li>Made-to-order and custom pieces: we confirm the date when you order (typically 2–4 weeks).</li>
          <li>We call you a day before delivery to fix a convenient time slot.</li>
        </ul>

        <h2>Installation</h2>
        <p>Our team carries the furniture to your room, assembles it and removes the packing material. Please check the space and door widths before ordering large pieces — our specifications list exact dimensions, and we&apos;re happy to help you measure.</p>

        <h2>At delivery</h2>
        <p>Please inspect the furniture while our team is present. If anything is damaged, note it on the delivery slip and tell us — see our <Link to="/return-policy" className="link">return policy</Link>.</p>
        <Contact />
      </>
    ),
  },

  "return-policy": {
    title: "Returns, Refunds & Cancellation",
    description: `Cancellation, return, replacement and refund policy of ${SITE.name}.`,
    body: (
      <>
        <h2>Cancelling an order</h2>
        <p>You can cancel free of charge from <Link to="/orders" className="link">My Orders</Link> while the order is &quot;Order Placed&quot; or &quot;Packing&quot;. Once an order has shipped it can&apos;t be cancelled online — call us and we&apos;ll help.</p>

        <h2>Damaged or defective items</h2>
        <p>If your furniture arrives damaged or has a manufacturing defect, tell us within {SITE.returnWindowDays} days of delivery with photos. We will repair it at your home or replace it, at no cost to you.</p>

        <h2>What can&apos;t be returned</h2>
        <ul>
          <li>Custom-made or made-to-order furniture (made to your size, fabric or finish).</li>
          <li>Furniture that has been used, altered or damaged after delivery.</li>
          <li>Change of mind after delivery and installation, except where required by law.</li>
        </ul>

        <h2>Refunds</h2>
        <p>Approved refunds for online payments go back to the original payment method within 7–10 working days. Cash-on-delivery refunds are paid by bank transfer or UPI.</p>
        <Contact />
      </>
    ),
  },

  warranty: {
    title: "Warranty",
    description: `Warranty cover on furniture bought from ${SITE.name}.`,
    body: (
      <>
        <h2>What&apos;s covered</h2>
        <p>Every piece comes with a {SITE.warrantyText}, unless a different warranty is listed on the product page. This covers the frame, joinery, springs and mechanisms under normal home use.</p>

        <h2>What isn&apos;t covered</h2>
        <ul>
          <li>Normal wear and tear, fading from sunlight and natural changes in wood colour or grain.</li>
          <li>Damage from water, termites in damp walls, misuse, or moving the furniture yourself.</li>
          <li>Fabric stains, tears, scratches and burns.</li>
          <li>Repairs or alterations done by anyone other than us.</li>
        </ul>

        <h2>How to claim</h2>
        <p>Call or WhatsApp us with your order number and photos of the problem. We&apos;ll inspect it and repair or replace the part — at your home wherever possible.</p>
        <Contact />
      </>
    ),
  },

  terms: {
    title: "Terms & Conditions",
    description: `Terms of use and sale for ${SITE.name}.`,
    body: (
      <>
        <h2>About these terms</h2>
        <p>These terms apply when you use this website or buy from {SITE.name}, {fullAddress()}. By placing an order you agree to them.</p>

        <h2>Products and prices</h2>
        <ul>
          <li>Prices are in Indian Rupees and include applicable taxes. Delivery is charged separately at checkout.</li>
          <li>Wood grain, fabric shades and finishes can vary slightly from photos — that&apos;s natural for handcrafted furniture.</li>
          <li>Dimensions may vary by up to 2–3 cm.</li>
          <li>If a price is shown incorrectly by mistake, we&apos;ll contact you before processing the order and you may cancel for a full refund.</li>
        </ul>

        <h2>Orders and payment</h2>
        <p>Your order is confirmed once we accept it and, for online payments, once payment succeeds. We accept cash on delivery, UPI and online payments through secure payment gateways. We never see or store your card details.</p>

        <h2>Delivery, returns and warranty</h2>
        <p>See our <Link to="/shipping-policy" className="link">shipping policy</Link>, <Link to="/return-policy" className="link">return policy</Link> and <Link to="/warranty" className="link">warranty</Link>.</p>

        <h2>Accounts</h2>
        <p>Keep your password private. You are responsible for orders placed from your account.</p>

        <h2>Disputes</h2>
        <p>These terms are governed by Indian law. Courts in Kolkata, West Bengal have jurisdiction.</p>
        <Contact />
      </>
    ),
  },

  "care-guide": {
    title: "Furniture Care Guide",
    description: "How to look after wooden, fabric and leatherette furniture in Kolkata's climate.",
    body: (
      <>
        <h2>Wooden furniture</h2>
        <ul>
          <li>Dust weekly with a soft, dry cloth. Wipe spills immediately.</li>
          <li>Keep at least 2–3 inches from walls, especially in the monsoon, so damp doesn&apos;t reach the wood.</li>
          <li>Avoid direct sunlight and placing hot cups directly on the surface — use coasters and mats.</li>
          <li>Polish solid wood every 6–12 months with a wax or wood polish.</li>
        </ul>

        <h2>Fabric sofas</h2>
        <ul>
          <li>Vacuum cushions and corners every week.</li>
          <li>Flip and rotate seat cushions regularly so they wear evenly.</li>
          <li>Blot (don&apos;t rub) spills with a clean cloth and a little mild soapy water.</li>
          <li>Keep away from strong sunlight to prevent fading.</li>
        </ul>

        <h2>Leatherette</h2>
        <ul>
          <li>Wipe with a damp cloth and dry immediately.</li>
          <li>Avoid harsh chemicals, alcohol-based cleaners and sharp objects.</li>
          <li>Keep away from heaters and direct sunlight to prevent cracking.</li>
        </ul>

        <h2>Mattresses and beds</h2>
        <ul>
          <li>Rotate the mattress every 3 months.</li>
          <li>Use a mattress protector and air the room regularly during humid months.</li>
        </ul>
        <p>Need a repair or polish? <Link to="/contact" className="link">Get in touch</Link> — we service furniture we&apos;ve sold.</p>
      </>
    ),
  },

  "privacy-policy": {
    title: "Privacy Policy",
    description: `How ${SITE.name} collects, uses and protects your personal information.`,
    body: (
      <>
        <p>This policy explains how {SITE.name} (&quot;we&quot;, &quot;us&quot;) collects, uses and protects your personal information, in line with the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>

        <h2>1. Information we collect</h2>
        <ul>
          <li><strong>Identity and contact details:</strong> name, phone number, email address and delivery address.</li>
          <li><strong>Orders:</strong> the products you buy, delivery details and order history.</li>
          <li><strong>Enquiries:</strong> details you send through our visit-booking, custom-order, call-back and contact forms.</li>
          <li><strong>Newsletter:</strong> your email address if you subscribe. You can unsubscribe at any time.</li>
          <li><strong>On your device:</strong> we store your login session, cart (if you aren&apos;t logged in), recent searches and recently viewed products in your browser so the site works. We don&apos;t use advertising trackers.</li>
        </ul>

        <h2>2. Payment details</h2>
        <p>We do not store any card, UPI or bank details. Online payments are handled by secure, encrypted payment gateways (such as Razorpay); we never see your card number.</p>

        <h2>3. How we use your information</h2>
        <ul>
          <li>To process, deliver and install your orders.</li>
          <li>To reply to your enquiries and book showroom visits.</li>
          <li>To provide after-sales support and warranty service.</li>
          <li>To send offers and new arrivals, only if you subscribed.</li>
          <li>To meet GST and other legal requirements.</li>
        </ul>

        <h2>4. Sharing and security</h2>
        <p>We never sell, rent or trade your personal information. We share only what is needed with service providers who help us run the business — payment gateways, email delivery and, where used, delivery partners. We follow reasonable security practices under Section 43A of the IT Act.</p>

        <h2>5. Your rights</h2>
        <ul>
          <li>Ask for a copy of the personal data we hold about you.</li>
          <li>Ask us to correct inaccurate information.</li>
          <li>Ask us to delete your data, subject to tax and legal record-keeping requirements.</li>
        </ul>

        <h2>6. Grievance officer</h2>
        <p>
          Contact our grievance officer at {fullAddress()} · <a href={`mailto:${SITE.email}`} className="link">{SITE.email}</a> · {SITE.phone}. We acknowledge grievances within 24 hours and aim to resolve them within 15 working days.
        </p>
      </>
    ),
  },
};

export const FAQS = [
  {
    q: "Can I see the furniture before buying?",
    a: `Yes. Our showroom at ${fullAddress()} has the range on display. No appointment is needed, but you can book a visit if you'd like us to keep time for you.`,
  },
  {
    q: "Do you make furniture in custom sizes or fabrics?",
    a: "Yes. Most sofas, beds, wardrobes and TV units can be made to your size, fabric and finish. Send us a photo or measurements through the custom furniture page or WhatsApp for a quote.",
  },
  {
    q: "How much is delivery and how long does it take?",
    a: "Delivery and installation are charged by distance and floor; you see the exact amount at checkout. In-stock items are usually delivered in 3–7 days within Kolkata; custom pieces take longer and we confirm the date with you.",
  },
  {
    q: "Which areas do you deliver to?",
    a: `${SITE.deliveryAreas.join(", ")} and nearby areas. For other locations, please call or WhatsApp us.`,
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on delivery, UPI and secure online payment. At the showroom we also accept cards.",
  },
  {
    q: "Is there a warranty?",
    a: `Yes — a ${SITE.warrantyText}, unless a different warranty is listed on the product page.`,
  },
  {
    q: "Can I cancel or return my order?",
    a: `You can cancel free of charge before the order ships. Damaged or defective items reported within ${SITE.returnWindowDays} days of delivery are repaired or replaced. Custom-made pieces can't be returned.`,
  },
  {
    q: "Do you take bulk orders for offices, hotels or cafés?",
    a: "Yes. Tell us what you need on the bulk orders page and we'll send a quote.",
  },
  {
    q: "How do I track my order?",
    a: "Log in and open My Orders, or use Track Order with your order ID and the phone number used at checkout.",
  },
];
