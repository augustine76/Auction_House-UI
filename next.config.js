module.exports = {
  future: {
    webpack5: true, // by default, if you customize webpack config, they switch back to version 4. 
      // Looks like backward compatibility approach.
  },
  eslint:{
    ignoreDuringBuilds: true
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback, 
        // by next.js will be dropped. Doesn't make much sense, but how it is
      fs: false, // the solution
    };

    return config;
  },
};
