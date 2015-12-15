import json
import requests
from pprint import pprint

all_data = list()
category_dict = {'1': '音樂類',
                 '2': '戲劇類',
                 '3': '舞蹈類',
                 '6': '展覽類',
                 '7': '講座類',
                 '8': '電影類',
                 '17': '演唱會'}

def insert_data(req_data):
    for art_json in req_data:
        location = art_json['showInfo'][0]['location']
        locationName = art_json['showInfo'][0]['locationName']
        if location == '' or locationName == '':
            continue

        data_dict = {"UID": art_json['UID'],
                     "title": art_json['title'],
                     "category": category_dict[art_json['category']],
                     "startDate": art_json['startDate'],
                     "endDate": art_json['endDate'],
                     "sourceWebPromote": art_json['sourceWebPromote'],
                     "locationAddress": location,
                     "locationName": locationName,
                     "locationCounty": location[:3],
                     "latitude": art_json['showInfo'][0]['latitude'],
                     "longitude": art_json['showInfo'][0]['longitude']}
        all_data.append(data_dict)

## parse art movie
req = requests.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=8')
req_data = req.json()
insert_data(req_data)
# pprint (req_data)

## parse art lectures
req = requests.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=7')
req_data = req.json()
insert_data(req_data)
# pprint (req_data)

## parse art exhibition
req = requests.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6')
req_data = req.json()
insert_data(req_data)
# pprint (req_data)

## parse art concert
req = requests.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=17')
req_data = req.json()
insert_data(req_data)
# pprint (req_data)

## parse art dance
req = requests.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=3')
req_data = req.json()
insert_data(req_data)
# pprint (req_data)

## parse art drama
req = requests.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=2')
req_data = req.json()
insert_data(req_data)
# pprint (req_data)

## parse art musical
req = requests.get('http://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=1')
req_data = req.json()
insert_data(req_data)
# pprint (req_data)

pprint (all_data)

with open('data/art.json', 'w') as myfile:
    json.dump(all_data, myfile, indent=4)
