#!/bin/bash
# Script used for travis to push build folder content to gh-pages branch

# Get repo url (should be https://github.com/user/repo.git)
url=$(git config remote.origin.url)

# Remove 'https://' prefix and '.git' suffix
remote=$(echo "${url:8:-4}")
echo "Deploying to $remote into branch gh-pages"

# Extract user & repo names
set -- "$remote" 
IFS="/"; declare -a split=($*) 
user="${split[1]}"
repo="${split[2]}"

# Clone master branch from user repo
git clone --quiet "https://$user:${GH_TOKEN}@github.com/$user/$repo.git" --branch=master gh-pages
cd gh-pages

# Get latest commit ID from master branch
head=$(git log --format="%h" -n 1)

# Switch to gh-pages + apply changes
git checkout --quiet gh-pages
cp -rf ../build/* .
git add -A
git status

# Setup travis git user
git config user.name "travis"
git config user.email "travis@email.com"

# Commit and push
git commit -m "CI Deployment to Github Pages (master@$head)"
git push --force --quiet "https://${GH_TOKEN}@$remote" gh-pages:gh-pages > /dev/null 2>&1
