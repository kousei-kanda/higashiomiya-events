"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const TABS = [
  { href: "/admin", label: "応募一覧" },
  { href: "/admin/events", label: "イベント管理" },
  { href: "/admin/records", label: "参加実績管理" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between gap-4 border-b border-line mb-10 pb-0">
      <nav className="flex gap-1 -mb-px overflow-x-auto">
        {TABS.map((tab) => {
          const active =
            tab.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap px-4 py-3 text-sm border-b-2 transition-colors ${
                active
                  ? "border-lantern text-paper font-bold"
                  : "border-transparent text-paper-dim hover:text-paper"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <LogoutButton />
    </div>
  );
}
