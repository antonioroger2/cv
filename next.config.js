/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', //static export - commented out for dev
  // basePath: '/cv', // commented out for dev
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },

  serverExternalPackages: ['undici'], 
}

module.exports = nextConfig