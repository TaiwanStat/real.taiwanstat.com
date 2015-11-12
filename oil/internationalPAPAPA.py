# coding=UTF-8
import datetime
import requests
from firebase import Firebase
f = Firebase('https://oildata2.firebaseio.com/datas')
file = open('output.txt', 'w')
now = datetime.datetime.now()
d1 = datetime.datetime(2015, 10, 12)
while (now-d1).days > 1 :
	dayOfWeek = d1.weekday()
	if dayOfWeek > 4 :
		d1=d1+datetime.timedelta(days=1)
		continue 
	query = {
    	'opt':'search',
    	'setform':'week',
		'S_year':d1.year,    
    	'S_month':d1.month,
    	'S_day':d1.day        # date
	}
	res = requests.post("http://web3.moeaboe.gov.tw/oil102/oil1022010/A02/A0201/daytable.asp", data = query)
	source =  res.text
	#print source
	tmp1 = source.split('<td bgcolor="#66CCFF" align="center"><br>',1)
	tmp2 = tmp1[1].split('</tr>')
	tmp3 = tmp2[0].split('G')

	WTI = tmp3[1].split('<p>')[0]
	Dubai = tmp3[2].split('<p>')[0]
	Brent = tmp3[3].split()[0]

	date = d1.strftime("%Y-%m-%d")
	#file.write('ref.push({\n')
	#file.write('\tdate:"'+date+'",\n')
	#file.write('\tWTI: '+ WTI+',\n')
	#file.write('\tDubai: '+ Dubai+',\n')
	#file.write('\tBrent: '+ Brent+',\n')
	#file.write('\ttype: 1\n});\n')
	r = f.push({'date':date,'WTI':float(WTI),'Dubai':float(Dubai),'Brent':float(Brent),'type':1})
	d1=d1+datetime.timedelta(days=1)
file.close()

