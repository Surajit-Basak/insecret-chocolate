import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Remove: output: 'export'
  // Remove: basePath: '/insecret' 
  // Remove: assetPrefix: '/insecret'
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
        hostname: 'igqbfgvzdtbcmluzjksc.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;