// Empty when served at a domain root (Docker, custom domain).
// Set to "/<repo>" for GitHub Pages project sites.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath,
  // Fully static: nothing to fall over on election day.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
