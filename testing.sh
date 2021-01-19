#!/bin/bash

echo "Running script..." 
# docker stop mm
# docker rm mm
cd "/Users/andreaspfeifer/Documents/GitHub/Docker/magicmirror/mounts/modules/MMM-Bergfex"
# git checkout dev
git pull
cd "/Users/andreaspfeifer/Documents/GitHub/Docker/magicmirror/run"
docker-compose up -d 
docker logs -f mm