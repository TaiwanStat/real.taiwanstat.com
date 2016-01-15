import json
import requests
from bs4 import BeautifulSoup

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

req = requests.get('http://www.cwb.gov.tw/V7/observe/rainfall/A136.htm')
req.encoding = 'big-5'
boca_soup = BeautifulSoup(req.text, "html.parser") #get text content of the website

update = boca_soup.find('table', attrs={"class": "description"}).find_all('td')[-1].text
update = update[7:]

table = boca_soup.find('table', attrs={"id": "tableData"}).find_all('tr')
head = True
data = {}
cols = ['Rainfall10min', 'Rainfall1hr', 'Rainfall3hr', 'Rainfall6hr', 'Rainfall12hr', 'Rainfall24hr']

for tr in table:
    if head:
        head = False
        continue

    try:
        tds = tr.find_all('td')
        sitename = tds[1].text.split(' ')[0]
        data[sitename] = {}
    except:
        print (tr)

    if len(tds) > len(cols):
        for i in range(0, len(cols)):
            try: 
                v = float(tds[i+2].text)
            except:
                v = 0
            data[sitename][cols[i]] = v
        data[sitename]['PublishTime'] = update
print (update)
write_json('rain.json', data)
