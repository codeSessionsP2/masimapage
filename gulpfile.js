/*
Gulpfile.js file for masima.rocks page.
How to use this review the README.md
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
var cleancss = require('gulp-clean-css');
var ghPages = require('gulp-gh-pages');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var gitBranch = require('git-branch-name');
var browserSync = require('browser-sync');
var neat = require('node-neat');
var clean = require('gulp-clean');
var reload = browserSync.reload;
var branch = 'badBranch';
 
/* Helper function copying src folders recrusively to build dir*/
function cpSourceDir(folderName) {
  return gulp.src(srcDir + '/' + folderName + '/**/*.*', {
    base: srcDir + '/' + folderName
  })
  .pipe(gulp.dest(buildDir + '/' + folderName));
}

/* Initializes the var branch with current git branch */
gulp.task('branch', function() {
  gitBranch('./', function(err, branchName) {
    branch = branchName;
  });
});

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


/* Pushes build folder content to gh-pages (current git user) */
gulp.task('deploy', ['build', 'branch'], function() {
  return gulp.src('./' + buildDir +'/**/*')
    .pipe(ghPages({message: 'Manual Deployment to Github Pages (' + branch + ')'}));
});

/* Scripts task */
gulp.task('scripts', function() {
  return gulp.src([
    /* Add your JS files here, they will be combined in this order */
    srcDir + '/js/*.js'
    ])
    .pipe(concat('main.hr.js'))
    .pipe(gulp.dest(buildDir + '/js'))
    .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest(buildDir + '/js'));
});

/* Sass task */
gulp.task('sass', function () {  
    gulp.src(srcDir + '/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: ['scss'].concat(neat)
    }))
    .pipe(rename('style.hr.css'))
    .pipe(gulp.dest(buildDir + '/css'))
    .pipe(cleancss({compatibility: 'ie8'}))
    .pipe(rename('style.css'))
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
        server: {
            baseDir: './' + buildDir
        }
    });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'scripts', 'build', 'browser-sync'], function () {
    /* Watch scss, run the sass task on change. */
    gulp.watch([srcDir + '/scss/*.scss'], ['sass'])
    /* Watch js files, run the scripts task on change. */
    gulp.watch([srcDir + '/js/*.js'], ['scripts'])
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch([srcDir + '/*.html'], ['build', 'bs-reload']);
});
