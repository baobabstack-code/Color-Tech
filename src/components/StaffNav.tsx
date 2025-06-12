import Link from "next/link";
import { 
  LayoutDashboard, 
  Calendar, 
  CheckSquare,
  FileText,
  User,
  Settings,
  Users,
  Wrench,
  Bell
} from "lucide-react";

const StaffNav = () => {
  const navItems = [
    {
      title: "Dashboard",
      path: "/staff/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      title: "Tasks",
      path: "/staff/tasks",
      icon: <CheckSquare className="w-5 h-5" />
    },
    {
      title: "Schedule",
      path: "/staff/schedule",
      icon: <Calendar className="w-5 h-5" />
    },
    {
      title: "Customers",
      path: "/staff/customers",
      icon: <Users className="w-5 h-5" />
    },
    {
      title: "Services",
      path: "/staff/services",
      icon: <Wrench className="w-5 h-5" />
    },
    {
      title: "Reports",
      path: "/staff/reports",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Notifications",
      path: "/staff/notifications",
      icon: <Bell className="w-5 h-5" />
    },
    {
      title: "Settings",
      path: "/staff/settings",
      icon: <Settings className="w-5 h-5" />
    },
    {
      title: "Profile",
      path: "/staff/profile",
      icon: <User className="w-5 h-5" />
    }
  ];

  return (
    <nav className="bg-white border-r border-gray-200 h-screen w-64 fixed left-0 top-0 p-4">
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-8">
          <h1 className="text-xl font-bold text-primary">Staff Portal</h1>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
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

export default StaffNav; 