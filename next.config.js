/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', //static export
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