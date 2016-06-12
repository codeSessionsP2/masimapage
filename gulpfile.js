/*
Gulpfile.js file for masima page.
How to use it review the README.md
*/

/* Custom source folder -> watched by gulp */
var srcDir = 'src';

/* Custom build folder -> used for preview */
var buildDir = 'build';

/* Needed gulp config */
var gulp = require('gulp');  
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var neat = require('node-neat');
var clean = require('gulp-clean');
var reload = browserSync.reload;

/* Helper function copying src folders recrusively to build dir*/
function cpSourceDir(folderName) {
  return gulp.src(srcDir + '/' + folderName + '/**/*.*', {
    base: srcDir + '/' + folderName
  })
  .pipe(gulp.dest(buildDir + '/' + folderName));
}

/* Copies folders & files from src- to build-dir */
gulp.task('build', ['sass', 'scripts'], function() {
  cpSourceDir('img');
  cpSourceDir('fonts');
  return gulp.src([
   srcDir + '/index.html',
   srcDir + '/budapest.mp3'
  ])
  .pipe(gulp.dest(buildDir + '/'));
});

/* Removes the build directory */
gulp.task('clean', function() {
  	return gulp.src(buildDir, {read: false})
		.pipe(clean());
});

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    srcDir + '/js/*.js'
    ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(buildDir + '/js'));
});

/* Sass task */
gulp.task('sass', function () {  
    gulp.src(srcDir + '/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: ['scss'].concat(neat)
    }))
    .pipe(gulp.dest(srcDir + '/css'))
    .pipe(minifycss())
    .pipe(gulp.dest(buildDir + '/css'))
    /* Reload the browser CSS after every change */
    .pipe(reload({stream:true}));
});

/* Reload task */
gulp.task('bs-reload', ['build'], function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', ['build'], function() {
    browserSync.init([srcDir + '/css/*.css', srcDir + '/js/*.js'], {
        /*
        I like to use a vhost, WAMP guide: https://www.kristengrote.com/blog/articles/how-to-set-up-virtual-hosts-using-wamp, XAMP guide: http://sawmac.com/xampp/virtualhosts/
        */
        /* proxy: 'masimapage.dev' */
        /* For a static server you would use this: */
        
        server: {
            baseDir: './' + buildDir
        }
    });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'scripts', 'build', 'browser-sync'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch([srcDir + '/scss/*.scss'], ['sass'])
    /* Watch app.js file, run the scripts task on change. */
    gulp.watch([srcDir + '/js/*.js'], ['scripts'])
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch([srcDir + '/*.html'], ['build', 'bs-reload']);
});
