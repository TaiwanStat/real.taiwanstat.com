# coding=UTF-8
import datetime
import requests
from firebase import Firebase
f = Firebase('https://oildata2.firebaseio.com/datas')
res = requests.get("https://new.cpc.com.tw/division/mb/oil-more1-1.aspx")
source =  res.text
tmp1 = source.split('<td width="9%">')
nineeight = tmp1[2].split('</td>')
ninefive = tmp1[4].split('</td>')
ninetwo = tmp1[6].split('</td>')
ultra = tmp1[10].split('</td>')
ninetwoP = ninetwo[0]
ninefiveP = ninefive[0]
nineeightP = nineeight[0]
ultraP = ultra[0]
tmp2 = source.split('<span>')
d1 = tmp2[5]
d2 = tmp2[6]
d3 = tmp2[7]
year = d1.split('</span>')
month = d2.split('</span>')
day = d3.split('</span>')
newdate = datetime.datetime(int(year[0]), int(month[0]), int(day[0]))
date = newdate.strftime("%Y-%m-%d")
r = f.push({'date':date,'ninetwo':float(ninetwoP),'ninefive':float(ninefiveP),'nineeight':float(nineeightP),'ultra':float(ultraP),'type':0})
