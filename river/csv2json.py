#! /usr/bin/env python
# -*- coding: utf-8 -*-
import json
import csv
import os
base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

def read_csv(file_name):
    data = []
    with open(file_name, 'r') as input_file:
        reader = csv.reader(input_file)
        for i, row in enumerate(reader):
            if(i != 1 and i != 2):
                data.append(row)
    return data[0] if len(data) == 1 else data

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file)

import sys

output = {}
data = read_csv(sys.argv[1])
for i in range(1, len(data)):
    output[data[i][4]] = {}
    for j in range(0, len(data[i])):
        output[data[i][4]][data[0][j]] = data[i][j]
write_json('./data/river.json', output)
