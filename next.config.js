/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure we use a stable builder if Turbopack is failing in production
  transpilePackages: ["leaflet"],
};

module.exports = nextConfig;
