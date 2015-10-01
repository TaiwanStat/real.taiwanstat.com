#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
cd air/ && python3 crawl_data.py
cd ../power/ && python parse_data.py
cd ../uv/ &&  python update_data.py
cd ../gamma/data/ && python gammamonitor.py
cd $DIR && python data_to_firebase.py
