const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat-css');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const htmlMinifier = require('html-minifier');
const mediaquery = require('postcss-combine-media-query');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');

function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

function html() {
  const options = {
    collapseWhitespace: true,
    keepClosingSlash: true,
    minifyCSS: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortClassName: true,
    useShortDoctype: true
  }
  return gulp.src('src/**/*.html')
    .pipe(plumber())
    .on('data', function(file) {
      const bufferFile = Buffer.from(htmlMinifier.minify(file.contents.toString(), options))
      return file.contents = bufferFile;
    })
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [
    autoprefixer(),
    mediaquery(),
    cssnano()
  ];
  return gulp.src('src/blocks/**/*.css')
    .pipe(plumber())
    .pipe(concat('bundle.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/'))
    .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/images/**/*.{avif,gif,ico,jpg,png,svg,webp}')
    .pipe(gulp.dest('dist/images/'))
    .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist/');
}

function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/blocks/**/*.css'], css);
  gulp.watch(['src/images/**/*.{avif,gif,ico,jpg,png,svg,webp}'], images);
}

const build = gulp.series(clean, gulp.parallel(html, css, images));
const watchapp = gulp.parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.images = images;
exports.clean = clean;

exports.build = build;
exports.watchapp = watchapp;
exports.default = watchapp;