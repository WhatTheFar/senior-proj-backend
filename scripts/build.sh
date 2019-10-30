#!/bin/bash

echo "Commit range ${COMMIT_RANGE}"

if [[ $COMMIT_RANGE != *"..."* ]]; then
  # Unfortunately we don't always get a commit range from circleci.
  # Walk through each changed file within the commit.
  echo "No commit range? (${COMMIT_RANGE})"

  diff=`git diff-tree --no-commit-id --name-only -r $COMMIT_RANGE`
else
  # Walk through each changed file within the commit range.
  echo "Proper commit range = ${COMMIT_RANGE}"

  diff=`git diff --name-only $COMMIT_RANGE`
fi

echo
echo --- Diff ---
echo "$diff"
echo
echo

dashboard=`echo "$diff" | grep -E '^dashboard'`
nest=`echo "$diff" | grep -E '^nest'`

if [[ -n "$dashboard" ]]; then
    echo --- Building dashboard ---
    echo
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build dashboard

    echo --- Pushing dashboard ---
    echo
    docker tag senior-proj-dashboard docker.pkg.github.com/whatthefar/senior-proj-backend/dashboard:latest
    docker push docker.pkg.github.com/whatthefar/senior-proj-backend/dashboard:latest
fi

if [[ -n "$nest" ]]; then
    echo --- Building backend ---
    echo
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml build backend

    echo --- Pushing backend ---
    echo
    docker tag senior-proj-dashboard docker.pkg.github.com/whatthefar/senior-proj-backend/backend:latest
    docker push docker.pkg.github.com/whatthefar/senior-proj-backend/backend:latest
fi