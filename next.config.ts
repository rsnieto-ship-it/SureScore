import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /resources is unpublished. The page advertised 16 downloads that do not
      // exist and webinars dated early 2025. The component is still in the repo
      // and this route comes back when the page is rebuilt, so keep the
      // redirect temporary (307) — a permanent one would be cached by browsers.
      {
        source: "/resources",
        destination: "/contact",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
