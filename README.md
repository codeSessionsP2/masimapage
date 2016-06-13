# Masima's Static Landing Page
This is the source of our static masima landing page [masima.rocks](http://masima.rocks).

For development workflow gulp, sass and browser-sync is used.

# Devel Dependencies

[![devDependency Status](https://david-dm.org/mxklb/masimapage/dev-status.svg)](https://david-dm.org/mxklb/masimapage#info=devDependencies)

`npm >= 3.4.0`, for installation instructions have a look at [node.js](https://nodejs.org/en/download/)

### Gulp

To install gulp global execute: 
```
sudo npm install --global gulp
```

# Build Instructions

## Installing dependencies for Gulp-Runner task

To install all dependencies for the *gulpfile.js* change to project directory and execute:
```
npm install
```

Note: This installs all dependencies listed in the *package.json* file (use `--save-dev` to update). 

## Running
Go to console and change to project directory and execute:
```
gulp
```
Gulp builds artifacts, compiles `scss` to `css` and starts browser-sync to open the page in a browser. 

Changes within the source `html`, `js` & `scss` are watched by gulp, browser sync updates the browser .. 
