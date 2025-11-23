import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  List,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/add-institute", label: "Add Institute", icon: Building2 },
    { to: "/dashboard/institutes", label: "Institute List", icon: List },
  ];

  return (
    <>
      {/* Toggle Button - Only visible when sidebar is CLOSED */}
      {!open && (
        <button
          className="lg:hidden fixed top-3 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition"
          onClick={() => setOpen(true)}
        >
          <Menu size={22} className="text-blue-700" />
        </button>
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 w-72 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out z-40 flex flex-col
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Close Button *Inside Sidebar* (Mobile Only) */}
        {open && (
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden absolute top-3 right-3 p-2 rounded-full bg-white shadow border border-gray-300 hover:bg-gray-100 transition z-50"
          >
            <X size={20} className="text-blue-700" />
          </button>
        )}

        {/* Logo */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-700 to-blue-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-blue-800 font-bold text-lg">★</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-none">
                Admin Portal
              </h2>
              <p className="text-blue-100 text-xs font-medium leading-none">
                Blockchain System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center justify-between px-4 py-3 rounded-xl font-medium transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <link.icon
                      size={20}
                      className={`${
                        isActive
                          ? "text-blue-700"
                          : "text-gray-500 group-hover:text-blue-600"
                      }`}
                    />
                    <span>{link.label}</span>
                  </div>
                  {isActive && (
                    <ChevronRight size={18} className="text-blue-600" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">v2.4.1 • Secure Session</p>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
