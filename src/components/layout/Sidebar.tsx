
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Users, 
  Coins, 
  FileText, 
  User,
  Building2
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: "Unions", 
      path: "/unions", 
      icon: <Building2 className="h-5 w-5" /> 
    },
    { 
      name: "Members", 
      path: "/members", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: "Loans", 
      path: "/loans", 
      icon: <Coins className="h-5 w-5" /> 
    },
    { 
      name: "Collectors", 
      path: "/collectors", 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      name: "Schedule", 
      path: "/schedule", 
      icon: <Calendar className="h-5 w-5" /> 
    }
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-loan-primary">Union Loans</h1>
        <p className="text-sm text-gray-500">Collection Management</p>
      </div>
      
      <nav className="flex-1 pt-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 text-gray-700 hover:bg-loan-accent hover:text-loan-primary",
                  location.pathname === item.path && "bg-loan-accent text-loan-primary font-medium border-r-4 border-loan-primary"
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-loan-primary rounded-full flex items-center justify-center text-white">
            <span className="font-semibold">LC</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Loan Collector</p>
            <p className="text-xs text-gray-500">Admin View</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
