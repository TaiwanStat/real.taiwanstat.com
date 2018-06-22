#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
wget -O data.xml https://alerts.ncdr.nat.gov.tw/RssAtomFeed.ashx?AlertType=8
