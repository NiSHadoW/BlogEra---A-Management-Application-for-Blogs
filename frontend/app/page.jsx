"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PublicLayout from "@/components/PublicLayout";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/Loader";
import { getBlogs } from "@/services/blog.service";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get("title") || "";
  const category = searchParams.get("category") || "All";

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Every change to title/category is reflected in the URL first (so the
  // search/filter state is shareable and Navbar-triggered searches land
  // here correctly), then this effect re-fetches from the real API.
  useEffect(() => {
    let cancelled = false;

    const fetchBlogs = async () => {
      setIsLoading(true);
      setError("");
      try {
        const { data } = await getBlogs({
          title: title || undefined,
          category: category !== "All" ? category : undefined,
        });
        if (!cancelled) setBlogs(data);
      } catch {
        if (!cancelled) setError("Could not load blogs. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      cancelled = true;
    };
  }, [title, category]);

  const updateQuery = (nextTitle, nextCategory) => {
    const params = new URLSearchParams();
    if (nextTitle) params.set("title", nextTitle);
    if (nextCategory && nextCategory !== "All") params.set("category", nextCategory);
    router.replace(params.toString() ? `/?${params.toString()}` : "/");
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Discover Blogs</h1>
        <p className="mt-2 text-gray-500">Browse articles from our community of writers.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          initialValue={title}
          onSearch={(value) => updateQuery(value, category)}
          className="sm:max-w-xs"
        />
        <CategoryFilter value={category} onChange={(value) => updateQuery(title, value)} />
      </div>

      {isLoading ? (
        <Loader label="Loading blogs..." />
      ) : error ? (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicLayout>
      <Suspense fallback={<Loader label="Loading blogs..." />}>
        <HomeContent />
      </Suspense>
    </PublicLayout>
  );
}
