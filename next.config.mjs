/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed 'output: export' for dynamic application support
    
    // Add API proxy configuration to handle CORS issues
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/:path*` : 'https://algoz-backend-68rt.onrender.com/api/:path*',
            },
        ];
    },
};

export default nextConfig;
