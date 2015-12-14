# -*- coding: utf-8 -*-
import csv
import sys
import geocoder
def read_csv(file_name):
    data = []
    with open(file_name, 'r') as input_file:
        reader = csv.reader(input_file)
        for row in reader:
            data.append(row)
    return data[0] if len(data) == 1 else data

def write_csv(file_name, content):
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(content)

data = read_csv(sys.argv[1])
header = data[0] + ['lat', 'lng']
data = data[1:]

import time
for row in data:
    tmp = geocoder.google('台灣 ' + row[-2]).latlng
    time.sleep(1)
    row.append(tmp[0])
    row.append(tmp[1])

write_csv('./data/movie_location.csv', data)
