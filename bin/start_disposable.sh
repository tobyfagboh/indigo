#!/bin/bash

# This script will start a single "disposable" instance and connect the caller to it.
# The instance will link to all infrastructure, including the service containers (if it exists)
IMAGE_NAME="cerebro"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "${SCRIPT_DIR}")"

# First check if our image has been built. If not, build it.
if [[ $(docker inspect --format='{{.RepoTags}}' ${IMAGE_NAME}) == "[${IMAGE_NAME}:latest]" ]]; then
    echo " ----- Web App Image Available for Use. -----"
else
    echo " ----- Web App Image Does Not Exist. Building Now. -----"
    docker build -t ${IMAGE_NAME} ${ROOT}
fi

echo " ----- Starting Up Infrastructure Containers -----"

docker-compose up -d

echo " ----- Using .env File from [${ROOT}] -----"
echo " ----- Starting Disposable Docker Container -----"

# Now, depending on whether our services are running or not, link them into our disposable container.
# NB: This file is hardcoded based on settings in the composer files and the env file.
if [[ $(docker inspect --format='{{.State.Status}}' cerebro) == "running" ]]; then
    echo " ----- Linking in Web App -----"
    docker run \
        -i \
        -t \
        -v ${ROOT}:/src \
        --link=magento_selenium_hub2:selhub \
        --link=magento_selenium_chrome2:nodechrome \
        automation-sample \
        sh -c "bash"


else
    echo " ----- Web App Not Running. It Will Not Be Linked In. -----"
    docker run \
        -i \
        -t \
        -v ${ROOT}:/src \
        --link=magento_selenium_hub2:selhub \
        --link=magento_selenium_chrome2:nodechrome \
        cerebro \
        sh -c "bash"

fi

echo " ----- EXITED from disposable container -----"
echo " ----- Removing Exited Containers. -----"

# Now grep through all containers and stop those that have been "exited". Only do that for our service.
docker ps -a | grep Exited | awk '{ print $1,$2 }' | \
grep ${IMAGE_NAME} |  awk '{print $1 }' | xargs -I {} docker rm {}