/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["leaflet"],
  experimental: {
    // Force more efficient memory usage in the build worker
    workerThreads: false,
    cpus: 1
  }
};

module.exports = nextConfig;
