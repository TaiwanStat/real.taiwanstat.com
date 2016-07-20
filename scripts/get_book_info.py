import json
import requests
from bs4 import BeautifulSoup
import requests
import json
import csv
domain = 'http://localhost:8000/'
#domain = 'http://www.instants.xyz/'
headers = {'content-type': 'application/json'}

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

def insert(path, data):
    data = json.dumps(data)
    res = requests.post(domain+path, data=data, headers=headers)
    print(res)

req = requests.get('http://www.books.com.tw/')
req.encoding = 'big-5'
boca_soup = BeautifulSoup(req.text, "html.parser") #get text content of the website
container = boca_soup.find_all('div', attrs={"class": "first"})[0]

if container.h3.text == '今日66折':
    title = container.h4.text
    price = container.li.text.replace('定價：','')
    fav_price = container.strong.text
    img = container.img.get('src', '')
    link = container.a.get('href', '')
    insert('book/create/', { "title": title, "price": price, "fav_price": fav_price, "img": img, 'link': link})
