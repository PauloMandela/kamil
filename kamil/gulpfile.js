const { src, dest, parallel, series, watch } = require("gulp");

// Load plugins
const sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-minify"),
  rename = require("gulp-rename"),
  terser = require("gulp-terser"),
  shorthand = require("gulp-shorthand"),
  changed = require("gulp-changed"),
  del = require("del"),
  htmlmin = require("gulp-htmlmin");

const clear = () => del(["templates", "static/js", "static/css"]);

// SCSS function
function scss() {
  const source = "./GULPsrc/sass/*.scss";

  return src(source)
    .pipe(changed(source))
    .pipe(sass())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 4 versions"],
        cascade: false,
      })
    )
    .pipe(shorthand())
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest("static/css/"));
}

// html function
function minify() {
  const source = "./GULPsrc/html/*.html";

  return (
    src(source)
      .pipe(changed(source))
      .pipe(htmlmin({ collapseWhitespace: true }))
      // .pipe(w3c())
      .pipe(dest("./templates/"))
  );
}

// JS function
function js() {
  const source = "./GULPsrc/js/*.js";

  return src(source)
    .pipe(changed(source))
    .pipe(terser())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest("./static/js/"));
}

// Watch files
function watchFiles() {
  watch("./GULPsrc/sass/*.scss", scss);
  watch("./GULPsrc/js/*.*js", js);
  watch("./GULPsrc/html/*.html", minify);
}

// Tasks to define the execution of the functions simultaneously or in series
exports.watch = series(clear, parallel(watchFiles, js, scss, minify));
exports.default = series(clear, parallel(js, scss, minify));
