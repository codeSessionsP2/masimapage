#!/bin/bash
# Script used for travis to push build folder content to gh-pages branch

# Get repo url (should be https://github.com/user/repo.git)
url=$(git config remote.origin.url)

# Remove 'https://' prefix and '.git' suffix
rid=$(echo "${url:8:-4}")
echo "Deploying to $rid into gh-pages branch"

cd build
git init
git config user.name "travis"
git config user.email "travis@email.com"
git add .
git commit -m "CI Deployment to Github Pages"
git push --force --quiet "https://${GH_TOKEN}@$rid" master:gh-pages > /dev/null 2>&1
