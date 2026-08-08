import { ChevronRight, GraduationCap, LogOut, X } from "lucide-react";
import type { Role } from "@/domain/types";
import { DEMO_USERS } from "@/infrastructure/data/mock";
import { NAV_BY_ROLE } from "@/presentation/config/navigation";

type SidebarInnerProps = {
  role: Role;
  active: string;
  setActive: (key: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  onClose?: () => void;
};

export function SidebarInner({
  role,
  active,
  setActive,
  onLogout,
  collapsed,
  setCollapsed,
  onClose,
}: SidebarInnerProps) {
  const user = DEMO_USERS[role];
  const nav = NAV_BY_ROLE[role];

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a4f49" }}>
      <div className={`flex items-center gap-3 p-4 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Ethio Academy
            </p>
            <p className="text-xs text-teal-200 truncate font-mono">{user.id}</p>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="text-teal-200 hover:text-white ml-auto">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              onClose?.();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${collapsed ? "justify-center" : ""} ${active === item.key ? "text-white" : "text-teal-100 hover:text-white"}`}
            style={active === item.key ? { background: "#0d9488" } : undefined}
            onMouseEnter={(e) => {
              if (active !== item.key) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              if (active !== item.key) (e.currentTarget as HTMLButtonElement).style.background = "";
            }}
          >
            {item.icon}
            {!collapsed && item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 rounded-xl bg-white/10 mb-2">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-teal-200 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-teal-100 hover:text-white transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
          {!collapsed && "Collapse"}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-teal-100 hover:text-white hover:bg-white/10 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

type SidebarProps = {
  role: Role;
  active: string;
  setActive: (key: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

export function Sidebar({
  role,
  active,
  setActive,
  onLogout,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  return (
    <>
      <aside className={`hidden md:flex flex-col h-full transition-all duration-300 flex-shrink-0 ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarInner
          role={role}
          active={active}
          setActive={setActive}
          onLogout={onLogout}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 z-50 shadow-2xl">
            <SidebarInner
              role={role}
              active={active}
              setActive={setActive}
              onLogout={onLogout}
              collapsed={false}
              setCollapsed={() => {}}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}
