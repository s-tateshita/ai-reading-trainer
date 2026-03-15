/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // GitHub Pages: https://s-tateshita.github.io/ai-reading-trainer/
  basePath: '/ai-reading-trainer',
  assetPrefix: '/ai-reading-trainer/',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
