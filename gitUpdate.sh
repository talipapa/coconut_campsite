#!/bin/bash

# Default commit message
commit_message=""

# Parse options
while getopts ":m:" opt; do
  case ${opt} in
    m )
      commit_message=$OPTARG
      ;;
    \? )
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    : )
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Check if the commit message was provided
if [ -z "$commit_message" ]; then
  echo "Error: Commit message is required. Use -m \"Your message\""
  exit 1
fi

cd api_backend && php artisan cache:clear

cd ../

# Add changes to staging
git add .

# Commit with the provided message
git commit -m "$commit_message"

# Confirm success
echo "Committed with message: '$commit_message'"

git push