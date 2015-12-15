import requests
import json
import csv
from time import sleep
domain = 'http://www.instants.xyz/'
headers = {'content-type': 'application/json'}

"""Utils"""
def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def read_csv(file_name):
    data = []
    with open(file_name, 'r') as input_file:
        reader = csv.reader(input_file)
        for row in reader:
            data.append(row)
    return data[0] if len(data) == 1 else data

def update_key(data, old_key, new_key):
    for site in data:
        site[new_key] = site[old_key]
        del site[old_key]
    return data

def insert(path, data):
    data = json.dumps(data)
    #print (data)
    res = requests.post(domain+path, data=data, headers=headers)
    #print(res)
    sleep(0.05)


"""Main"""
def air():
    air = read_json('air/data/air.json')
    air = update_key(air, 'PM2.5', 'PM2_5')
    sites = read_csv('./air-map/data/site.csv')
    for d in air:
        for site in sites:
            if site[0] == d['SiteName']:
                d['lat'] = site[-2]
                d['lng'] = site[-3]
                break
        insert('air/create/', d)

def gamma():
    gamma = read_json('gamma/data/gammamonitor.json')
    insert('gammas', gamma)

def uv():
    uv = read_json('uv/data/data.json')
    uv = update_key(uv, '\ufeffSiteName', 'SiteName')
    for d in uv:
        insert('uv/create/', d)

def rain():
    rain = read_json('../rain/rain.json')
    for d in rain:
        insert('rain/create/', d)

def water():
    water = read_json('../data/data.json')
    sites = read_csv('water/water_location.csv')
    for name in water:
        d = water[name]
        d['reservoir_id'] = d['id']
        del d['id']
        for site in sites:
            if site[0] == d['name']:
                d['lat'] = site[-2]
                d['lng'] = site[-1]
            
                break
        insert('water/create/', d)

def power():
    loadpara = read_csv('power/data/loadpara.csv')
    loadregion = read_csv('power/data/genloadareaperc.csv')
    data = {}
    data['reserveData'] = { \
        "reserveLoad": loadpara[1],\
        "reserveSupply": loadpara[2],\
        "updateTime": loadpara[3]\
    }
    keys = ["updateTime", "northSupply", "northUsage", "centerSupply", "centerUsage", \
            "southSupply", "southUsage", "eastSupply", "eastUsage"]
    data['regionData'] = {}
    for i in range(0, len(keys)):
        data['regionData'][keys[i]] = loadregion[i]
    insert("powers", data)

def weather():
    weather = read_json('./data/weather.json')
    for d in weather:
        insert('weather/create/', d)


air()
print ('air done')
#rain()
print ('rain done')
uv()
print ('uv done')
water()
print ('water done')
weather()
print ('weater done')
