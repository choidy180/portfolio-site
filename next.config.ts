import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true,
    },
    transpilePackages: ['@appletosolutions/reactbits'],
};

export default nextConfig;
