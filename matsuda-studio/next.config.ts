import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // リポジトリ直下にも package-lock.json があるため、
  // このプロジェクトを Turbopack のルートとして明示する。
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
