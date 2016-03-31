import urllib2

def loadAllContent (dest) :
	try :
		headers = {
			'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6'
		}
		req = urllib2.Request(
			url = dest,
			headers = headers
		)
		return urllib2.urlopen(req).read()
	except:
		return None
