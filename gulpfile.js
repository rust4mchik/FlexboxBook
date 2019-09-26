var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  del = require('del'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache'),
  autoprefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-clean-css');

gulp.task('scss', function () {
  return gulp.src('app/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
      cascade: true
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});

gulp.task('mincss', function () {
  return gulp.src('app/css/*.css')
    .pipe(cssmin())
    .pipe(gulp.dest('docs/css'))
});

gulp.task('clean', function () {
  return del.sync('docs');
});

gulp.task('clear', function () {
  return cache.clearAll();
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      une: [pngquant()]
    })))
    .pipe(gulp.dest('docs/images'));
});

gulp.task('watch', ['browser-sync', 'scss'], function () {
  gulp.watch('app/scss/*.scss', ['scss']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'images', 'scss'], function () {

  var buildCss = gulp.src([
      'app/css/*.css'
    ])
    .pipe(gulp.dest('docs/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('docs/fonts'));

  var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('docs/js'));

  var buildHTML = gulp.src('app/*.html')
    .pipe(gulp.dest('docs'));

});