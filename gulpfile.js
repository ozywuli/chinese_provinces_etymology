var gulp = require('gulp');
var rename = require('gulp-rename');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var cmq = require('gulp-combine-media-queries');

var source = require('vinyl-source-stream');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require('babelify');
var watchify = require('watchify');
var notify = require('gulp-notify');



function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}




function compileHTML() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build/'));
}
function compileCSS() {
  return gulp.src('src/assets/scss/main.scss')
    .pipe(plumber({
      errorHandler: function(err) {
        this.emit('end')
      }
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe( autoprefixer('last 2 version') )
    .pipe( cmq({
      log: true
    }))
    .pipe( gulp.dest('build/assets/css'))
    .pipe( minifycss() )
    .pipe( rename('main.min.css') )
    .pipe( gulp.dest('build/assets/css' ) )
}
function compileData() {
  return gulp.src('src/assets/data/*')
    .pipe(gulp.dest('build/assets/data'))
}

function compileJS(file, watch) {
  var props = {
    entries: ['./src/assets/js/' + file],
    debug : true,
    transform:  [babelify, reactify]
  };

  // watchify() if watch requested, otherwise run browserify() once 
  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  function rebundle() {
    var stream = bundler.bundle();
    return stream
      .on('error', handleErrors)
      .pipe(source(file))
      .pipe(gulp.dest('./build/assets/js'));
  }

  // listen for an update and run rebundle
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });

  // run it once the first time buildScript is called
  return rebundle();

}


gulp.task('html', ['css', 'js', 'data'], function() {
  return compileHTML();
});
gulp.task('css', function() {
  return compileCSS();
});
gulp.task('data', function() {
  return compileData();
})
gulp.task('js', function() {
  return compileJS('app.js', false);
})


function watchHTML(error) {
  gulp.watch(['src/*.html'], ['html'])
}
function watchCSS(error) {
  gulp.watch(['src/assets/scss/*.scss', 'src/assets/scss/**/*.scss'], ['html']);
}
function watchData(error) {
  gulp.watch(['src/assets/data/*'], ['html'])
}

function watchTask(error) {
  watchHTML();
  watchCSS();
  watchData();
  compileJS('app.js', true);
}

gulp.task('watch', ['html', 'css', 'js', 'data'], watchTask);
gulp.task('default', ['watch']);