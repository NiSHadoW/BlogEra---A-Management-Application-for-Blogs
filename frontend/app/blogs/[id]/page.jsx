"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import { getBlogById } from "@/services/blog.service";
import { formatDate } from "@/utils/formatDate";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchBlog = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const { data } = await getBlogById(id);
        if (!cancelled) setBlog(data);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchBlog();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <PublicLayout>
        <Loader label="Loading blog..." />
      </PublicLayout>
    );
  }

  if (notFound || !blog) {
    return (
      <PublicLayout>
        <div className="py-16 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Blog Not Found</h1>
          <p className="mt-2 text-gray-500">The blog you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
            Back to all blogs
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const authorName = blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "Unknown author";

  return (
    <PublicLayout>
      <article className="mx-auto max-w-3xl">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {blog.category}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{blog.blogTitle}</h1>

        <div className="mt-4 flex items-center gap-3">
          <Avatar src={blog.author?.profileImage} name={authorName} size={36} />
          <div>
            <p className="text-sm font-medium text-gray-800">{authorName}</p>
            <p className="text-xs text-gray-400">
              {formatDate(blog.createdAt, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <div className="mt-8 whitespace-pre-wrap text-base leading-relaxed text-gray-700">
          {blog.blog}
        </div>

        <Link href="/" className="mt-10 inline-block text-blue-600 hover:underline">
          ← Back to all blogs
        </Link>
      </article>
    </PublicLayout>
  );
}
