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
    // Only the two hosts her photographs are actually served from. Vercel Blob
    // is the default upload target; Cloudinary stays supported for keys that
    // are already configured. images.unsplash.com was allowed here while the
    // catalogue was seeded with stock photos of other people's jewellery; those
    // have been removed, and leaving the host whitelisted would let them
    // quietly come back.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
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
