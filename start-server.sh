#!/bin/bash

export PORT=52800
export BCF="8ee2e16d5e745f485955613e68f033ef"
export NODE_ENV="production"

export HOST="localhost"
export DB_NAME="mymacherit_fiblo"
export DB_USERNAME="mymacherit_fiblo_admin"
export DB_PASSWORD="Neurosoluciones2109"

pm2 stop "fiblo-node"
pm2 start /home/mymacherit/fiblo/bin/www --name "fiblo-node"
