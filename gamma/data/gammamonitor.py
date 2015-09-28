import urllib2

url = "http://www.aec.gov.tw/open/gammamonitor.csv"
content = urllib2.urlopen(url)
data = content.read()
fout = open("gammamonitor.csv", "w")
fout.write(data.decode('big5').encode('utf8'))
