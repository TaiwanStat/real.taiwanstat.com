import subprocess
from firebase import firebase

subprocess.call("git pull", shell=True)

taiwanstat_firebase = firebase.FirebaseApplication('https://realtaiwanstat.firebaseio.com', None)
taiwanstat_firebase2 = firebase.FirebaseApplication('https://realtaiwanstat2.firebaseio.com', None)

with open('air/data/air.json', 'r') as outfile:
    air_data = outfile.read()
result = taiwanstat_firebase2.post('/air', air_data)
print (result)

with open('gamma/data/gammamonitor.csv', 'r') as outfile:
    gamma_data = outfile.read()
result = taiwanstat_firebase.post('/gamma', gamma_data)
print (result)

'''with open('power/data/loadfueltype', 'r') as outfile:
    power_1_data = outfile.read()
result = taiwanstat_firebase.post('/power_1', power_1_data)
print (result)

with open('power/data/loadpara.txt', 'r') as outfile:
    power_2_data = outfile.read()
result = taiwanstat_firebase.post('/power_2', power_2_data)
print (result)'''

with open('power/data/loadpara.csv', 'r') as outfile:
    power_3_data = outfile.read()
result = taiwanstat_firebase2.post('/power_3', power_3_data)
print (result)

with open('power/data/genloadareaperc.csv', 'r') as outfile:
    power_4_data = outfile.read()
result = taiwanstat_firebase2.post('/power_4', power_4_data)
print (result)

with open('uv/data/data.csv', 'r') as outfile:
    uv_data = outfile.read()
result = taiwanstat_firebase2.post('/uv', uv_data)
print (result)

with open('../reservoir-data/data.json', 'r') as outfile:
    water_data = outfile.read()
result = taiwanstat_firebase.post('/water', water_data)

with open('/home/ice479/global.taiwanstat.com/r/world-news/data/data.json', 'r') as outfile:
    water_data = outfile.read()
result = taiwanstat_firebase.post('/world_news', water_data)
print (result)
