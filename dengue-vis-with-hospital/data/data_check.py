#!/usr/bin/env python
# encoding: utf-8
import csv
with open('eggs.csv') as originData:
    with open('hospital_tainan.tsv') as newData:
        originData = csv.reader(originData)
        newData = csv.reader(newData,delimiter='\t')
        next(originData)
        #next(newData)
        originArr = []
        newArr = []
        for row in originData:
            originArr.append(row[6])
        for row in newData:
            newArr.append(row[2])
        for i in range(len(originArr)):
            if(originArr[i] != newArr[i]):
                print(i)
