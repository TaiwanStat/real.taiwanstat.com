
# coding: utf-8

# In[1]:

#Chen Yu Wen
#2015/10/29
#online data form : http://amis.afa.gov.tw/

import requests, re, json
from firebase import firebase
from datetime import date
from datetime import timedelta
import datetime

#global var
firebase_filename = 'vegetable_data/'

oneday = timedelta(days=1)
default_start_date = datetime.date(2015, 1, 1)
end_date = date.today()

firebase = firebase.FirebaseApplication('https://ikdde-team6.firebaseio.com', None)

#date control--------------------------------------------------------------------  
def string_month_day_transer(input_month_day):
    if(input_month_day < 10):
        return '0'+str(input_month_day)
    else:
        return str(input_month_day)
    
def string_transto_ROCyear(input_year):
    return str(input_year-1911)
#--------------------------------------------------------------------------------  
def get_group(vegetable_dict:dict):
    group_dict = dict()
    for vegetable_name in vegetable_dict.keys():
        datapart = get_kind(vegetable_dict[vegetable_name]) 
        group_dict.update( {vegetable_name : datapart} )
        
    return group_dict
        
#--------------------------------------------------------------------------------    
def get_kind(vegetable_code:str):
    searchday = default_start_date
    data_dict = dict()
    
    while(searchday != end_date ):
        data_dict.update( get_kind_oneday(vegetable_code, searchday) )
        searchday += oneday
        
    return data_dict
#--------------------------------------------------------------------------------       
def get_kind_oneday(vegetable_code:str, upload_date:datetime.date):
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
        oneday_dict = {str(upload_date) : {
                            'date':{
                                'year':upload_date.year,
                                'month':upload_date.month, 
                                'day':upload_date.day},
                            'weight':(vg_weight),
                            'price':(vg_price)} 
                      }
    else:
        oneday_dict = get_kind_oneday(vegetable_code, upload_date - oneday)
    return oneday_dict
#--------------------------------------------------------------------------------       
def parse_vegetable(group:str, vegetable_dict:dict):
    
    firebase_data_group = firebase.get(firebase_filename, name = group)
    
    #firebase do not has this group of vegetable,
    #upload a group.
    if(firebase_data_group == None):
        print('upload one group ' + group)
        new_group = get_group(vegetable_dict)
        firebase.patch(firebase_filename + group, new_group)
        print(' done')
        
    #firebase has this group of vegetable
    else:
        for vegetable_name in vegetable_dict.keys():
            firebase_data_kind = firebase.get(firebase_filename + group, name = vegetable_name)
            
            #this group do not has this kind of vegetable
            #upload a kind form default_start_date.
            if(firebase_data_kind == None):
                print('upload one kind ' + vegetable_name)
                new_kind = get_kind(vegetable_dict[vegetable_name])
                firebase.patch(firebase_filename + group +'/'+ vegetable_name, new_kind)
                print(' done')
            
            #just need update 
            else:
                firebase_data_date = firebase.get(firebase_filename + group +'/'+ vegetable_name, None)
                
                date = sorted(firebase_data_date.keys())
                date_last_index = len(date) - 1
                split_date_str = date[date_last_index].split('-')
                last_year =  int(split_date_str[0])
                last_month = int(split_date_str[1])
                last_day =   int(split_date_str[2])
                #upload day = newest day + 1
                search_day = datetime.date(last_year, last_month, last_day) + oneday
                
                while(search_day != end_date):
                    print('upload ' + str(search_day) + ' ' + vegetable_name)
                    upload_data = get_kind_oneday(vegetable_dict[vegetable_name], search_day)
                    firebase.patch(firebase_filename + group +'/'+ vegetable_name, upload_data)
                    print('done')
                    search_day += oneday               
#--------------------------------------------------------------------------------                      
                 
if __name__ == '__main__':
    
    index_dict = firebase.get('item',None)
    print("starting...")
    for group in index_dict:
        print('processing : ' + str(group))
        
        #fire/item control what we need to uplord
        vegetable_dict = firebase.get('item/',group)
        parse_vegetable(group, vegetable_dict)
    
    print('all done')
    


# In[ ]:



