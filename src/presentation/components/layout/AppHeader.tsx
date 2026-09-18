import { Menu, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { Role } from "@/domain/types";

type AppHeaderProps = {
  role: Role;
  activeLabel: string;
  userName?: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMenuOpen: () => void;
  onLogout: () => void;
};

export function AppHeader({
  activeLabel,
  userName,
  collapsed,
  onToggleCollapse,
  onMenuOpen,
  onLogout,
}: AppHeaderProps) {
  const displayName = userName || "User";

  return (
    <header
      className="flex items-center gap-2 px-4 md:px-6 h-14 flex-shrink-0"
      style={{ background: "#0a4f49" }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuOpen}
        className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-teal-100 hover:bg-white/10 hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Collapse toggle — desktop only, icon only */}
      <button
        onClick={onToggleCollapse}
        className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center text-teal-100 hover:bg-white/10 hover:text-white transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
      </button>

      {/* Page title */}
      <div className="flex items-center min-w-0 flex-1">
        <span
          className="text-sm font-medium text-teal-100 truncate"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {activeLabel}
        </span>
      </div>

      {/* User + logout */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-white/10 transition-colors">
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-white font-medium max-w-[140px] truncate">
            {displayName}
          </span>
        </div>

        <div className="sm:hidden w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </span>
        </div>

        <button
          onClick={onLogout}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-teal-100 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}