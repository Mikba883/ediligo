import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/quotazione", destination: "/valuta", permanent: false }];
  },
};

export default nextConfig;
