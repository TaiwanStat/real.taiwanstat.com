#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
import csv
from datetime import datetime
from geopy.distance import vincenty
import json

def write_csv(file_name, content):
    """write csv"""
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(content)

if __name__ == '__main__':
    r = requests.get('http://data.tainan.gov.tw/dataset/5855a005-1116-4e47-94c3-c9b3a05f6374/resource/c3de36ef-e294-40b7-b732-e2f2c48afd5b/download/1048.csv')
    r.encoding = 'utf-8'
    raw = r.text
    data = []
    for item in csv.reader(raw.splitlines()):
        # 編號, 日期, 區別
        data.append([item[1], item[3], item[4], item[5],  item[25], item[26], item[27],\
                item[28], item[29], item[30], item[34], item[7], item[8]])
    header = None
    new_data = []
    for row in data:
        if not header:
            row[-2] = 'Latitude'
            row[-1] = 'Longitude'
            row.append('color')
            header = row
            new_data.append(row)
            continue
        if (row[4] == '0' and row[5] == '0'):
            continue

        row[-1], row[-2] = float(row[-1]), float(row[-2])
        if (int(row[4]) > 9):
            row.append('darkpurple')
        else:
            row.append('darkgreen')
        new_data.append(row)

    write_csv('bug_data.csv', new_data)
