var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var minifyHTML = require('gulp-minify-html');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");

gulp.task('scripts', function() {
    //single entry point to browserify
    gulp.src(['js/map.js'])
        .pipe(browserify({
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };
 
  return gulp.src('./index_edit.html')
    .pipe(minifyHTML(opts))
    .pipe(rename("./index.html"))
    .pipe(gulp.dest('./'));
});

gulp.task('minify-css', function() {
  return gulp.src('./css/*.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function () {
  gulp.watch('./js/*js', ['scripts']);
  gulp.watch('./index_edit.html', ['minify-html']);
  gulp.watch('./css/*css', ['minify-css']);
});

gulp.task('default', ['minify-html', 'scripts',  'minify-css', 'watch']);
