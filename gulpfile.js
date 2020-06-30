var gulp = require('gulp');
var sass = require('gulp-sass');
var criticalCss = require('gulp-penthouse');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var cache = require('gulp-cache');
var del = require('del');
var replace = require('gulp-replace');

gulp.task('scripts', function() {
  return gulp.src(['./src/js/*.js'])
    .pipe(concat('bundle.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('vendor-scripts', function() {
  return gulp.src(['./src/js/vendor/*.js'])
    .pipe(concat('vendor.js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/js'));
})

gulp.task('images', function() {
  return gulp.src('./src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('./dist/img/'))
});

gulp.task('fonts', function() {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/'))
})

gulp.task('styles', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ grid:true }))
    .pipe(cleanCSS({compatibility: 'ie10'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist/css'))
    .pipe(sourcemaps.write());
});

gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/img']);
});

gulp.task('critical-css', function () {
  return gulp.src('./dist/css/style.min.css')
    .pipe(criticalCss({
      out: 'critical.php', // output file name
      keepLargerMediaQueries: true,
      propertiesToRemove: [
      '(.*)transition(.*)',
      'cursor',
      'pointer-events',
      '(-webkit-)?tap-highlight-color',
      '(.*)user-select'
      ],
      renderWaitTime: 10000,
      blockJSRequests: false,
      url: '{{base_url}}', // url from where we want penthouse to extract critical styles
      width: 1903, // max window width for critical media queries
      height: 984, // max window height for critical media queries
      userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' // pretend to be googlebot when grabbing critical page styles.
  }))
  .pipe(gulp.dest('./template-parts/')); // destination folder for the output file
});

gulp.task('version', function() {
  return gulp.src(['functions.php'])
    .pipe(replace('{{theme_version}}', ((new Date()).getTime())))
    .pipe(gulp.dest('./'));
});

/*gulp.task('default', gulp.series('clean', function(done) { 
    gulp.parallel('styles', 'scripts', 'images');
    done();
}));*/
gulp.task('default', gulp.series('clean', gulp.parallel('styles', 'scripts', 'vendor-scripts', 'images', 'fonts', 'version')));

gulp.task('build', gulp.series('clean', gulp.parallel('styles', 'scripts', 'vendor-scripts', 'images', 'fonts', 'version'), 'critical-css'));

gulp.task('watch', function() {

  gulp.watch('src/scss/**/*.scss', gulp.series('styles'));
  gulp.watch('src/js/**/*.js', gulp.series('scripts'));
  gulp.watch('src/img/**/*', gulp.series('images'));

});