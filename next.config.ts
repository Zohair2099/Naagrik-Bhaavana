import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.telanganatribune.com',
      },
      {
        protocol: 'https',
        hostname: 'propertyadviser.in',
      },
      {
        protocol: 'https',
        hostname: 'static.swarajyamag.com',
      },
      {
        protocol: 'https',
        hostname: 'newsmeter.in',
      },
      {
        protocol: 'https',
        hostname: 'cdn.telanganatoday.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.thehansindia.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default nextConfig;
