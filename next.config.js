/** @type {import('next').NextConfig} */
// const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

// const getDomain = process.env.NEXT_PUBLIC_DOMAIN || 'default';

const withPWA = require('next-pwa')(
  {
    dest: 'public',
    register: true,
    disable: process.env.NODE_ENV === 'development'
    // sw: 'manifest.ts',
    // disable: false
  });

const nextConfig = withPWA({
  // distDir: `.next/${getDomain}`,
  swcMinify: true, // Enables SWC minification
  productionBrowserSourceMaps: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    domains: [
      "**"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      },
      {
        protocol: "http",
        hostname: "**"
      }
    ]
  },
  reactStrictMode: false,
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
    webpackBuildWorker: true
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    if (config.cache && !dev) {
      config.cache = Object.freeze({
        type: 'memory'
      });
      config.cache.maxMemoryGenerations = 0;
    }
    // Important: return the modified config
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/webadmin/:path*",
        destination: `/webadmin/index.html`
      }
    ];
  }
});
module.exports = nextConfig;
