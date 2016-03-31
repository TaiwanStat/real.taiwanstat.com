import json
from firebase import firebase

if __name__ == '__main__':
 url = 'https://ikdde-team6.firebaseio.com'
 firebase = firebase.FirebaseApplication(url, None)

# FirebaseAuthentication
#  __init__ (self, secret , email , debug=None , admin=None , extra=None)
# auth = firebase.FirebaseAuthentication()
# firebase = firebase.FirebaseApplication(url,auth)
# use authentication is better way

 # post(self, url , data , params=None , headers=None , connection=None)
 # add a list of data
 url = '/'
 data = {"others":[{"Cola":[{"price":10000},{"unit":"US"},{"number":33}]},{"Pepsi":[{"price":30000},{"unit":"US"},{"number":33}]}]}
 result = firebase.post(url,data)
 print "post",result


 # put(self, url , data , params=None , headers=None , connection=None)
 # update or new a specific data "in" url
 url = '/'
 name = 'others'
 data = {"Cola":[{"price":10000},{"unit":"US"},{"number":33}]},{"Pepsi":[{"price":30000},{"unit":"US"},{"number":33}]}
 result = firebase.put(url, name , data , None)
 print "put",result


 # patch(self, url, data , params=None , headers=None , connection=None)
 # add new data "under" specific url
 url = '/'
 data = {'herb':{'x':1}}
 result = firebase.patch(url, data)
 print "patch",result


 # get(self, url, name, params=None , headers=None , connection=None)
 # get data
 url = '/vgBase'
 key = None
 result = firebase.get(url , key)
 print "get",result

 # delete(self, url , name , params=None , headers=None , connection=None)
 # delete data
 url = '/'
 key = 'herb'
 result = firebase.delete(url,key)
 print "delete",result
