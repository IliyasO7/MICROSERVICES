#!/bin/bash

BLUE='\033[0;34m'
Yellow='\033[0;33m'

echo "Executing npm in admin"
cd admin
npm i

echo "Executing npm in old"
cd ../old
npm i

echo "Executing npm in auth"
cd ../auth
npm i

echo "Executing npm in shared"
cd ../shared
npm i


