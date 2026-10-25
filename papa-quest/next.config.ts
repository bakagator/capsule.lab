import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 親フォルダ（まつだ家アプリ）とは独立したプロジェクトとしてビルドする
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
