import type { NextConfig } from 'next';

const isExport = process.env.NODE_ENV === 'production';
const base_path = '/fuel_memo';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isExport ? base_path : '',
  assetPrefix: isExport ? base_path + '/' : undefined,
};

export default nextConfig;
