/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://147.93.114.66:9090/:path*", // Proxy to backend
      },
    ];
  },
};
export default nextConfig;
