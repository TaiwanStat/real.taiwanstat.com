import subprocess
from firebase import firebase

taiwanstat_firebase = firebase.FirebaseApplication('https://realtaiwanstat2.firebaseio.com', None)

with open('../data/data.json', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/dengue-st', uv_data)
print (result)

with open('../data/data.csv', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/dengue-st2', uv_data)
print (result)

with open('../data/drug_data.csv', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/dengue-st4', uv_data)
print (result)
