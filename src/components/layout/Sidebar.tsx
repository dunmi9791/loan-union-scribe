
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  Users, 
  Coins, 
  FileText, 
  Building2,
  LogOut
} from "lucide-react";
import { useOdooAuth } from "@/hooks/useOdooAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const sidebarContext = useSidebar();
  const { state, open, isMobile } = sidebarContext;
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useOdooAuth();
  
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const navItems = [
    { 
      name: "Dashboard", 
      path: "/", 
      icon: FileText
    },
    { 
      name: "Unions", 
      path: "/unions", 
      icon: Building2
    },
    { 
      name: "Members", 
      path: "/members", 
      icon: Users
    },
    { 
      name: "Loans", 
      path: "/loans", 
      icon: Coins
    }
  ];

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-loan-accent text-loan-primary font-medium" : "hover:bg-loan-accent/50";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div>
                <h1 className="text-2xl font-bold text-loan-primary">Union Loans</h1>
                <p className="text-sm text-gray-500">Collection Management</p>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 bg-loan-primary rounded-full flex items-center justify-center text-white mx-auto">
                <span className="font-bold text-sm">UL</span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.path} 
                      end 
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-loan-accent text-loan-primary font-medium" 
                          : "hover:bg-loan-accent/50"
                      }
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.name}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-gray-200">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-loan-primary rounded-full flex items-center justify-center text-white">
                  <span className="font-semibold">{(user as any)?.username?.substring(0, 2).toUpperCase() || 'LC'}</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{(user as any)?.username || 'Loan Collector'}</p>
                  <p className="text-xs text-gray-500">Admin View</p>
                </div>
              </div>
              <button 
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="p-2 text-gray-500 hover:text-loan-primary hover:bg-loan-accent rounded-full"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-loan-primary rounded-full flex items-center justify-center text-white">
                <span className="font-semibold">{(user as any)?.username?.substring(0, 2).toUpperCase() || 'LC'}</span>
              </div>
              <button 
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="p-2 text-gray-500 hover:text-loan-primary hover:bg-loan-accent rounded-full"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
