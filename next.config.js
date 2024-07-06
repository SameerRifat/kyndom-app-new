/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns:
      // set all images to be loaded from all domains
      // this is a security risk and should be used with caution
      [
        {
          protocol: "https",
          hostname: "**",
        },
      ],
  },
};

export default config;
