import os.path
import csv
import json
from VG import VG_LIST, VG_DICT

#--------------------------------------------------------------------------------
dir = os.path.dirname(__file__)
def vg_csv_file(vagetable:str):
    return dir + '/vagetable/' +vagetable+'.csv'
#--------------------------------------------------------------------------------

vagetable_list = VG_LIST
vagetable_data = list()

#vagetable---------------------------------
def transToJson():
    print('transToJson')
    for vagetable in VG_LIST:
        this_data = list()
        csvfile = open(vg_csv_file(vagetable), 'r', newline='')
        fieldnames = ("year","month","day","weight", "price")
        reader = csv.DictReader( csvfile, fieldnames)
        header_row = True
        for row in reader:
            if(header_row):#escape header
                header_row = False
                continue
            date = '-'.join( [row['year'], row['month'], row['day'] ] )
            this_data.append( { 'date' : date, 'price': row['price']} )
        name = vagetable
        one_item = {'name':VG_DICT[name],'opacity':0 ,'value':this_data}
        vagetable_data.append(one_item)
        #print(one_item)
    #typhone---------------------------------
    typhoon_data = list()
    csvfile = open('typhoon.csv', 'r', newline='')
    fieldnames = ('typhoon_name', 'start_year', 'start_month','start_day', 'end_year', 'end_month', 'end_day', 'rank')
    reader = csv.DictReader( csvfile, fieldnames)
    header_row = True
    for row in reader:
        if(header_row):#escape header
            header_row = False
            continue
        name = row['typhoon_name']
        start_date = '-'.join( [row['start_year'], row['start_month'], row['start_day'] ] )
        end_date = '-'.join( [row['end_year'], row['end_month'], row['end_day'] ] )
        rank = row['rank']
        typhoon_data.append({'name':name,
                             'start_date':start_date,
                             'end_date':end_date,
                             'rank':rank
                            })
        

    jsonfile = open('alldata.json', 'w')
    json.dump({'vgdata' : vagetable_data, 'tydata':typhoon_data}, jsonfile)
    print('sucessed')

