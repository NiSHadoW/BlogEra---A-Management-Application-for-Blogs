"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const EDIT_BLOG_PATTERN = /^\/dashboard\/blogs\/\d+\/edit$/;

const userLinks = [
  { href: "/dashboard", label: "Dashboard", match: (p) => p === "/dashboard" },
  {
    href: "/dashboard/blogs",
    label: "My Blogs",
    match: (p) => p === "/dashboard/blogs" || EDIT_BLOG_PATTERN.test(p),
  },
  { href: "/dashboard/blogs/create", label: "Create Blog", match: (p) => p === "/dashboard/blogs/create" },
  { href: "/dashboard/profile", label: "Profile", match: (p) => p === "/dashboard/profile" },
  { href: "/dashboard/change-password", label: "Change Password", match: (p) => p === "/dashboard/change-password" },
];

const adminLinks = [
  { href: "/dashboard", label: "Dashboard", match: (p) => p === "/dashboard" },
  {
    href: "/dashboard/blogs",
    label: "All Blogs",
    match: (p) => p === "/dashboard/blogs" || EDIT_BLOG_PATTERN.test(p),
  },
  { href: "/dashboard/blogs/create", label: "Create Blog", match: (p) => p === "/dashboard/blogs/create" },
  { href: "/admin/users", label: "Users", match: (p) => p.startsWith("/admin/users") },
  { href: "/dashboard/profile", label: "Profile", match: (p) => p === "/dashboard/profile" },
  { href: "/dashboard/change-password", label: "Change Password", match: (p) => p === "/dashboard/change-password" },
];

// isOpen/onClose only matter on mobile, where the sidebar becomes a drawer
// (Rules #4 — "responsive for smaller screens"). On desktop it's always
// visible as a static column regardless of these props.
export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, logout } = useAuth();
  const links = role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    onClose?.();
    router.push("/login");
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white pt-16 transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:pt-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex h-full flex-col gap-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                link.match(pathname)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
