#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
cd air/ && python3 crawl_data.py
cd ../power/ && python parse_data.py
cd ../uv/ &&  python update_data.py
#csvjson ./data/data.csv > ./data/data.json
cd ../gamma/data/ && python gammamonitor.py
#csvjson ./gammamonitor.csv > ./gammamonitor.json
#cd $DIR && python data_to_firebase.py
cd $DIR && node csv2json.js
#cd $DIR && python insert_data_to_server.py
