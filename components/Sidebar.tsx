"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Globe2 } from "lucide-react";
import { navigation } from "@/lib/navigation";

function SidebarItem({
  label,
  href,
  depth = 0,
}: {
  label: string;
  href: string;
  depth?: number;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center rounded-xl px-3 py-2 text-sm transition ${
        active
          ? "bg-[var(--accent-gold)] text-white"
          : "text-white/75 hover:bg-white/8 hover:text-white"
      }`}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <ChevronRight className="mr-2 h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 overflow-y-auto bg-[var(--bg-primary)] px-4 py-6 text-[var(--text-light)]">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="gold-gradient flex h-10 w-10 items-center justify-center rounded-2xl text-[var(--bg-primary)]">
          <Globe2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            RPA
          </p>
          <h1 className="text-sm font-semibold leading-5">
            Global South Intelligence OS
          </h1>
        </div>
      </div>

      <nav className="space-y-6">
        {navigation.map((section) => (
          <div key={section.heading}>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
              {section.heading}
            </p>
            <div className="space-y-1">
              {section.items.map((item) =>
                item.href ? (
                  <SidebarItem key={item.label} label={item.label} href={item.href} />
                ) : (
                  <div key={item.label} className="space-y-1">
                    <p className="px-3 py-2 text-sm text-white/70">{item.label}</p>
                    {item.items?.map((child) =>
                      child.href ? (
                        <SidebarItem
                          key={child.label}
                          label={child.label}
                          href={child.href}
                          depth={1}
                        />
                      ) : null,
                    )}
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
