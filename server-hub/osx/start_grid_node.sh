#!/usr/bin/env bash

java -jar -Dwebdriver.chrome.driver="../../driver/chromedriver" ../selenium-server-standalone-3.4.0.jar \
     -role node \
     -browser browserName=firefox,maxInstances=40 \
     -browser browserName=chrome,maxInstances=40 \
     -browser browserName=iexplore,maxInstances=5 \
     -hub http://localhost:4444/grid/register