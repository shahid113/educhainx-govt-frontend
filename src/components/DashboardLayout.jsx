
import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
export default function DashboardLayout() {
    return (
   <div className="flex h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800">
      {/* Sidebar */}
       <Sidebar/>

      {/* Main Body */}
      <div className="flex-1 flex flex-col overflow-y-auto p-5">
         <Navbar/>

        {/* Content */}
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
    )
}