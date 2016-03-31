
import requests, re
import csv
from datetime import timedelta, date
import datetime
import os.path

from collections import deque

from average import average
from typhoon import typhoon
from merge import merge
from transToJson import transToJson

import VG

dir = os.path.dirname(os.path.abspath(__file__))
oneday = timedelta(days=1)
default_start_date = VG.default_start_date
end_date = date.today()

#date control--------------------------------------------------------------------  
def string_month_day_transer(input_month_day):
    if(input_month_day < 10):
        return '0'+str(input_month_day)
    else:
        return str(input_month_day)
    
def string_transto_ROCyear(input_year):
    return str(input_year-1911)
#--------------------------------------------------------------------------------  
def get_oneday(vegetable_code:str, upload_date:datetime.date):
    oneday_dict = dict()
    payload = {
        'mhidden1':'false',
        'myy':string_transto_ROCyear(upload_date.year),
        'mmm':string_month_day_transer(upload_date.month),
        'mdd':string_month_day_transer(upload_date.day),
        'mpno':vegetable_code
    }

    res = requests.post("http://amis.afa.gov.tw/v-asp/v101r.asp", data = payload)
    res.encoding = 'big5'
    vg_weight_re = re.search('<font color="#0000FF">([0-9]*\.?[0-9]*)</font>公斤</strong></td>', res.text)
    vg_price_re = re.search('<font color="#0000FF">([0-9]*\.[0-9]*)</font>元/公斤</strong></td>', res.text)

    if(vg_weight_re and vg_price_re):
        vg_weight = float(vg_weight_re.group(1))
        vg_price = float(vg_price_re.group(1))

        oneday_dict = {
                            'year':upload_date.year,
                            'month':upload_date.month, 
                            'day':upload_date.day,
                            'weight':vg_weight,
                            'price':vg_price
                      }
    else:
        #miss data, use yesterday
        oneday_dict = get_oneday(vegetable_code, upload_date - oneday)
        #make date right
        oneday_dict['year'] = upload_date.year
        oneday_dict['month'] = upload_date.month
        oneday_dict['day'] = upload_date.day

    return oneday_dict
#--------------------------------------------------------------------------------
def vg_csv_file(vagetable:str):
    return dir + '/vagetable/' +vagetable+'.csv'
#-------------------------------------------------------------------------------- 
def least_day(csvfile):
    least_row = deque(csv.reader(csvfile), 1)[0]
    date = datetime.date(int(least_row[0]), int(least_row[1]), int(least_row[2]))
    print('\tleast date->',date)
    return date
#--------------------------------------------------------------------------------                          
                 
if __name__ == '__main__':
    for vagetable in VG.VG_LIST:
        print(vagetable)
        #exist item
        if(os.path.isfile(vg_csv_file(vagetable)) ):
            print('\tfind '+vg_csv_file(vagetable))
            #find which day to start
            csvfile_read = open(vg_csv_file(vagetable), 'r', newline='')
            date = least_day(csvfile_read) + oneday
            #append data
            csvfile_write = open(vg_csv_file(vagetable), 'a', newline='')
            fieldnames = ['year', 'month', 'day', 'weight', 'price']
            writer = csv.DictWriter(csvfile_write, fieldnames=fieldnames)
            while(date != end_date):
                data = get_oneday(vagetable, date)
                print('\t',data)
                #one day
                writer.writerow({'year':data['year'],
                                 'month':data['month'],
                                 'day':data['day'], 
                                 'weight':data['weight'], 
                                 'price':data['price']})
                date += oneday
            csvfile_read.close()
            csvfile_write.close()
        #new item
        else:
            print('\t'+vg_csv_file(vagetable)+' do not exist')
            print('\tcreat '+vg_csv_file(vagetable))
            csvfile = open(vg_csv_file(vagetable), 'w', newline='')
            fieldnames = ['year', 'month', 'day', 'weight', 'price']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()

            #parse from default_start_date
            date = default_start_date
            while(date != end_date):
                data = get_oneday(vagetable, date)
                print('\t',data)
                #one day
                writer.writerow({'year':data['year'],
                                 'month':data['month'],
                                 'day':data['day'], 
                                 'weight':data['weight'], 
                                 'price':data['price']})
                date += oneday
            csvfile.close()


    average()
    typhoon()
    merge()
    transToJson()
