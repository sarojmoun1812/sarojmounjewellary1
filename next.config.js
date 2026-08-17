/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // @vercel/blob depends on undici, which uses private class fields that the
    // bundler shipped with this Next version cannot parse. It only ever runs in
    // the upload route handler on the server, so leaving it to Node to require
    // at runtime sidesteps the build failure without changing behaviour.
    serverComponentsExternalPackages: ["@vercel/blob"],
  },
  images: {
    // Vercel Blob URLs vary by store id (xxx.public.blob.vercel-storage.com).
    // A single wildcard + the bare host keeps uploaded photos rendering in
    // next/image instead of failing silently as broken thumbnails.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "public.blob.vercel-storage.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
