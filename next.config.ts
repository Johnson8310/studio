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
     // Removed picsum.photos as it's not used in the app
     // Add any necessary image domains here if needed later
    remotePatterns: [],
  },
   // Add experimental flags required by Genkit or other libraries if needed
   experimental: {
     // Example: Enable server actions if you plan to use them extensively
     // serverActions: true,
   },
};

// Ensure Genkit experimental flags are included
Object.assign(nextConfig, {
  experimental: {
    ...nextConfig.experimental,
    instrumentationHook: true, // Required by @genkit-ai/next
  },
});


export default nextConfig;
