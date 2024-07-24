#!/bin/bash

cd docker
docker-compose down

# Pull the latest code from your GitHub repository
cd ..
git pull origin main
cd docker

docker-compose build
docker-compose up -d
