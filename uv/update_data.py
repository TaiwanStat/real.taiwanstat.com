#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import csv
import sys
import requests
import StringIO
import os
#import geocoder

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)


def read_csv(response):
    data = []
    reader = csv.reader(StringIO.StringIO(response.content))
    for row in reader:
        data.append(row)
    return data[0] if len(data) == 1 else data

def write_csv(file_name, content):
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)  
        writer.writerows(content)  

params = {'$orderby': 'PublishAgency', '$skip': '0', '$top': '1000', 'format': 'csv'}

data = read_csv(requests.get('http://opendata.epa.gov.tw/ws/Data/UV/', params=params))

locations = {}
import time
for i in range(1, len(data)):
    row = data[i]
    print row
    row[4] = row[4].replace('.', '').replace(',', '.', 1).replace(',', '')
    row[4] = "{:.9f}".format(float(row[4]))
    row[5] = row[5].replace('.', '').replace(',', '.', 1).replace(',', '')
    row[5] = "{:.9f}".format(float(row[5]))
    '''locations[row[0]] = geocoder.google('台灣 ' + row[0]).latlng
    time.sleep(1)
    print row[0], locations[row[0]]'''

import json
  
'''def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)'''


write_csv('./data/data.csv', data)
#write_json('./data/locations.json', locations)
