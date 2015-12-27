import json
import requests
from bs4 import BeautifulSoup
import xmltodict, json

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

def parseCityList(citys, pred_date, forecast_moment):
    preds = []
    props = ['pred_temp', 'pred_rain', 'pred_status']
    for i in range(1, len(citys)):
        pred = {}
        tds = citys[i].find_all('td')
        city = tds[0].text
        pred['city'] = city
        pred['pred_temp'] = tds[1].text
        pred['pred_rain'] = tds[2].text
        pred['pred_status'] = (tds[3].find('img').get('alt'))
        pred['pred_date'] = pred_date
        pred['forecast_moment'] = forecast_moment
        print (pred['pred_status'])
        preds.append(pred)

    return preds

def parse_page(url):
    city_preds = []

    req = requests.get(url)
    req.encoding = 'big-5'
    boca_soup = BeautifulSoup(req.text, "html.parser") #get text content of the website

    forecast_date = boca_soup.find('div', attrs={"class": "modifyedDate"}).text
    forecast_moment = boca_soup.find('div', attrs={"class": "BoxContentTab"}).find('a', attrs={"class": "current"}).text
    print (forecast_moment)

    update_at = forecast_date

    n_area = boca_soup.find("table", attrs={"class": "N_AreaList"}) #find the data table
    citys = n_area.find_all('tr')
    city_preds += parseCityList(citys, update_at, forecast_moment)

    c_area = boca_soup.find("table", attrs={"class": "C_AreaList"}) #find the data table
    citys = c_area.find_all('tr')
    city_preds += parseCityList(citys, update_at, forecast_moment)

    s_area = boca_soup.find("table", attrs={"class": "S_AreaList"}) #find the data table
    citys = s_area.find_all('tr')
    city_preds += parseCityList(citys, update_at, forecast_moment)

    e_area = boca_soup.find("table", attrs={"class": "E_AreaList"}) #find the data table
    citys = e_area.find_all('tr')
    city_preds += parseCityList(citys, update_at, forecast_moment)

    a_area = boca_soup.find("table", attrs={"class": "A_AreaList"}) #find the data table
    citys = a_area.find_all('tr')
    city_preds += parseCityList(citys, update_at, forecast_moment)
    return city_preds

result = parse_page('http://www.cwb.gov.tw/V7/forecast/f_index2.htm')
write_json('./data/weather_forecast.json', result)
