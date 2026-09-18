import { GraduationCap, LogOut, X } from "lucide-react";
import type { Role } from "@/domain/types";
import { NAV_BY_ROLE } from "@/presentation/config/navigation";

type SidebarInnerProps = {
  role: Role;
  active: string;
  setActive: (key: string) => void;
  onLogout: () => void;
  collapsed: boolean;
  onClose?: () => void;
};

export function SidebarInner({
  role,
  active,
  setActive,
  onLogout,
  collapsed,
  onClose,
}: SidebarInnerProps) {
  const nav = NAV_BY_ROLE[role];

  return (
    <div className="flex flex-col h-full" style={{ background: "#0a4f49" }}>
      {/* Brand — matches header height (h-14) */}
      <div
        className={`flex items-center gap-2 px-3 h-14 border-b border-white/10 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <p
            className="font-bold text-white text-sm leading-tight truncate"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Ethio Academy
          </p>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="text-teal-200 hover:text-white ml-auto"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {nav.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setActive(item.key);
              onClose?.();
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              collapsed ? "justify-center" : ""
            } ${
              active === item.key ? "text-white" : "text-teal-100 hover:text-white"
            }`}
            style={active === item.key ? { background: "#0d9488" } : undefined}
            onMouseEnter={(e) => {
              if (active !== item.key)
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              if (active !== item.key)
                (e.currentTarget as HTMLButtonElement).style.background = "";
            }}
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom — Sign Out only */}
      <div className="px-2 py-2 border-t border-white/10">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-teal-100 hover:text-white hover:bg-white/10 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title="Sign out"
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
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
};

export function Sidebar({
  role,
  active,
  setActive,
  onLogout,
  collapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — full height with soft shadow */}
      <aside
        className={`hidden md:flex flex-col h-full flex-shrink-0 shadow-[4px_0_16px_-4px_rgba(0,0,0,0.18)] transition-[width] duration-300 ease-in-out relative z-10 ${
          collapsed ? "w-14" : "w-52"
        }`}
      >
        <SidebarInner
          role={role}
          active={active}
          setActive={setActive}
          onLogout={onLogout}
          collapsed={collapsed}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-60 z-50 shadow-2xl">
            <SidebarInner
              role={role}
              active={active}
              setActive={setActive}
              onLogout={onLogout}
              collapsed={false}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}