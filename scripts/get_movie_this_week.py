import json
import requests
from bs4 import BeautifulSoup

def write_json(file_name, content):
    with open(file_name, 'w') as output_file:
        json.dump(content, output_file, indent=4)

req = requests.get('https://tw.movies.yahoo.com/movie_thisweek.html')
req.encoding = 'big-5'
boca_soup = BeautifulSoup(req.text, "html.parser") #get text content of the website
movies = boca_soup.find_all('div', attrs={"class": "row-container"})
output = []
links = boca_soup.find_all('ul', attrs={'class': 'links'})
index = 0

for movie in movies:
    item = {}
    img = movie.img.get('src')
    text = movie.find('div', attrs={"class": "text"})
    title = text.find('h4').text
    date = text.find('span', attrs={'class': 'date'}).span.text
    #content = text.find('p').text
    intro = links[index].find('li', attrs={'class': 'intro'}).a.get('href').split('*')[1]
    resp = requests.get('https://www.googleapis.com/youtube/v3/search?part=snippet&q='+title+ ' 電影預告片' + '&key=AIzaSyCN7Fm5tDc3S1uIy1UPk9dURgYL3dreVmw')
    youtube = json.loads(resp.text)
    youtube_id = youtube['items'][0]['id']['videoId']
    trailer = 'https://www.youtube.com/watch?v=' + youtube_id

    item = { \
        'img': img, \
        #'content': content, \
        'title': title,\
        'date': date, \
        'intro': intro, \
        'trailer': trailer \
    }
    index += 1
    output.append(item)

write_json('data/movie_this_week.json', output)

output = []
ranking = boca_soup.find('div', attrs={'class', 'subpanel'})
movies = ranking.find_all('tr')
date = ranking.find('td', attrs={'class', 'duration'}).span.text.split('~')[0].replace(' ', '')
for item in movies:
    rank = item.find('td', attrs={'class', 'rank'})
    if (not rank):
        continue
    rank = rank.text
    title = item.find('td', attrs={'class', 'title'})
    intro = 'https://tw.movies.yahoo.com/movieinfo_main.html/id=' + title.p.get('mvid')
    title = title.text
    item = { \
        'title': title,\
        'date': date, \
        'rank': rank, \
        'intro': intro \
    }
    output.append(item)

write_json('data/movie_rank_week.json', output)
print ('done')
