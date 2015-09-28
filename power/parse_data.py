#! /usr/bin/env python
# -*- coding: utf-8 -*-
import os
import csv
import subprocess

base_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(base_dir)

def write_csv(file_name, content):
    with open(file_name, 'w') as output_file:
        writer = csv.writer(output_file)  
        writer.writerows(content)  

loadUrl = 'http://stpc00601.taipower.com.tw/loadGraph/loadGraph/data/loadpara.txt'
dataUrl = 'http://stpc00601.taipower.com.tw/loadGraph/loadGraph/data/genloadareaperc.csv'
typeDataUrl = "http://stpc00601.taipower.com.tw/loadGraph/loadGraph/data/loadfueltype.csv"

subprocess.call(["wget", "-O", "data/genloadareaperc.csv", dataUrl])
subprocess.call(["wget", "-O", "data/loadpara.txt", loadUrl])
subprocess.call(["wget", "-O", "data/loadfueltype", typeDataUrl])

loadpara = []
f = open('data/loadpara.txt', 'r')
lines = f.readlines()
loadpara.append(float(lines[2].replace(',', '').replace('"', '')))
loadpara.append(float(lines[3].replace(',', '').replace('"', '')))
loadpara.append(float(lines[4].replace(',', '').replace('"', '')))
for i in range(0, len(loadpara)):
    if loadpara[i] > 10000:
        loadpara[i] = loadpara[i] / 10

loadpara.append(lines[5].replace(',', '').replace('"', '')[:-8])
loadpara = [loadpara]
f.close()


write_csv('data/loadpara.csv', loadpara)
