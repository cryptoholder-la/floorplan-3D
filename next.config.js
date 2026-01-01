/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig
