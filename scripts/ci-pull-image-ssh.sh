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

pull_image() {
    ssh $SSH_USER@$SSH_HOST "cd senior-proj-backend && \
    docker image tag $image $backup_image && \
    docker pull $upstream_image && \
    docker image tag $upstream_image $image"
}

if [[ -n "$dashboard" ]]; then
    echo --- Pulling dashboard over SSH ---
    echo

    upstream_image=docker.pkg.github.com/whatthefar/senior-proj-backend/dashboard:latest
    image=senior-proj-dashboard:backup
    backup_image=senior-proj-dashboard:latest

    pull_image
fi

if [[ -n "$nest" ]]; then
    echo --- Pulling backend over SSH ---
    echo

    upstream_image=docker.pkg.github.com/whatthefar/senior-proj-backend/backend:latest
    image=senior-proj-backend:backup
    backup_image=senior-proj-backend:latest

    pull_image
fi