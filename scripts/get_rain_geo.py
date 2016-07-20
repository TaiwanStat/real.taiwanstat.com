import json
import requests

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=0)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

import sys

rains = read_json(sys.argv[1])

output = {}
for r in rains:
    if r['County'] not in output:
        output[r['County']] = {}
        print ('<option value="' + r['County'] + '">' + r['County'] + '</option>')
    if r['Township'] not in output[r['County']]:
        output[r['County']][r['Township']] = []

    output[r['County']][r['Township']].append(r['SiteName'])

write_json('rain_site.json', output)
