#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import requests
from datetime import datetime
from datetime import timedelta
from datetime import date
from geopy.distance import vincenty
from lib import json_io
from lib import csv_io

def filter_data(input_):
    data = []
    for item in input_:
        data.append([item[4], item[8], item[9]])
    return data

if __name__ == '__main__':
    url = 'http://denguefever.csie.ncku.edu.tw/file/drug_all.csv'
    data = csv_io.req_csv(url, 'utf-8')
    data = filter_data(data)

    data = data[1:]
    dengue_data = csv_io.read_csv('../data/data.csv')
    tmp = dengue_data[-1][1]
    now = datetime.strptime(tmp, '%Y/%m/%d').date()

    header = ['日期', 'Latitude', 'Longitude']
    output_data = []
    for row in data:
        d = '2015年' + row[0]
        event_date = datetime.strptime(d, '%Y年%m月%d日').date()
        if event_date > now:
            break
        delta = now - event_date
        row[-1], row[-2] = float(row[-1]), float(row[-2])
        if delta.days < 7:
            output_data.append(row)
    output_data.insert(0, header)

    csv_io.write_csv('../data/drug_data.csv', output_data)
    print (output_data, 'done')
