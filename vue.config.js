const path = require("path");

module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      // Make scss variables available to all components
      patterns: [
        path.resolve(__dirname, "./src/styles/imports/variables.scss"),
      ],
    },
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: path.resolve(__dirname, "./src/i18n/messages"),
      enableInSFC: true,
    },
  },
  chainWebpack: (config) => {
    // GraphQL Loader
    config.module
      .rule("graphql")
      .test(/\.(graphql|gql)$/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();

    // Don't prefetch translation files
    config.plugin("prefetch").tap((options) => {
      if (!options[0].fileBlacklist) {
        options[0].fileBlacklist = [];
      }

      options[0].fileBlacklist.push(/lang-.*/);

      return options;
    });
  },
};
