// Gulpfile.js file for masima.rocks page.
// How to use this review the README.md

// Custom source folder -> watched by gulp
var srcDir = 'src';

// Custom build folder -> used for preview
var buildDir = 'build';

// Define the mainline -> uses the CNAME
var mainline = 'codeSessionsP2';

// Needed gulp config
var gulp = require('gulp');
var sass = require('gulp-sass');
var git = require('simple-git')('./');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var cleancss = require('gulp-clean-css');
var ghPages = require('gulp-gh-pages');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var removeFiles = require('gulp-remove-files');
var gitBranch = require('git-branch-name');
var browserSync = require('browser-sync');
var neat = require('node-neat');
var clean = require('gulp-clean');
var reload = browserSync.reload;
var branch = 'badBranch';
var mainline = false;

/* Copies a src folders recrusively to build dir */
function cpSourceDir(folderName) {
  return gulp.src(srcDir + '/' + folderName + '/**/*.*', {
    base: srcDir + '/' + folderName
  })
  .pipe(gulp.dest(buildDir + '/' + folderName));
}

// Copies folders & files from src- to build dir
// For mainline builds the CNAME file get copied
gulp.task('build', ['remote', 'sass', 'scripts', 'minify'], function() {
  var files = new Array();
  //files[1] = srcDir + '/index.html';
  files[1] = srcDir + '/budapest.mp3';
  if( mainline == true ) {
    console.log('Mainline build detected!');
    files[2] = srcDir + '/CNAME';
  }
  cpSourceDir('img');
  cpSourceDir('fonts');
  return gulp.src(files).pipe(gulp.dest(buildDir + '/'));
});

// Checks if the connected repo is the mainline
gulp.task('remote', function() {
  git.getRemotes(true, function(err, remotes) {
    if( remotes.length == 1 ) {
      repo = JSON.stringify(remotes[0]['refs']['push']);
      if( repo.indexOf(mainline) > -1 ) {
        //console.log(JSON.stringify(remotes[0]['refs']['push']));
        mainline = true;
      }
    }
  })
});

// Compiles scss to css & minifies
gulp.task('sass', function () {  
    return gulp.src(srcDir + '/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({
        includePaths: ['scss'].concat(neat)
    }))
    .pipe(rename('style.hr.css'))
    .pipe(gulp.dest(buildDir + '/css'))
    .pipe(cleancss({compatibility: 'ie8'}))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(buildDir + '/css'))
    // Reload the browser CSS after every change
    .pipe(reload({stream:true}));
});

// Concatinate js files & minifies  
gulp.task('scripts', function() {
  return gulp.src([
    // Add js files here, they will be combined in this order
    srcDir + '/js/*.js'
    ])
    .pipe(concat('main.hr.js'))
    .pipe(gulp.dest(buildDir + '/js'))
    .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest(buildDir + '/js'));
});

// Shrinks html files into src dir
gulp.task('minify', function() {
  return gulp.src(srcDir + '/index.html')
    .pipe(rename('index.hr.html'))
    .pipe(gulp.dest(buildDir))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(buildDir));
});

// Push build folder content to gh-pages (current git user)
gulp.task('deploy', ['build', 'branch'], function() {
  return gulp.src('./' + buildDir +'/**/*')
    .pipe(ghPages({message: 'Manual Deployment to Github Pages (' + branch + ')'}));
});

// Initializes the var branch with current git branch
gulp.task('branch', function() {
  gitBranch('./', function(err, branchName) {
    branch = branchName;
  });
});

// Remove developemnt files for deployment (*.hr.*)
gulp.task('release', ['build'], function () {
  return gulp.src('./' + buildDir + '/**/*.hr.*', {
    base: './' + buildDir
  })
  .pipe(removeFiles());
});

// Removes the build directory
gulp.task('clean', function() {
  return gulp.src(buildDir, {read: false})
  .pipe(clean());
});

// Browser-sync reload
gulp.task('bs-reload', ['build'], function () {
  browserSync.reload();
});

// Prepare Browser-sync for localhost
gulp.task('browser-sync', ['build'], function() {
  browserSync.init([srcDir + '/css/*.css', srcDir + '/js/*.js'], {
    server: {
      baseDir: './' + buildDir
      }
  });
});

// Watch scss, js and html files, doing different things with each
gulp.task('default', ['browser-sync'], function () {
    // Watch scss, run the sass task on change
    gulp.watch([srcDir + '/scss/*.scss'], ['sass'])
    // Watch js files, run the scripts task on change
    gulp.watch([srcDir + '/js/*.js'], ['scripts'])
    // Watch .html files, run the bs-reload task on change
    gulp.watch([srcDir + '/*.html'], ['bs-reload']);
});
