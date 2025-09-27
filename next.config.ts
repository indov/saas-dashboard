

const path = require('path');

interface WebpackConfig {
  resolve: {
    alias: Record<string, string>;
  };
  // other webpack config properties can be added here if needed
}

interface NextConfig {
  webpack: (config: WebpackConfig) => WebpackConfig;
}

const nextConfig: NextConfig = {
  webpack: (config: WebpackConfig): WebpackConfig => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './'),
    };

    return config;
  },
};

module.exports = nextConfig;