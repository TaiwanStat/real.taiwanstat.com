import requests
import json
import csv
domain = "http://localhost:3000/"
headers = {'content-type': 'application/json'}

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def updateKey(data, old_key, new_key):
    for site in data:
        site[new_key] = site[old_key]
        del site[old_key]
    return data

def insert(path, data):
    data = json.dumps({"data": data})
    res = requests.post(domain+path, data=data, headers=headers)
    print(res)

def air():
    air = read_json('air/data/air.json')
    air = updateKey(air, 'PM2.5', 'PM2_5')
    insert("airs", air)

def gamma():
    gamma = read_json("gamma/data/gammamonitor.json")
    insert("gammas", gamma)

def uv():
    uv = read_json("uv/data/data.json")
    uv = updateKey(uv, u'\ufeffSiteName', 'SiteName')
    insert("uvs", uv)

def rain():
    rain = read_json("rain/data/data.json")
    insert("rains", rain)

def water():
    rain = read_json("water/data.json")
    insert("waters", rain)

air()
gamma()
uv()
rain()
water()
