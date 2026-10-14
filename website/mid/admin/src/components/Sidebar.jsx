import { NavLink } from "react-router-dom";
import { FiGrid, FiPlusSquare, FiList, FiPackage, FiInbox, FiStar, FiUsers } from "react-icons/fi";

const LINKS = [
  { to: "/", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/add", label: "Add product", icon: FiPlusSquare },
  { to: "/list", label: "Products", icon: FiList },
  { to: "/orders", label: "Orders", icon: FiPackage },
  { to: "/enquiries", label: "Enquiries", icon: FiInbox },
  { to: "/reviews", label: "Reviews", icon: FiStar },
  { to: "/customers", label: "Customers", icon: FiUsers },
];

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
      isActive ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-cream-200 hover:text-stone-900"
    }`;

  return (
    <nav aria-label="Admin" className="min-h-[calc(100vh-4rem)] shrink-0 border-r border-cream-300 bg-white md:w-56">
      <div className="sticky top-16 flex flex-col gap-1 p-2 md:p-4">
        <p className="mb-2 hidden px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500 md:block">Menu</p>
        {LINKS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={linkClass} title={label}>
            <Icon className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
