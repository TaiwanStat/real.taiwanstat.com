#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
import requests
import sys
from datetime import datetime
from datetime import timedelta
from datetime import date
from lib import csv_io
from lib import json_io
from lib import geo


def getDaysWithin(data):
    days1, days3, days7 = [], [], []
    for item in data:
        event_date = datetime.strptime(item[1], '%Y/%m/%d').date()
        if event_date > now:
            break
        delta = now - event_date
        item[-1], item[-2] = float(item[-1]), float(item[-2])
        if delta.days < 7:
            tmp = list(item)
            if delta.days < 3:
                tmp.append('red')
                days3.append(item)
                if delta.days < 1:
                    days1.append(item)
            else:
                tmp.append('cadetblue')
            days7.append(tmp)

    return days1, days3, days7

if __name__ == '__main__':
    url = 'http://denguefever.csie.ncku.edu.tw/file/dengue_all_v2.csv'
    data = csv_io.req_csv(url, 'utf-8')

    output_data = {}
    now = datetime.strptime(data[-4][1], '%Y/%m/%d').date()
    header = data[0]
    header[1], header[2], header[-2], header[-1] = '日期', '區別', 'Latitude', 'Longitude'
    data = data[1:]
    days1, days3, days7 = getDaysWithin(data)
    days1 = geo.get_hot_points(days1, len(days1)*0.03, 500)
    days1.insert(0, header)
    days3 = geo.get_hot_points(days3, len(days3)*0.03, 500)
    days3.insert(0, header)
    #days5 = geo.get_hot_points(days5, len(days5)*0.03, 500)
    #days5.insert(0, header)
    output_data['three'] = days3
    output_data['one'] = days1

    json_io.write_json('../data/data.json', output_data)

    header.append('color')
    days7.insert(0, header)
    csv_io.write_csv('../data/data.csv', days7)
