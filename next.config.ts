import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compiler: { styledComponents: true }, // SWC 트랜스폼 활성화
    reactStrictMode: true,
    eslint: {
        // 빌드 중 ESLint를 완전히 건너뜀
        ignoreDuringBuilds: true,
    },
    transpilePackages: ['@appletosolutions/reactbits'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
