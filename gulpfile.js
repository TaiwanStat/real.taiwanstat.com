var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");

var css_dir = ['./css/*.css', '!./css/*min.css']//, './**/css/*.css', '!./**/css/*min.css'];
var js_dir = ['./js/*.js', '!./js/*min.js']//, './**/js/*.js', '!./**/js/*min.js'];

gulp.task('scripts', function() {
  gulp.src(js_dir)
  .pipe(uglify())
  .pipe(rename({suffix: ".min"}))
  .pipe(gulp.dest(function(file) {
    return file.base;
  }));
});

gulp.task('minify-css', function() {
  return gulp.src(css_dir)
  .pipe(minifyCSS())
  .pipe(rename({suffix: ".min"}))
  .pipe(gulp.dest(function(file) {
    return file.base;
  }));
});

gulp.task('watch', function () {
  gulp.watch('./js/*js', ['scripts']);
  gulp.watch('./css/*css', ['minify-css']);
});

gulp.task('default', ['scripts',  'minify-css', 'watch']);
