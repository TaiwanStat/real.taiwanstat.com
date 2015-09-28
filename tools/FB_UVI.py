import json
import requests
from facepy import GraphAPI

def add_status(over_list):
    for index, site in enumerate(over_list):
        str_tmp = site
        uvi_tmp = int(site.split(':')[1])
        if uvi_tmp < 3:
            str_tmp = str_tmp + ' (曝曬級數：低量級)'
        elif uvi_tmp < 6:
            str_tmp = str_tmp + ' (曝曬級數：中量級)'
        elif uvi_tmp < 8:
            str_tmp = str_tmp + ' (曝曬級數：高量級)'
        elif uvi_tmp < 11:
            str_tmp = str_tmp + ' (曝曬級數：過量級)'
        elif uvi_tmp >= 11:
            str_tmp = str_tmp + ' (曝曬級數：危險級)'
        over_list[index] = str_tmp
    return over_list

req = requests.get('http://opendata.epa.gov.tw/ws/Data/UV/?$orderby=PublishAgency&$skip=0&$top=1000&format=json')
uv_data = json.loads(req.text)

north = ['臺北市', '新北市', '桃園市', '基隆市', '新竹市', '新竹縣', '宜蘭縣']
central = ['臺中市', '臺中縣', '彰化縣', '南投縣', '雲林縣', '苗栗縣', '金門縣', '澎湖縣', '連江縣']
south = ['臺南市', '臺南縣', '高雄市', '高雄縣', '屏東縣', '嘉義市', '嘉義縣']
east = ['花蓮縣', '臺東縣']

north_uvi_over = list()
central_uvi_over = list()
south_uvi_over = list()
east_uvi_over = list()

for site_data in uv_data:
    if site_data['UVI'] == '' or int(site_data['UVI']) < 6:
        continue

    if site_data['County'] in north:
        north_uvi_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['UVI'])
    elif site_data['County'] in central:
        central_uvi_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['UVI'])
    elif site_data['County'] in south:
        south_uvi_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['UVI'])
    elif site_data['County'] in east:
        east_uvi_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['UVI'])

# print (north_uvi_over)
# print (central_uvi_over)
# print (south_uvi_over)
# print (east_uvi_over)

begin_str = '[紫外線監測 ' + uv_data[0]['PublishTime'] + ' 即時資訊]\n'
end_str = '\n\n-----\n\
           台灣即時紫外線地圖：\n\
           http://real.taiwanstat.com/uv/'

north_uvi_over = add_status(north_uvi_over)
central_uvi_over = add_status(central_uvi_over)
south_uvi_over = add_status(south_uvi_over)
east_uvi_over = add_status(east_uvi_over)

if north_uvi_over:
    final_str = begin_str + '\n'.join(north_uvi_over) + end_str
    #print (final_str)
    graph = GraphAPI('CAAXlqTpSB3QBACnQVoHHfd8ZBAuZCi1VpD2mQws5ZASFfa06wfcmjwSn9vEcU5FBM1nWUDCKTP0H3axt1wfQ6Pc8ydB2CKIwz3maNAv3ZBTZC9XcmzkvOXtaXRUxGZCZCLQMrJ13XgzqmFzECV1nMfgbACdyzi0PRxZBZC4ZBZADQxKZB8KVY9QZAmNmJ95lIhrAZBQT8DF6qa3VONZBvCPL4DZCu12p')
    graph.post('372722699580162/feed', message=final_str)

if central_uvi_over:
    final_str = begin_str + '\n'.join(central_uvi_over) + end_str
    #print (final_str)
    graph = GraphAPI('CAAXlqTpSB3QBAF6DlOoZAC7MQpijatgczEul0ZCjBd7dObBCxZAGhQ8ixoDT5JG9ZAtMXZBDPcGxFZCWFFBjHZC2OAnjqdW8OT97RaeXZAIbwA8J47ZBiSZCA59ZAnZCKQiqzQKUqfZBHo8Ui1L4EaIJJh4QBTGirs1Fv7jRZAnjKcHWMqu2PPnkLoF0XJCZAtst6r8fAaSKAeGw0RkmpMdgZBHRdSOc')
    graph.post('1602606069951003/feed', message=final_str)

if south_uvi_over:
    final_str = begin_str + '\n'.join(south_uvi_over) + end_str
    #print (final_str)
    graph = GraphAPI('CAAXlqTpSB3QBAGAZAdA6OsE1CCCgWd6OpZAhjWHf1KmI4pWrJWCn1R6PLAGRcOXkvQ1W6oqzZCdsly0m0WeDbDnPpHuTWSKiJjxGufpbTHSe0bhHIa40uf7HlKaIKrZBqT0asVyvZAZBVasPMu5evHgUgeC1RaYMaVnFZCSDeIGrwyp3vR2Y9sGtOHWSO9UEfK9vTMcW3zL3XBqE62xd3oJ')
    graph.post('1556336211301065/feed', message=final_str)

if east_uvi_over:
    final_str = begin_str + '\n'.join(east_uvi_over) + end_str
    #print (final_str)
    graph = GraphAPI('CAAXlqTpSB3QBANM7KsIBHTwn9XSkDKAEj5Pz6pELZCFV4koZBFsqgMb9l8sfuZC8USKAEsKLbTUaTVoGUiKj0teEQllyziHiQN1w65ZC12XDO4kwiFWHqPn0FgzArUyIuZCTw758ozH2TPUjvIngz3ksZBmHmTGFIlimj8nbufG9UL0l4pLGi25SzDsYC0pT9e6WDGyNQJcclQ2Bmq7sVj')
    graph.post('1662078197345725/feed', message=final_str)
