#!/bin/bash

export PORT=53100
export BCF="8ee2e16d5e745f485955613e68f033ef"
export NODE_ENV="production"

export HOST="localhost"
export DB_NAME="mymacherit_fiblo_rsk"
export DB_USERNAME="mymacherit_fiblo_admin"
export DB_PASSWORD="Neurosoluciones2109"

pm2 stop "fiblo-node-rsk"
pm2 start /home/mymacherit/fiblo-rsk/bin/www --name "fiblo-node-rsk"
