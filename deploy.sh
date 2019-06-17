#!/bin/bash
# Script used by to push build folder content to gh-pages branch
# Note: $1 can be used to define the commit message

remote="undefined"

# Get repo url (https://github.com/user/repo.git or git@github.com:user/repo.git)
url=$(git config remote.origin.url)

# Prepare remote variable to be github.com/user/repo
if [[ $url == *"https"* ]]; then
  echo "Use https URL with token for git operations .."
  # Remove 'https://' prefix and '.git' suffix
  remote=$(echo "${url:8:-4}")
  # Check for github token
  if [ -z "$GH_TOKEN" ]; then
    echo "ERROR: Set environment variable GH_TOKEN to be able to push to github!"
    exit
  fi
else
  echo "Use ssh URL without token for git operations .."
  # Remove 'git@' prefix and '.git' suffix && replace : with /
  remote=$(echo "${url:4:-4}")
  remote=$(echo $remote | sed 's/:/\//g')
fi
echo "Deploying to $remote into branch gh-pages"

# Prepare gh-pages commit message
commitMessage="Manual deployment to Github Pages"
if [ -n "$1" ]; then
  commitMessage="$1"
fi

# Extract user & repo names
set -- "$remote"
IFS="/"; declare -a split=($*)
user="${split[1]}"
repo="${split[2]}"

gitCloneUrl="$url"
gitPushUrl="$gitCloneUrl"
if [[ $url == *"https"* ]]; then
  gitCloneUrl="https://$user:${GH_TOKEN}@$remote.git"
  gitPushUrl="https://${GH_TOKEN}@$remote"
fi

# Clone master branch from user repo
git clone --quiet "$gitCloneUrl" --branch=master source
if [ ! -d "source" ]; then
  echo "ERROR: Failed to clone $url"
  exit
fi
cd source

# Get latest commit ID from master branch
head=$(git log --format="%h" -n 1)
user=$(git log -1 --pretty=format:'%an')

# Switch to gh-pages + apply changes
git checkout --quiet gh-pages
git ls-files -z | xargs -0 rm -f
git ls-tree --name-only -d -r -z HEAD | sort -rz | xargs -0 rmdir
cp -rf ../build/* .
git add -A

# Check for changes
status=$(git status)
echo "$status";

# Setup travis git user, commit and push changes
if [[ $status != *"nothing to commit"* ]] ; then
  git config user.name "travis"
  git config user.email "travis@email.com"
  git commit -m "$commitMessage (triggered by: $user@$head)"
  git push --force --quiet "$gitPushUrl" gh-pages:gh-pages > /dev/null 2>&1
fi
