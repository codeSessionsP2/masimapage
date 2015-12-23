# Masima's Static Landing Page
This is the source of our plain static masima landing page.

Check it out @ [masima.rocks](http://masima.rocks)

For development workflow gulp, sass and browser-sync is used.

# Build Dependencies

npm >= 3.4.0

For installation instructions have a look at [node.js](https://nodejs.org/en/download/)

### Gulp

To install gulp global: 
```
npm install --global gulp
```

# Build Instructions

## Installing dependencies for Gulp-Runner task

To install all dependencies for the *gulpfile.js* change to project directory and execute:
```
npm install gulp gulp-util gulp-sass gulp-uglify gulp-rename gulp-minify-css gulp-notify gulp-concat gulp-plumber browser-sync node-neat --save-dev
```

## Running
Go to console and change to project directory and execute:
```
gulp
```
Gulp compiles scss to css, starts browser-sync to open the page in a browser. Changes to js, scss are watched by gulp, Browser sync updates the browser, no refresh needed. 
