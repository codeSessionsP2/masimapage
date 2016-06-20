# A Static Landing Page
This is the source of the static landing page [masima.rocks](http://masima.rocks).

For development workflow gulp, sass and browser-sync is used. Rapid deployment to gh-pages can easily be achived manually by using gulp or automated with the [travis ci](https://travis-ci.org). Local development and testing is mostly automated as well as staging.

# Devel Dependencies
[![Build Status](https://travis-ci.org/codeSessionsP2/masimapage.svg?branch=master)](https://travis-ci.org/codeSessionsP2/masimapage) 
[![Dependency Status](https://david-dm.org/codeSessionsP2/masimapage.svg)](https://david-dm.org/codeSessionsP2/masimapage) 
[![devDependency Status](https://david-dm.org/codeSessionsP2/masimapage/dev-status.svg)](https://david-dm.org/codeSessionsP2/masimapage#info=devDependencies)

`npm >= 3.4.0`, for installation instructions have a look at [node.js](https://nodejs.org/en/download/)

### Gulp

To install gulp globally execute: 
```
sudo npm install --global gulp
```

# Development Instructions

## Installing dependencies for Gulp-Runner task

To install all dependencies for the *gulpfile.js* change to the project directory and execute:
```
npm install
```

Note: This installs all dependencies listed in the *package.json* file (use `--save-dev` to update). 

## Running locally
Open a terminal, change to the project directory and execute:
```
gulp
```
Gulp builds artifacts, compiles `scss` to `css`, minifies and starts browser-sync to open the page in a browser. 

Changes within the source `html`, `js` & `scss` are watched by gulp, browser sync updates the browser ..

## Manual deployment with gulp
```
gulp deploy
```
This will push the content of the current build directory to your gh-pages branch. 

## Automated deployment with travis
To automate the deployment from your master to your gh-pages branch use travis. To do so 

- Create a travis-account [here](https://travis-ci.org)
- Create a new github token for public repos [here](https://github.com/settings/tokens)
- Assign a new `GH_TOKEN` variable with that token [@travis](https://docs.travis-ci.com/user/environment-variables/#Defining-Variables-in-Repository-Settings).
- Turn on travis for this repo [here](https://travis-ci.org/profile)

Now travis should build and deploy to your gh-pages branch every time you push to your master branch.

*Note:* Make sure to turn off *build on pull request* @travis for this repository - else pull request may change your gh-pages ;)
