#!/bin/bash

source .env.development

npm install --legacy-peer-deps

rm -rf dist

echo "---------------Run migrations---------------"
until nc -z -v -w30 gerocuidado-forum-db 5002; do
  echo "Esperando o PostgreSQL iniciar..."
  sleep 1
done

npm run typeorm:run

echo "---------------Run migrations - END---------"

npm run start:debug
