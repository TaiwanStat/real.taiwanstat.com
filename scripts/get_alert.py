import json
import requests
import xmltodict, json

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

url = 'http://data.gov.tw/iisi/logaccess/3607?dataUrl=http://opendata.cwb.gov.tw/govdownload?dataid=W-C0033-002&authorizationkey=rdec-key-123-45678-011121314&ndctype=XML&ndcnid=9245'
req = requests.get(url)

o = xmltodict.parse(req.text)['cwbopendata']['dataset']

alerts = []
phenomena = o['datasetInfo']['datasetDescription']
start_time = o['datasetInfo']['validTime']['startTime']
end_time = o['datasetInfo']['validTime']['endTime']
content_text = o['contents']['content']['contentText']

affected_areas = o['hazardConditions']['hazards']['hazard']['info']['affectedAreas']['location']
locations = []
for each in affected_areas:
    locations.append(each['locationName'])

locations = ','.join(locations)

result = { \
    'phenomena': phenomena, \
    'contentText': content_text, \
    'startTime': start_time,\
    'endTime': end_time,\
    'affectedAreas': locations
}
alerts.append(result)

print (alerts)

write_json('./data/alerts.json', alerts)
