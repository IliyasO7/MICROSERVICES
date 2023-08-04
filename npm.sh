#!/bin/bash

BLUE='\033[0;34m'
Yellow='\033[0;33m'

echo "Executing npm in admin"
cd admin
npm i

echo "Executing npm in customer"
cd ../customer
npm i

echo "Executing npm in shared"
cd ../shared
npm i


