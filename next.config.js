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
    // Vercel Image Optimization returns HTTP 402
    // (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) once the free quota is used
    // up — every next/Image then shows a broken icon even though Cloudinary
    // still has the file. Photos already live on Cloudinary (and Blob), so we
    // skip Vercel's optimizer and load the CDN URL directly.
    unoptimized: true,
    // Still listed so next/image accepts these hosts if optimization is
    // turned back on later.
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
