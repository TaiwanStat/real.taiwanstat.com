#Chen Yu Wen
#2015/11/03
#online data form : http://www.cwb.gov.tw/V7/index.htm

import requests, re, json, csv

START_YEAR = 2015


payload = {
        'year':'all',
        'model':'warning'
}


def typhoon():
    print('runing typhoon...')
    res = requests.post('http://rdc28.cwb.gov.tw/TDB/ctrl_typhoon_list/get_typhoon_list_table/', data = payload) 
    all_typhoon = re.findall('<td width="70" rowspan=1>(.*)</td>(?:\n.*){3}\n\s*<td width="115"  style="font-size: 12px;">\n\s*([0-9]{4})-([0-9]{2})-([0-9]{2}).*</br>([0-9]{4})-([0-9]{2})-([0-9]{2}).*</td>(?:\n.*){5}\n\s*<td width="40">([0-9]*)</td>', res.text)

    csvfile = open('typhoon.csv', 'w', newline='')
    fieldnames = ['typhoon_name', 'start_year', 'start_month', 'start_day', 'end_year', 'end_month', 'end_day', 'rank']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    
    for typhoon in all_typhoon:
        if( int(typhoon[1]) >= START_YEAR):
            writer.writerow({
    			'typhoon_name':typhoon[0],
                'start_year':typhoon[1],
                'start_month':typhoon[2],
                'start_day':typhoon[3],
                'end_year':typhoon[4],
                'end_month':typhoon[5],
                'end_day':typhoon[6],
                'rank':typhoon[7]
    		})
    print('done')




        