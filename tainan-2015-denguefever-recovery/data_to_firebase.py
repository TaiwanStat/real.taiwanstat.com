import subprocess
from firebase import firebase

taiwanstat_firebase = firebase.FirebaseApplication('https://realtaiwanstat2.firebaseio.com', None)

with open('./2015_kao_bar.json', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/dengue-kao2', uv_data)
print (result)

with open('./2015_kao_data.json', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/dengue-kao1', uv_data)
print (result)

