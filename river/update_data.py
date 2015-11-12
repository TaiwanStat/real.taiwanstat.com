#! /usr/bin/env python
# -*- coding: utf-8 -*-
from lib import json_io
import os
base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)
import sys
data1 = json_io.read_json('./data1.json')['result']['records']
data2 = json_io.read_json('./data2.json')['result']['records']
data3 = json_io.read_json('./data3.json')['result']['records']
data4 = json_io.read_json('./data4.json')['result']['records']

data = data1 + data2 + data3 + data4
new_data = {}

for row in data:
    if row['SiteName'] not in new_data:
        new_data[row['SiteName']] = { \
                'city': row['County'], \
                'riverName"': row['River'], \
                'date': row['SampleDate'], \
                'basin': row['Basin'] \
                }
    prop = row['ItemEngAbbreviation']
    value = row['ItemValue']
    new_data[row['SiteName']][prop] = value

print (new_data.keys())
json_io.write_json('./data/river.json', new_data) 
