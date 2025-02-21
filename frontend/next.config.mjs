/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      // Disable font optimization
      fontOptimization: false,
    },
  },
};

export default nextConfig;