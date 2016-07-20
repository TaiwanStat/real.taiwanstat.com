import json

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file)

import sys

data = read_json(sys.argv[1])
new_data = {}
for area in data:
    new_data[area['countyName'] + area['townName']] = area['point']

print (new_data)
write_json('geo.json', new_data)
