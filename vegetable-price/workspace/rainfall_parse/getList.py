# get web html
import requests

# use beautifulsoup to get web object
from bs4 import BeautifulSoup

# upload data to firebase
from firebase import firebase


def getKeyValue(in_soup):
 return {'name':in_soup.string, 'id':in_soup.attrs['value']}

def cmpyear(item):
 return item['name'] == item['id']

def cmpstat(item):
 return not cmpyear(item)

if __name__ == '__main__':
 
 
 # get select, option web
 all_list_link = 'http://www.cwb.gov.tw/V7/climate/dailyPrecipitation/dP.php'
 res = requests.get(all_list_link)
 res.encoding = 'utf-8'
 
 # new a string with encode utf-8
 text = str(res.text.encode('utf-8')) 
 
 # create soup object
 soup = BeautifulSoup(text,'html.parser')
 # choose option object
 a = soup.find_all('option')
 
 # create new list of dict {name:...,id:...}
 data = map(getKeyValue,a)
 
 stat_list = filter(cmpstat,data)
 year_list = filter(cmpyear,data)
 
 # create another dictionary to format data
 #    (remove list.....)
 newData = dict()
 newData['station'] = dict()
 newData['year'] = dict()
 
 #bad way
 for elem in stat_list:
  newData['station'][elem['name']] = elem
 for elem in year_list:
  newData['year'][elem['name']] = elem
  
 
 print stat_list
 print '************'
 print year_list
 print '************'
 print newData
 print '************'
  
 url = 'https://ikdde-team6.firebaseio.com'
 path = '/'
 name = 'rain_item'
 _data = newData
 firebase = firebase.FirebaseApplication(url,None)
 result = firebase.put(path, name, _data, None)
 print 'success'
