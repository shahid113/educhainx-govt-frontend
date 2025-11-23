import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
  Bell,
  User,
  LogOut,
  Settings,
  Shield,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Right Items */}
          <div className="flex items-center space-x-3 sm:space-x-4 ml-auto">

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition">
              <Bell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {/* Settings (Hidden on mobile) */}
            <button className="hidden sm:block p-2 text-gray-600 hover:text-blue-700 hover:bg-gray-100 rounded-lg transition">
              <Settings size={20} />
            </button>

            {/* User Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition">
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>

                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                <ChevronDown
                  size={16}
                  className="hidden sm:block text-gray-500 group-hover:text-blue-700 transition"
                />
              </button>

              {/* Hover menu */}
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="py-1">
                  <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <User size={16} className="mr-2 text-gray-500" />
                    Profile
                  </a>

                  <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                    <Shield size={16} className="mr-2 text-gray-500" />
                    Security Settings
                  </a>

                  <hr className="my-1 border-gray-200" />

                  <button
                    onClick={logoutUser}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Logout */}
            <button
              onClick={logoutUser}
              className="sm:hidden p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
