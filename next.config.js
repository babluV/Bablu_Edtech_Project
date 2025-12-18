/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark these as external for server-side to avoid bundling issues
      config.externals = config.externals || [];
      config.externals.push('sequelize', 'pg', 'pg-hstore');
    }
    return config;
  },
}

module.exports = nextConfig

