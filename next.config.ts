import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/pf',
        permanent: true, // 308 - use false para 307 temporário
      },
    ]
  },
};

export default nextConfig;
