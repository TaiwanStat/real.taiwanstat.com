import json
import requests
from bs4 import BeautifulSoup
import xmltodict, json

def parseCityList(citys, pred_date):
    preds = {}
    props = ['pred_temp', 'pred_rain', 'pred_status']
    for i in range(1, len(citys)):
        tds = citys[i].find_all('td')
        city = tds[0].text
        preds[city] = {}
        preds[city]['pred_temp'] = tds[1].text
        preds[city]['pred_rain'] = tds[2].text
        preds[city]['pred_status'] = (tds[3].find('img').get('alt'))
        preds[city]['pred_date'] = pred_date
        print (preds[city]['pred_status'])

    return preds

city_preds = {}

req = requests.get('http://www.cwb.gov.tw/V7/forecast/f_index.htm')
req.encoding = 'big-5'
boca_soup = BeautifulSoup(req.text, "html.parser") #get text content of the website

update_at = boca_soup.find('div', attrs={"class": "modifyedDate"}).text

n_area = boca_soup.find("table", attrs={"class": "N_AreaList"}) #find the data table
citys = n_area.find_all('tr')
city_preds.update( parseCityList(citys, update_at) )

c_area = boca_soup.find("table", attrs={"class": "C_AreaList"}) #find the data table
citys = c_area.find_all('tr')
city_preds.update( parseCityList(citys, update_at) )

s_area = boca_soup.find("table", attrs={"class": "S_AreaList"}) #find the data table
citys = s_area.find_all('tr')
city_preds.update( parseCityList(citys, update_at) )

e_area = boca_soup.find("table", attrs={"class": "E_AreaList"}) #find the data table
citys = e_area.find_all('tr')
city_preds.update( parseCityList(citys, update_at) )

a_area = boca_soup.find("table", attrs={"class": "A_AreaList"}) #find the data table
citys = a_area.find_all('tr')
city_preds.update( parseCityList(citys, update_at) )


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
    pred = city_preds[new['CITY']]
    for k in pred:
        new[k] = pred[k]

    data.append(new)


req = requests.get('http://data.gov.tw/iisi/logaccess/3537?dataUrl=http://opendata.cwb.gov.tw/govdownload?dataid=O-A0001-001&authorizationkey=rdec-key-123-45678-011121314&ndctype=XML&ndcnid=9176')

o = xmltodict.parse(req.text)['cwbopendata']['location']

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
    pred = city_preds[new['CITY']]
    for k in pred:
        new[k] = pred[k]

    data.append(new)

write_json('./data/weather.json', data)
