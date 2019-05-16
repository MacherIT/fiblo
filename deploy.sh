#!/bin/bash

npm run build

rm server.tar

tar -cvf server.tar app.js bin/ build/contracts config/ const.js contracts/ controllers/ migrations/ models/ modules/ public/ routes/ security/ truffle.js views/ wait-for.sh

tar -zcvf prod.tar.gz dist/ nginx-conf/ server.tar pack Dockerfile docker-compose.yml

scp prod.tar.gz planfincole@169.61.22.134:/home/planfincole/fiblo/

ssh -t planfincole@169.61.22.134 'cd /home/planfincole/fiblo; tar -xzvf prod.tar.gz; rm prod.tar.gz'

ssh planfincole@169.61.22.134
