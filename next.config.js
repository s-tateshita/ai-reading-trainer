/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // GitHub Pages リポジトリ名がルート以外の場合は basePath を設定
  // 例: https://username.github.io/ai-reading-trainer/ の場合
  // basePath: '/ai-reading-trainer',
  // assetPrefix: '/ai-reading-trainer/',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
