import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Heart,
  Stethoscope,
  MessageCircle,
  History,
  BarChart3,
  CreditCard,
  Key,
  ChevronLeft,
  User,
  LogOut,
  Menu,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: Stethoscope, label: "Symptom Check", href: "/dashboard" },
  { icon: MessageCircle, label: "Health Chat", href: "/dashboard/chat" },
  { icon: BookOpen, label: "Health Hub", href: "/dashboard/knowledge" },
  { icon: History, label: "History", href: "/dashboard/history" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg">
            Diagnova<span className="gradient-text">AI</span>
          </span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-background border-r border-border z-50 transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-border">
          <Link to="/" className={cn("flex items-center gap-3", collapsed && "justify-center w-full")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <Activity className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight">
                  Diagnova<span className="gradient-text">AI</span>
                </span>
                <span className="text-[9px] text-muted-foreground -mt-0.5 tracking-wider">HEALTH AI</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors",
              collapsed && "absolute -right-4 top-6 bg-background border border-border shadow-sm"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-3"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className={cn("absolute bottom-0 left-0 right-0 p-4 border-t border-border", collapsed && "p-2")}>
          <div className={cn("flex items-center gap-3 mb-3", collapsed && "flex-col")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">Free Plan</p>
              </div>
            )}
          </div>
          <Button variant="ghost" size={collapsed ? "icon" : "default"} className={cn("w-full", collapsed && "w-10")} onClick={signOut}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 pt-16 lg:pt-0",
          collapsed ? "lg:ml-20" : "lg:ml-64"
        )}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};
