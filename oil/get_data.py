from firebase import firebase
import json
firebase = firebase.FirebaseApplication('https://oildata2.firebaseio.com')
result = firebase.get('/datas', None)
def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file)
write_json('./data.json', result)

