# Masima's Static Landing Page
This is the source of our static masima landing page [masima.rocks](http://masima.rocks).

For development workflow gulp, sass and browser-sync is used.

# Devel Dependencies
[![Build Status](https://travis-ci.org/mxklb/masimapage.svg?branch=master)](https://travis-ci.org/mxklb/masimapage) [![devDependency Status](https://david-dm.org/mxklb/masimapage/dev-status.svg)](https://david-dm.org/mxklb/masimapage#info=devDependencies)

`npm >= 3.4.0`, for installation instructions have a look at [node.js](https://nodejs.org/en/download/)

### Gulp

To install gulp global execute: 
```
sudo npm install --global gulp
```

# Development Instructions

## Installing dependencies for Gulp-Runner task

To install all dependencies for the *gulpfile.js* change to project directory and execute:
```
npm install
```

Note: This installs all dependencies listed in the *package.json* file (use `--save-dev` to update). 

## Running locally
Go to console and change to project directory and execute:
```
gulp
```
Gulp builds artifacts, compiles `scss` to `css` and starts browser-sync to open the page in a browser. 

Changes within the source `html`, `js` & `scss` are watched by gulp, browser sync updates the browser ..

## Deployment using travis
For automated deployment to a gh-pages branch [travis](https://travis-ci.org) can be used. To do so 

- Create a travis-account [here](https://travis-ci.org)
- Create a new github token for public repos from [here](https://github.com/settings/tokens)
- Encrypt that token using the travis ruby gem (`gem install travis`)
  Make sure to be logged in (`travis login`).
  - `travis encrypt -r gh_user/gh_repo "GH_TOKEN=encrypted_token_here" --add`
    The add option directly puts it into the *.travis.yml* file. 
- Turn on travis for this repo [here](https://travis-ci.org/profile)

Now travis should build and deploy to your gh-pages branch every time you push to master.

*Note:* Make sure to turn off “build on pull request” on travis for this repository, don’t want someone else offering a pull request and changing your blog!
