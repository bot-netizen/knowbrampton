/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static: nothing to fall over on election day.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
