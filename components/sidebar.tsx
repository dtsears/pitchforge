"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Palette,
  Package,
  User,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/team", label: "Team", icon: Users },
  { href: "/dashboard/brand", label: "Brand", icon: Palette },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/profile", label: "My Info", icon: User },
];

type Props = {
  userName?: string | null;
  orgName?: string | null;
  orgColor?: string | null;
};

export function Sidebar({ userName, orgName, orgColor }: Props) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className="flex flex-col shrink-0 bg-stone-900 text-white transition-all duration-200 ease-in-out"
      style={{ width: expanded ? "200px" : "56px" }}
    >
      {/* Toggle + logo */}
      <div className="flex items-center h-14 px-3 border-b border-white/10 shrink-0">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors shrink-0"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronRight
            className="w-4 h-4 text-white/70 transition-transform duration-200"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
        {expanded && (
          <span className="ml-2 text-display text-sm font-semibold text-white truncate">
            PitchForge
          </span>
        )}
      </div>

      {/* Org badge */}
      {expanded && orgName && (
        <div className="mx-3 mt-3 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: orgColor ?? "#0057B8" }}
            />
            <span className="text-[11px] text-white/60 font-medium truncate">
              {orgName}
            </span>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-hidden">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/50 hover:bg-white/8 hover:text-white/80"
              }`}
              title={!expanded ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {expanded && (
                <span className="text-sm font-medium truncate">{label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="px-2 pb-4 border-t border-white/10 pt-3 space-y-1">
        {expanded && userName && (
          <p className="px-2 text-[11px] text-white/40 truncate mb-1">{userName}</p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/8 transition-colors"
          title={!expanded ? "Sign out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {expanded && <span className="text-sm">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
