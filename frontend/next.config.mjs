/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    // The backend runs on localhost in dev, which Next's image optimizer
    // otherwise blocks as a private-IP SSRF guard. Safe here since this
    // only ever points at our own backend, configured via NEXT_PUBLIC_API_URL.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
