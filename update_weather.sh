#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR && python3 get_weather.py
cd $DIR && python3 insert_weather.py
