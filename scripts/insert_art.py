import requests
import json
import csv
domain = 'http://localhost:8000/'
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
    res = requests.post(domain+path, data=data, headers=headers)
    print(res)


"""Main"""
def art():
    arts = read_json('./data/art.json')
    for d in arts:
        insert('art/create/', d)

art()
print ('art done')
