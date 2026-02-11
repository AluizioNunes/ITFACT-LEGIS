/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/nest/:path*',
                destination: 'http://localhost:3001/:path*', // Used for local dev mainly, nginx handles in prod
            },
            {
                source: '/api/python/:path*',
                destination: 'http://localhost:8000/:path*', // Used for local dev mainly
            },
        ];
    },
};

module.exports = nextConfig;
