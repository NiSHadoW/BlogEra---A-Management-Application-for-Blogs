import Link from "next/link";
import Avatar from "./Avatar";
import { formatDate } from "@/utils/formatDate";

const truncate = (text, maxLength = 140) =>
  text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;

export default function BlogCard({ blog }) {
  const authorName = blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "Unknown author";

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {blog.category}
        </span>
        <span className="text-xs text-gray-400">{formatDate(blog.createdAt)}</span>
      </div>

      <h2 className="mb-2 text-lg font-semibold text-gray-900">{blog.blogTitle}</h2>
      <p className="mb-4 flex-1 text-sm text-gray-600">{truncate(blog.blog)}</p>

      <div className="mb-4 flex items-center gap-2">
        <Avatar src={blog.author?.profileImage} name={authorName} size={28} />
        <span className="text-sm text-gray-700">{authorName}</span>
      </div>

      <Link
        href={`/blogs/${blog.id}`}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Read More
      </Link>
    </article>
  );
}
