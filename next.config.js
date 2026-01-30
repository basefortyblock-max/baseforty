/** @type {import('next').NextConfig} */
const nextConfig = {
  // Matikan Turbopack secara eksplisit
  experimental: {
    turbopack: false,
  },

  // Pertahankan webpack config kamu
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
    };
    config.externals.push(
      'pino-pretty',
      'encoding',
      '@react-native-async-storage/async-storage'
    );
    return config;
  },
};

module.exports = nextConfig;