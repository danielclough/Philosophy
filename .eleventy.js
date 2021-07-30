const cleanCSS = require("clean-css");
const htmlMinTransform = require("./src/transforms/html-min-transform.js");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const localImages = require('eleventy-plugin-local-images');

module.exports = function(config) {
  config.addPlugin(localImages, {
    distPath: 'dist',
    assetPath: '/assets/img',
    selector: 'img',
    verbose: false
  });
  config.addPlugin(lazyImagesPlugin, {
    preferNativeLazyLoad: true,
    transformImgPath: (imgPath) => {
      if (imgPath.startsWith('/') && !imgPath.startsWith('//')) {
        return `./src${imgPath}`;
      }

      return imgPath;
    },
  });
  config.addPassthroughCopy("src/img");
  config.addPassthroughCopy("files");

  // Minify HTML
  config.addTransform("htmlmin", htmlMinTransform);

  // Inline CSS
  config.addFilter("cssmin", code => {
    return new cleanCSS({}).minify(code).styles;
  });

  // Date formatting filter
  config.addFilter("htmlDateString", dateObj => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // Don't ignore the same files ignored in the git repo
  config.setUseGitIgnore(false);


  // Eleventy configuration
  return {
    dir: {
      input: "src",
      output: "dist"
    },

    // Files read by Eleventy, add as needed
    templateFormats: ["css", "njk", "md", "txt", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
