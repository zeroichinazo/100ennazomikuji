import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    dangerouslyAllowSVG: true,
  },
  // LAN の IP で dev サーバーにアクセスするときに必要（フォント・HMR）
  allowedDevOrigins: ["10.128.153.131", "169.254.11.6"],
};

export default nextConfig;
