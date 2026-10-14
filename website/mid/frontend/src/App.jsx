import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

// Pages other than Home load on demand to keep the first download small
const Collection = lazy(() => import("./pages/Collection"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Orders = lazy(() => import("./pages/Orders"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Profile = lazy(() => import("./pages/Profile"));
const Verify = lazy(() => import("./pages/Verify"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Showroom = lazy(() => import("./pages/Showroom"));
const BookVisit = lazy(() => import("./pages/BookVisit"));
const CustomFurniture = lazy(() => import("./pages/CustomFurniture"));
const BulkOrders = lazy(() => import("./pages/BulkOrders"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const Faq = lazy(() => import("./pages/Faq"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));

const POLICY_SLUGS = ["shipping-policy", "return-policy", "warranty", "terms", "care-guide", "privacy-policy"];

// Start each new page at the top (but keep position when only filters change)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow-lg">
        Skip to content
      </a>
      <ToastContainer position="bottom-center" autoClose={2500} hideProgressBar theme="light" />
      <ScrollToTop />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<div className="container-site py-20"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-900" aria-label="Loading" /></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/showroom" element={<Showroom />} />
          <Route path="/book-visit" element={<BookVisit />} />
          <Route path="/custom-furniture" element={<CustomFurniture />} />
          <Route path="/bulk-orders" element={<BulkOrders />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/faq" element={<Faq />} />
          {POLICY_SLUGS.map((slug) => (
            <Route key={slug} path={`/${slug}`} element={<PolicyPage slug={slug} />} />
          ))}
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default App;
