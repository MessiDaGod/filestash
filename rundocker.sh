#!/bin/bash

cd docker

# Pull the latest code from your GitHub repository
docker-compose down
docker-compose build --build-arg CACHEBUST=$(date +%s)
docker-compose up -d
