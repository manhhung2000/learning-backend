import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@features': './features',
      '@shared': './shared',
      '@lib': './lib',
      '@store': './store',
      '@models': './models',
    },
  },
}

export default nextConfig
