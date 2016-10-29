#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR/scripts && python3 get_weather.py
cd $DIR/scripts && python3 insert_weather.py
