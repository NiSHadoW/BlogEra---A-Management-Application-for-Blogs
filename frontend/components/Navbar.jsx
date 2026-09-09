"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "./SearchBar";
import ProfileMenu from "./ProfileMenu";

const HIDE_SEARCH_ON = ["/login", "/register"];

export default function Navbar({ onMenuClick }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const showSearch = !HIDE_SEARCH_ON.includes(pathname);

  const handleSearch = (title) => {
    router.push(title ? `/?title=${encodeURIComponent(title)}` : "/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center gap-4 px-4">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <Link href="/" className="shrink-0 text-xl font-bold text-blue-600">
          BlogEra
        </Link>

        {showSearch && (
          <div className="flex-1 max-w-md">
            <SearchBar onSearch={handleSearch} liveSearch={false} />
          </div>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-3">
          {isLoading ? null : isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
