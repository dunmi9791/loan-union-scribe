
import React from "react";
import { Bell, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4" />
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-loan-primary focus:border-loan-primary"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        </div>
        
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600 cursor-pointer hover:text-loan-primary" />
          <span className="absolute -top-1 -right-1 bg-loan-danger text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
