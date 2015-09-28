#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
import csv


def write_csv(file_name, content):
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)  
        writer.writerows(content)  

r = requests.get('http://data.tainan.gov.tw/dataset/558392bb-96cc-4924-a6b0-1e4d223c0a57/resource/5f154e10-a504-4ce4-9455-28ad7cd0c9ed/download/2015denguefeverendenmiccases.csv') 
r.encoding = 'big5'
raw = r.text
data = []
for item in csv.reader(raw.splitlines()):
    data.append(item)

data.pop(1) # remove 103 year
header = True
for row in data:
    if header:
        row[1] = '日期'
        row[2] = '區別'
        row[-2] = 'Latitude'
        row[-1] = 'Longitude'
        header = False
        continue
    # date convert 104 convert 105
    if '.' in row[1]:
        y, m, d = row[1].split('.')
        y = '2015'
        m = str(int(m))
        d = str(int(d))
        row[1] = '/'.join([y, m, d])
        row[4] += '里'

write_csv('data.csv', data)
