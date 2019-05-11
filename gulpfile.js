// Gulpfile.js file for masima.rocks page.
// How to use this review the README.md

// Custom source folder -> watched by gulp
var srcDir = 'src';

// Custom build folder -> used for preview
var buildDir = 'build';

// Define the mainline -> uses the CNAME
var mainlineUser = 'codeSessionsP2';

// Required packages
var gulp = require('gulp');
var clean = require('gulp-clean');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var ghPages = require('gulp-gh-pages');
var htmlMin = require('gulp-htmlmin');
var plumber = require('gulp-plumber');
var rmFiles = require('gulp-remove-files');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var neat = require('node-neat');
var git = require('simple-git')('./');
var browserSync = require('browser-sync');

// Initial deployment vars
var branch = 'badBranch';
var mainline = false;

/* Copies a src folders recrusively to build dir */
function cpSourceDir(folderName) {
  return gulp.src(srcDir + '/' + folderName + '/**/*.*', {
    base: srcDir + '/' + folderName
  })
  .pipe(gulp.dest(buildDir + '/' + folderName));
}

// Checks if the connected repo is from mainlineUser
gulp.task('remote', function() {
  return git.getRemotes(true, function(err, remotes) {
    if( remotes.length == 1 ) {
      repo = JSON.stringify(remotes[0].refs.push);
      if( repo.indexOf(mainlineUser) > -1 ) {
        mainline = true;
      }
    }
  });
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
  .pipe(cleanCss({compatibility: 'ie8'}))
  .pipe(rename('style.css'))
  .pipe(gulp.dest(buildDir + '/css'))
  // Reload the browser CSS after every change
  .pipe(browserSync.reload({stream:true}));
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

// Shrink index.html file into build dir
gulp.task('minify', function() {
  return gulp.src(srcDir + '/index.html')
  .pipe(rename('index.hr.html'))
  .pipe(gulp.dest(buildDir))
  .pipe(htmlMin({
    removeComments: true,
    collapseWhitespace: true
  }))
  .pipe(rename('index.html'))
  .pipe(gulp.dest(buildDir));
});

// Copies folders & files from src- to build dir
// For mainline builds the CNAME file get copied
gulp.task('build', gulp.series('remote', 'sass', 'scripts', 'minify', function() {
  var files = [];
  files[0] = srcDir + '/budapest.mp3';
  if( mainline === true ) {
    console.log('Mainline build detected!');
    files[1] = srcDir + '/CNAME';
  }
  cpSourceDir('img');
  cpSourceDir('fonts');
  return gulp.src(files).pipe(gulp.dest(buildDir + '/'));
}));

// Initializes the var branch with current git branch
gulp.task('branch', function() {
  return git.branch(function(err, branchSummary) {
    branch = branchSummary.current;
  });
});

// Push build folder content to gh-pages (current git user)
gulp.task('deploy', gulp.series('build', 'branch', function() {
  return gulp.src('./' + buildDir +'/**/*')
  .pipe(ghPages({
    message: 'Manual Deployment to Github Pages (' + branch + ')'
  }));
}));

// Remove development files for deployment (*.hr.*)
gulp.task('release', gulp.series('build', function () {
  return gulp.src('./' + buildDir + '/**/*.hr.*', {
    base: './' + buildDir
  })
  .pipe(rmFiles());
}));

// Removes the build directory
gulp.task('clean', function() {
  return gulp.src(buildDir, {read: false})
  .pipe(clean());
});

// Browser-sync reload
gulp.task('bs-reload', gulp.series('build', function () {
  browserSync.reload();
}));

// Prepare Browser-sync for localhost
gulp.task('browser-sync', gulp.series('build', function() {
  browserSync.init([srcDir + '/css/*.css', srcDir + '/js/*.js'], {
    server: { baseDir: './' + buildDir }
  });
}));

// Watch scss, js and html files, doing different things with each
gulp.task('default', gulp.series('browser-sync', function () {
  // Watch scss, run the sass task on change
  gulp.watch([srcDir + '/scss/*.scss'], ['sass']);
  // Watch js files, run the scripts task on change
  gulp.watch([srcDir + '/js/*.js'], ['scripts']);
  // Watch .html files, run the bs-reload task on change
  gulp.watch([srcDir + '/*.html'], ['bs-reload']);
}));
