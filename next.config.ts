import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpackDevMiddleware: (config:any) => {
    config.watchOptions = {
      poll: 1000,            // 1秒ごとに変更を確認
      aggregateTimeout: 300, // 少し待ってからリビルド（変更の重複を減らす）
    };
    return config;
  },
};

export default nextConfig;
