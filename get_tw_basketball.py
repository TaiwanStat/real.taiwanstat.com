import json
import requests
from pprint import pprint
from bs4 import BeautifulSoup

req = requests.get('http://sbl.basketball-tpe.org/files/600-1002-137.php')
html_str = req.text.encode('latin1').decode('utf8')
soup = BeautifulSoup(html_str, 'html.parser')

all_data = list()

competition_table = soup.find(id='StageMatchListTable')
competition_tr_all = competition_table.find_all('tr')
for competition_tr in competition_tr_all:
    competition_dict = dict()
    competition_td_all = competition_tr.find_all('td')
    if len(competition_td_all) == 0:
        continue
    competition_dict['date_time'] = competition_td_all[1].text
    competition_dict['place'] = competition_td_all[2].text.strip()
    competition_dict['team1'] = competition_td_all[3].text.strip()
    competition_dict['team2'] = competition_td_all[4].text.strip()
    competition_dict['score'] = competition_td_all[5].text.strip()
    if competition_dict['score'] != '':
        competition_dict['score1'] = competition_dict['score'].split(':')[0]
        competition_dict['score2'] = competition_dict['score'].split(':')[1]
        competition_dict['is_result'] = True
    else:
        competition_dict['score1'] = str()
        competition_dict['score2'] = str()
        competition_dict['is_result'] = False

    if competition_td_all[6].find('a') != None:
        competition_dict['detail_result_link'] = competition_td_all[6].find('a').get('href', '')
    else:
        competition_dict['detail_result_link'] = str()
    all_data.append(competition_dict)

with open('data/tw_basketball.json', 'w') as myfile:
    json.dump(all_data, myfile, indent=4)
