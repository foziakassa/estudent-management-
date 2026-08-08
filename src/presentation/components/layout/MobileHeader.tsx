import { GraduationCap, Menu } from "lucide-react";
import type { Role } from "@/domain/types";
import { DEMO_USERS } from "@/infrastructure/data/mock";

type MobileHeaderProps = {
  role: Role;
  activeLabel: string;
  onMenuOpen: () => void;
};

export function MobileHeader({ role, activeLabel, onMenuOpen }: MobileHeaderProps) {
  return (
    <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-white flex-shrink-0">
      <button
        onClick={onMenuOpen}
        className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
      >
        <Menu size={20} />
      </button>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#0a4f49" }}
        >
          <GraduationCap size={14} className="text-white" />
        </div>
        <span className="font-semibold text-foreground text-sm truncate" style={{ fontFamily: "Outfit, sans-serif" }}>
          {activeLabel}
        </span>
      </div>
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{DEMO_USERS[role].name.charAt(0)}</span>
      </div>
    </header>
  );
}
