import urllib2
import re
import json
from firebase import firebase

def loadAllContent (yy, mm, dd) :
	try :
		headers = {
			'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
		}
		req = urllib2.Request(
			url = 'http://edbkcg.kcg.gov.tw/prices/market.qd1.php',
			headers = headers,
			data = 'tclassSel=0%A5%FE%B3%A1%B8%EA%AE%C6&yy=' + str(yy) + '&mm=' + str(mm) + '&dd=' + str(dd) + '&subm=%B6%7D%A9l%ACd%B8%DF'
		)
		return urllib2.urlopen(req).read()

	except:
		return None

####################################

import time
from datetime import timedelta, date

start_date = date(2010, 1, 1)
end_date = date.today() - timedelta(days=1)

d = start_date
delta = timedelta(days = 1)

jsonfile = '[\n'

while d <= end_date:

	content = loadAllContent(d.year - 1911, d.month, d.day).decode('big5').encode('utf-8')

	jsonfile += '{"date": "' + d.strftime("%Y-%m-%d") + '",\n'
	jsonfile += '"pricelist":[\n'

	count = 0;
	it = re.finditer('<TD>.*</TD>\n<TD ALIGN="RIGHT">\d{1,4}\.\d</TD>', content)
	for match in it:
		jsonfile += match.group().replace('<TD>', '\t{\n\t\t"item": "').replace('</TD>\n<TD ALIGN="RIGHT">', '",\n\t\t"price":').replace('</TD>', '\n\t},\n')
		count += 1
		if count > 20 :
			break

	if jsonfile[-2] is ',':
		jsonfile = jsonfile[:-2]
	jsonfile += '\n]},\n'

	print d.strftime("%Y-%m-%d")

	d += delta

if jsonfile[-2] is ',':
	jsonfile = jsonfile[:-2]

jsonfile += '\n]\n'

outputfile = open('test_reduced.json', 'w+')
outputfile.write(jsonfile)


####################################


if __name__ == '__main__':
 
	url = 'https://ikdde-team6.firebaseio.com'
	path = '/'
	name = 'agriculturePriceReduced'

	jsonObj = json.loads(jsonfile)

	firebase = firebase.FirebaseApplication(url, None)
	result = firebase.put(path, name, jsonObj)