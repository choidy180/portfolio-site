import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: {
        styledComponents: true,
    },
    eslint: {
        // 빌드 중 ESLint를 완전히 건너뜀
        ignoreDuringBuilds: true,
    },
    transpilePackages: ['@appletosolutions/reactbits'],
};

export default nextConfig;
