var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var livereload = require('gulp-livereload');
var fs = require('fs');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');

gulp.task('scss', function() {
  gulp.src('_sass/style.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true,
      error: function(err) {
        console.log(err);
      }
    }))
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest('./css'));
});

gulp.task('scripts', function() {
  browserify('./js/main.js', {debug: true})
    .bundle()
    .pipe(source('js.min.js'))
    //.pipe(streamify(uglify({
    //  mangle: false
    //})))
    .pipe(gulp.dest('./build'));
});

gulp.task('build', function() {
  var htmls = require('../brew-yml-to-html')('./brews.yml', fs.readFileSync('./templates/brew.html', 'utf-8'));
  for (var prop in htmls) {
    // Create a html file out of this.
    var w = fs.createWriteStream(prop + '.html');
    w.write(htmls[prop]);
    w.end();
  }
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('build/**').on('change', livereload.changed);
  gulp.watch('css/**').on('change', livereload.changed);
  gulp.watch(['js/**'], ['scripts']);
  gulp.watch(['_sass/**'], ['scss']);
});
