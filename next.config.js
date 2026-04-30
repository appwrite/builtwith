/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cloud.appwrite.io" },
      { protocol: "https", hostname: "fra.cloud.appwrite.io" },
    ],
  },
  webpack: (config) => {
    // Suppress noise from inside @appwrite.io/pink CSS:
    //  - autoprefixer "end value has mixed support" (legacy `end` flex value)
    //  - webpack PackFileCacheStrategy "No serializer registered for Warning"
    //    (cascade from the autoprefixer warning above)
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /@appwrite\.io\/pink/ },
      /No serializer registered for Warning/,
    ];
    return config;
  },
};

module.exports = nextConfig;
