/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudinary is the only remote host her photographs are served from.
    // images.unsplash.com was allowed here while the catalogue was seeded with
    // stock photos of other people's jewellery; those have been removed, and
    // leaving the host whitelisted would let them quietly come back.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
