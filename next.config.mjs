// The browser only ever talks to this app's own /api/* paths; Next forwards
// them to the Node backend. That keeps the session cookie first-party (no CORS
// or third-party-cookie problems) and hides the backend's address.
//
// Override with the API_URL environment variable if the backend ever moves.
const API_URL =
  process.env.API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://solve-resume-builder-node.onrender.com"
    : "http://localhost:4000");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
