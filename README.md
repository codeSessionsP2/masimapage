# Masima's Static Landing Page
This is the source of our plain static masima landing page.

Check it out @ [masima.rocks](http://masima.rocks)

For development workflow gulp, sass and browser-sync are used.

## Requirements ##

npm >= 3.4.0

For instructions have a look at [node.js](https://nodejs.org/en/download/)

## Installation instructions ##

### Gulp ###

To install gulb global: 
'''
npm install --global gulp
'''

### Installing dependencies for Gulp-Runner task ###

To install all dependencies for the gulpfile.js change to project directory and run:
'''
npm install gulp gulp-util gulp-sass gulp-uglify gulp-rename gulp-minify-css gulp-notify gulp-concat gulp-plumber browser-sync node-neat --save-dev
'''

## Running ##
Go to console and change to project directory.
run:
'''
gulp
'''
Gulp compiles scss to css, starts browser-sync to open the page in a browser. Changes to js, scss are watched by gulp, Browser sync updates the browser, no refresh needed. 
