import Navbar from "./Navbar";
import Footer from "./Footer";

// Shared shell for guest-facing pages (Navbar + Main Content + Footer, per
// Rules #2's "Public Layout"). Each public page.jsx wraps its content with
// this directly instead of relying on a Next.js nested layout.jsx, so it
// stays out of the root layout and never doubles up with the dashboard shell.
export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-12">{children}</main>
      <Footer />
    </div>
  );
}
