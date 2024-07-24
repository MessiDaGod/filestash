#!/bin/bash

cd docker
docker-compose down
docker build -t custom_filestash_image . --no-cache
docker-compose up -d
