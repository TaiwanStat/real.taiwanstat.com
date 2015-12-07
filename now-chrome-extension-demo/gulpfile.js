var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

var js_dir = ['js/*.js'];

gulp.task('scripts', function() {
  gulp.src('./js/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

gulp.task('scss', function() {
  return gulp.src('./scss/*.scss')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(minifyCSS())
  .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch('./js/**/*.js', ['scripts']);
  gulp.watch('./scss/**/*.scss', ['scss']);
});

gulp.task('default', ['scripts',  'scss', 'watch']);
