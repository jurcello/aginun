module.exports = {
  plugins: [
    require("@fullhuman/postcss-purgecss")({
      content: [`./public/**/*.html`, `./src/**/*.vue`],
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(
          /<style[^]+?<\/style>/gi,
          ""
        );

        return (
          contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) ||
          []
        );
      },
      safelist: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /data-v-.*/,
        /^bi-/,
        /^fade/,
        /^modal-/,
        /^offcanvas-/,
        /^show/,
        /^collapsing/,
        /^(bs-)?popover.*/,
        /^bg-secondary/,
        /^bg-danger/,
        /^ti-/,
      ],
    }),
  ],
};
