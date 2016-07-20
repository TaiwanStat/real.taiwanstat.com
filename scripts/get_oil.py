# coding=UTF-8
import datetime
import requests
import json
from bs4 import BeautifulSoup

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)


res = requests.get('http://new.cpc.com.tw/division/mb/oil-more1-1.aspx')
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

req = requests.get('http://new.cpc.com.tw/mobile/Home/')
boca_soup = BeautifulSoup(req.text, "html.parser") #get text content of the website
main = boca_soup.find('div', attrs={"id": "price"})
status = main.find('div', attrs={"id":'floatprice-LU'}).text
float_date = main.find('div', attrs={"id":'floatprice-date'}).text
float_price = main.find('div', attrs={"id":'floatprice-R'}).text

data = {'date':date,'ninetwo':float(ninetwoP),'ninefive':float(ninefiveP),'nineeight':float(nineeightP),'ultra':float(ultraP),'type':0, 'status': status, 'float_date': float_date, 'float_price': float_price}
print (data)
write_json('./data/oil.json', data)
