#! /usr/bin/env python
# -*- coding: utf-8 -*-
import json
import os
import urllib2
from bs4 import BeautifulSoup
base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

def read_json(file_name):
    with open(file_name, 'r') as input_file:
        return json.load(input_file)

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file)

pages = read_json('./data/id.json')['data']
old_data = read_json('./data/data.json')

data = []
attr_id = 0
for page in pages:
    title, p_id = page.items()[0]
    tmp = {"title": title, "id": 'place'+ str(attr_id)}
    url = 'http://www.cwb.gov.tw/V7/observe/phRain/pH_' + p_id + '.htm'
    html_doc = urllib2.urlopen(url).read()
    soup = BeautifulSoup(html_doc)
    trs = soup.select(".datatable tr")
    tds = trs[5].select("td")
    tmp['this_avg'] = tds[-4].text
    tmp['this_max'] = tds[-3].text
    tmp['this_min'] = tds[-2].text
    tmp['this_number'] = tds[-1].text

    tds2 = trs[11].select("td")
    tmp['last_avg'] = tds2[-4].text
    tmp['last_max'] = tds2[-3].text
    tmp['last_min'] = tds2[-2].text
    tmp['last_number'] = tds2[-1].text

    '''for place in old_data:
        if place['title'] == title:
            print place['title'], tds[-4].text
            #tmp['this_avg'] = tds[-4].text
            #tmp['this_max'] = tds[-3].text
            #tmp['this_min'] = tds[-2].text
            #tmp['this_number'] = tds[-1].text

            tmp['last_avg'] = place['this_avg']
            tmp['last_max'] = place['this_max']
            tmp['last_min'] = place['this_min']
            tmp['last_number'] = tds2[-1].text'''
    data.append(tmp)
    attr_id += 1

write_json('./data/data.json', data)
