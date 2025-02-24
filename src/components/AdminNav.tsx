import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Wrench,
  FileText,
  Bell
} from "lucide-react";

const AdminNav = () => {
  const navItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      title: "Services",
      path: "/admin/services",
      icon: <Wrench className="w-5 h-5" />
    },
    {
      title: "Customers",
      path: "/admin/customers",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Reports",
      path: "/admin/reports",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Notifications",
      path: "/admin/notifications",
      icon: <Bell className="w-5 h-5" />
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: <Settings className="w-5 h-5" />
    }
  ];

  return (
    <nav className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-0 p-4">
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-bold text-primary">Admin Portal</h1>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center space-x-3 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNav; 