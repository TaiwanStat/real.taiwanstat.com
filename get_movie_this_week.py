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
for movie in movies:
    item = {}
    img = movie.img.get('src')
    text = movie.find('div', attrs={"class": "text"})
    title = text.find('h4').text
    date = text.find('span', attrs={'class': 'date'}).span.text
    content = text.find('p').text

    item = { \
        'img': img, \
        'content': content, \
        'title': title,\
        'date': date \
    }
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
    title = item.find('td', attrs={'class', 'title'}).text
    item = { \
        'title': title,\
        'date': date, \
        'rank': rank \
    }
    output.append(item)

write_json('data/movie_rank_week.json', output)
print ('done')
