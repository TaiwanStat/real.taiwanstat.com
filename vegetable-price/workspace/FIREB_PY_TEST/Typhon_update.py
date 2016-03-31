#reference from : http://stackoverflow.com/questions/20199126/reading-a-json-file-using-python

import json
from firebase import firebase

if __name__ == '__main__':

 file_name = 'Typhon_201001-201510.json'
 
 with open(file_name) as json_file:
  json_data = json.load(json_file)
  print(json_data)
 
 url = 'https://ikdde-team6.firebaseio.com'
 path = '/'
 name = 'TyphonDB'
 
 firebase = firebase.FirebaseApplication(url, None)
 result = firebase.put(path, name, json_data['json_content'], None)

