import subprocess
from firebase import firebase

taiwanstat_firebase = firebase.FirebaseApplication('https://realtaiwanstat.firebaseio.com', None)

with open('./data.csv', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase.post('/dengue-fever', uv_data)
print (result)
