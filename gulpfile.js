var gulp = require('gulp');
var useref = require('gulp-useref');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var gulpIf = require('gulp-if');
var ghPages = require('gulp-gh-pages');
var uncss = require('gulp-uncss');
var lazypipe = require('lazypipe');


// lazy pipe

var cssTasks = lazypipe()
    .pipe(uncss, {
                html: ['*.html']
            });
    .pipe(cssnano);



// Tasks

gulp.task('useref', function(){
  return gulp.src('*.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', cssTasks()))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  });
});

gulp.task('watch', ['browserSync'], function (){
  gulp.watch('css/**/*.css', browserSync.reload);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('*.html', browserSync.reload);
});

gulp.task('images', function(){
  return gulp.src('images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src('fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('default', function (callback) {
  runSequence(['browserSync', 'watch'],
    callback
  );
});
