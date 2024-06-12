/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    env: {
        REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL,
        REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/**",
            },
        ],
    },
};

module.exports = nextConfig;
//https://avatars.githubusercontent.com/u/48344654?v=4
