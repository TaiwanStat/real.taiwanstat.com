import requests

if __name__ == '__main__':
 payload = {
 	"st":'',
	"year":''
 }
 
 payload['st'] = '466920';
 payload['year'] = '2015';
 
 #1.  original web, no use at all!!!
 #link1 = "http://www.cwb.gov.tw/V7/climate/dailyPrecipitation/dP.htm"
 
 #2.  get rainfall specific station and year
 #link2 = "http://www.cwb.gov.tw/V7/climate/dailyPrecipitation/Data/466920_2012.htm"
 
 #3.  can use by post request obtain second url(above url ^^^^)
 #    but still no use at all!!!
 #link3 = "http://www.cwb.gov.tw/V7/climate/dailyPrecipitation/dP_file.php"
 
 #4.  get select option list, included station, year
 #link4 = "http://www.cwb.gov.tw/V7/climate/dailyPrecipitation/dP.php"
 
 """
 # choose either post or get, do not use in the same time

 # for third url with post payload 
 # link can be link3
 res = requests.post(link, payload)

 # just get web url
 # link can be link1, link2, link4
 res = requests.get(link)

 # encoding as utf-8 avoid wrong chiness word
 res.encoding = 'utf-8'
 print res.text.encode('utf-8')
 """"
