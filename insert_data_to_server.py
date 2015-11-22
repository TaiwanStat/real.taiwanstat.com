import requests
import json
import csv
domain = 'http://localhost:3000/'
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
    data = json.dumps({'data': data})
    res = requests.post(domain+path, data=data, headers=headers)
    print(res)


"""Main"""
def air():
    air = read_json('air/data/air.json')
    air = update_key(air, 'PM2.5', 'PM2_5')
    insert('airs', air)

def gamma():
    gamma = read_json('gamma/data/gammamonitor.json')
    insert('gammas', gamma)

def uv():
    uv = read_json('uv/data/data.json')
    uv = update_key(uv, u'\ufeffSiteName', 'SiteName')
    insert('uvs', uv)

def rain():
    rain = read_json('rain/data/data.json')
    insert('rains', rain)

def water():
    rain = read_json('water/data.json')
    insert('waters', rain)

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

power()
air()
gamma()
uv()
