# coding: utf-8

import requests
from bs4 import BeautifulSoup
from firebase import firebase

station = [
 { 'name':'台北', 'id':'466920' }, #0
 { 'name':'雲林', 'id':'C1K310' }, #1
 { 'name':'台南', 'id':'467410' }, #2
 { 'name':'屏東', 'id':'C0R170' }, #3
 { 'name':'花蓮', 'id':'466990' }, #4
 { 'name':'宜蘭', 'id':'467080' }  #5
]

time = [
 { 'name':'2015', 'id':'2015' }, #0
 { 'name':'2014', 'id':'2014' }, #1
 { 'name':'2013', 'id':'2013' }, #2
 { 'name':'2012', 'id':'2012' }, #3
 { 'name':'2011', 'id':'2011' }  #4
]

# choose station and year
station_id = 5 #宜蘭
time_id = 0 #2015

payload = dict()

payload['station'] = station[station_id]
payload['time'] = time[time_id]

if __name__ == '__main__':
 
 link = 'http://www.cwb.gov.tw/V7/climate/dailyPrecipitation/Data/'+payload['station']['id']+'_'+payload['time']['id']+'.htm'
 
 res = requests.get(link)
 res.encoding = 'utf-8'
 text = str(res.text.encode('utf-8'))
 
 soup = BeautifulSoup(text,'html.parser')
 a = soup.find_all('col')
 b = a[0].find_all('tr')
  
 
 ###-------###
 station = payload['station']['name']
 year = payload['time']['name']
 data = dict()
 data[station] = dict()
 everyday = data[station]
 
 for elem in b[1:-1]:
  day = elem.th.string
  
  #print date
  
  all_td = elem.find_all('td')
  stop = False
  month = 0;
  for each_td in all_td:
   rain = each_td.string
   #print rain
   
   isNone = rain == None
   isSmall = rain == 'T'
   isNo = rain == 'X'
   isZero = rain == '-'
   
   isNoData = isSmall or isNo or isZero
   
   v = {
    'day':'',
    'month':'',
    'year':'',
    'rainfall':''
   }
   
   v['day'] = int(day)
   v['month'] = month
   v['year'] = int(year)
   
   date_str = year+'_'+str(month).zfill(2)+'_'+day.zfill(2)
   
   if isNone is True:
    pass
   else:
    if isNoData is True:
     v['rainfall'] = 0
    else:
     v['rainfall'] = float(rain)
    everyday[date_str] = v
   
   month = month + 1
 
 print data
 
  
 url = 'https://ikdde-team6.firebaseio.com'
 path = '/all_data/rainfall/'
 _data = data
 firebase = firebase.FirebaseApplication(url,None)
 result = firebase.patch(path, _data)
 print station,year,'success'
