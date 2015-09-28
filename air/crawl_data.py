import json
import requests
from pprint import pprint

req = requests.get('http://opendata.epa.gov.tw/ws/Data/AQX/?$format=json')

id_file = open('data/id.json')
id_json = json.load(id_file)
id_file.close()

air_json = json.loads(req.text)
for site_index, site in enumerate(air_json):
    air_json[site_index]['site_id'] = id_json[site['SiteName']]

with open('data/air.json', 'w') as air_file:
    json.dump(air_json, air_file)

# canner_json = {"data": {"county": list()},
               # "layout": "./index.hbs",
               # "filename": "index.html"}
# county_json = dict()

# air_json = json.loads(req.text)
# for site_index, site in enumerate(air_json):
    # tmp = county_json.get(site['County'], '')
    # if tmp == '':
        # county_json[site['County']] = {"county_name": site['County'],
                                       # "site": list()}
    # site_tmp = {"SiteName": site['SiteName'],
                # "site_id": id_json[site['SiteName']],
                # "PM25": "10",
                # "PM10": "10"}
    # county_json[site['County']]['site'].append(site_tmp)

# for county_key in county_json.keys():
    # canner_json['data']['county'].append(county_json[county_key])

# pprint (canner_json)

# with open('canner.json', 'w') as canner_file:
    # json.dump(canner_json, canner_file)
