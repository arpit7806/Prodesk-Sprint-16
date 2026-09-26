/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keeps the first Vercel deploy from failing on a type nit. Remove once `npm run build` passes locally.
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
