const withTM = require("next-transpile-modules")(["@shadcn/ui"]);

module.exports = withTM({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        child_process: false,
        readline: false,
        buffer: require.resolve("buffer/"),
      };
    }
    return config;
  },
});
