import json
import requests
from pprint import pprint
from facepy import GraphAPI

def add_status(over_list):
    for index, site in enumerate(over_list):
        str_tmp = site
        pm_tmp = int(site.split(':')[1])
        if pm_tmp < 13 :
            str_tmp = str_tmp + ' (美國標準: 良好, '
        elif pm_tmp < 36:
            str_tmp = str_tmp + ' (美國標準: 普通, '
        elif pm_tmp < 56:
            str_tmp = str_tmp + ' (美國標準: 不太好, '
        elif pm_tmp < 151:
            str_tmp = str_tmp + ' (美國標準: 不良, '
        elif pm_tmp < 251:
            str_tmp = str_tmp + ' (美國標準: 非常不良, '
        else:
            str_tmp = str_tmp + ' (美國標準: 有害, '

        if pm_tmp < 36:
            str_tmp = str_tmp + '台灣標準: 低)'
        elif pm_tmp < 54:
            str_tmp = str_tmp + '台灣標準: 中)'
        elif pm_tmp < 71:
            str_tmp = str_tmp + '台灣標準: 高)'
        else:
            str_tmp = str_tmp + '台灣標準: 有害)'

        over_list[index] = str_tmp
    return over_list

req = requests.get('http://opendata.epa.gov.tw/ws/Data/AQX/?%24format=json')
air_data = json.loads(req.text)

north = ['臺北市', '新北市', '桃園市', '基隆市', '新竹市', '新竹縣', '宜蘭縣']
central = ['臺中市', '臺中縣', '彰化縣', '南投縣', '雲林縣', '苗栗縣', '金門縣', '澎湖縣', '連江縣']
south = ['臺南市', '臺南縣', '高雄市', '高雄縣', '屏東縣', '嘉義市', '嘉義縣']
east = ['花蓮縣', '臺東縣']

north_over = list()
central_over = list()
south_over = list()
east_over = list()

for site_data in air_data:
    if site_data['PM2.5'] == '' or int(site_data['PM2.5']) < 36:
        continue

    if site_data['County'] in north:
        north_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['PM2.5'])
    elif site_data['County'] in central:
        central_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['PM2.5'])
    elif site_data['County'] in south:
        south_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['PM2.5'])
    elif site_data['County'] in east:
        east_over.append(site_data['County'] + ' ' + site_data['SiteName'] + ' : ' + site_data['PM2.5'])

print (north_over)
print (central_over)
print (south_over)
print (east_over)
begin_str = '[PM2.5 監測 ' + air_data[0]['PublishTime'] + ' 即時資訊]\n'
end_str = '\n\n-----\n\
           空污 PM2.5圖文版：\n\
           http://real.taiwanstat.com/pm2.5/\n\
           空污 PM2.5地圖版：\n\
           http://real.taiwanstat.com/air-map/\n'

north_over = add_status(north_over)
central_over = add_status(central_over)
south_over = add_status(south_over)
east_over = add_status(east_over)

if north_over:
    graph = GraphAPI('CAAXlqTpSB3QBACnQVoHHfd8ZBAuZCi1VpD2mQws5ZASFfa06wfcmjwSn9vEcU5FBM1nWUDCKTP0H3axt1wfQ6Pc8ydB2CKIwz3maNAv3ZBTZC9XcmzkvOXtaXRUxGZCZCLQMrJ13XgzqmFzECV1nMfgbACdyzi0PRxZBZC4ZBZADQxKZB8KVY9QZAmNmJ95lIhrAZBQT8DF6qa3VONZBvCPL4DZCu12p')
    graph.post('372722699580162/feed', message=begin_str + '\n'.join(north_over) + end_str)

if central_over:
    graph = GraphAPI('CAAXlqTpSB3QBAF6DlOoZAC7MQpijatgczEul0ZCjBd7dObBCxZAGhQ8ixoDT5JG9ZAtMXZBDPcGxFZCWFFBjHZC2OAnjqdW8OT97RaeXZAIbwA8J47ZBiSZCA59ZAnZCKQiqzQKUqfZBHo8Ui1L4EaIJJh4QBTGirs1Fv7jRZAnjKcHWMqu2PPnkLoF0XJCZAtst6r8fAaSKAeGw0RkmpMdgZBHRdSOc')
    graph.post('1602606069951003/feed', message=begin_str + '\n'.join(central_over) + end_str)

if south_over:
    graph = GraphAPI('CAAXlqTpSB3QBAGAZAdA6OsE1CCCgWd6OpZAhjWHf1KmI4pWrJWCn1R6PLAGRcOXkvQ1W6oqzZCdsly0m0WeDbDnPpHuTWSKiJjxGufpbTHSe0bhHIa40uf7HlKaIKrZBqT0asVyvZAZBVasPMu5evHgUgeC1RaYMaVnFZCSDeIGrwyp3vR2Y9sGtOHWSO9UEfK9vTMcW3zL3XBqE62xd3oJ')
    graph.post('1556336211301065/feed', message=begin_str + '\n'.join(south_over) + end_str)

if east_over:
    graph = GraphAPI('CAAXlqTpSB3QBANM7KsIBHTwn9XSkDKAEj5Pz6pELZCFV4koZBFsqgMb9l8sfuZC8USKAEsKLbTUaTVoGUiKj0teEQllyziHiQN1w65ZC12XDO4kwiFWHqPn0FgzArUyIuZCTw758ozH2TPUjvIngz3ksZBmHmTGFIlimj8nbufG9UL0l4pLGi25SzDsYC0pT9e6WDGyNQJcclQ2Bmq7sVj')
    graph.post('1662078197345725/feed', message=begin_str + '\n'.join(east_over) + end_str)
