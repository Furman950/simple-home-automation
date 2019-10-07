#!/bin/bash
echo "Running deply script"
set -ev

if [ $# -ne 4 ]
then
    echo "Invalid number of arguments passed, required 4, found $#"
    exit 1
fi

curl "$4"

TAG=$1
DOCKER_USERNAME=$2
DOCKER_PASSWORD=$3
NAME="furman9596/simple-home-automation-amd64"

bash ./discordWebhook.sh success "Starting Docker Build" "Staring to build $NAME:$TAG!" $WEBHOOK_URL
docker build -f ./Dockerfile -t "$NAME:$TAG" .
bash ./discordWebhook.sh success "Finished Docker Build" "Finished building $NAME:$TAG!" $WEBHOOK_URL


echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

bash ./discordWebhook.sh success "Publishing to Docker Hub..." "Staring to publish $NAME:$TAG!" $WEBHOOK_URL
docker push $NAME:$TAG
bash ./discordWebhook.sh success "Published to Docker Hub!" "Finishedpublish $NAME:$TAG!" $WEBHOOK_URL