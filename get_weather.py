import json
import requests
import xmltodict, json
req = requests.get('http://opendata.cwb.gov.tw/govdownload?dataid=O-A0003-001&authorizationkey=rdec-key-123-45678-011121314')

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

o = xmltodict.parse(req.text)['cwbopendata']['location']

data = []
for each in o:
    new = {}
    new['lat'] = each['lat']
    new['lng'] = each['lon']
    new['locationName'] = each['locationName']
    new['stationId'] = each['stationId']
    new['obsTime'] = each['time']['obsTime']
    for e in each["weatherElement"]:
        new[e["elementName"]] = e["elementValue"]['value']
    
    for p in each["parameter"]:
        new[p["parameterName"]] = p["parameterValue"]
    data.append(new)

write_json('./data/weather.json', data)
