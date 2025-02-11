module.exports = {
  webpack(config, { isServer }) {
    if (!isServer) {
      // Escludi cross-spawn dal bundle client-side
      config.resolve.alias['cross-spawn'] = false;
    }
    return config;
  },
};
