
# coding: utf-8

# In[2]:

from firebase import firebase

#葉菜類
ye_cai_lei = {
    '菠菜':'LH',
    '香菜':'LP',
    '莧菜':'LM',
    '小白菜':'LB',
    '包心白菜':'LC',
    '青江菜':'LD',
    '甘藍':'LA'
}
#根莖類
gen_jing_lei = {
    '地瓜':'SO',#甘藷
    '馬鈴薯':'SC',
    '牛蒡':'SM'
}
#豆類
dou_lei = {
    '豌豆':'FL',
    '菜豆':'FM',
    '四季豆':'FN',
    '毛豆':'FQ'
}
#瓜類
gua_lei = {
    '南瓜':'FT'
    
}
#蔥薑蒜辣類
cong_jiang_suan_la_lei = {
    '蔥':'SE',
    '薑':'SP',
    '辣椒':'FV'   
}

if __name__ == '__main__':

    firebase = firebase.FirebaseApplication('https://ikdde-team6.firebaseio.com', None)

    item_list = {
	#分類名稱
        '葉菜類'     : ye_cai_lei,
        '根莖類'     : gen_jing_lei,
        '豆類'       : dou_lei,
        '瓜類'       : gua_lei,
        '蔥薑蒜辣類' : cong_jiang_suan_la_lei
    }
    
    firebase.patch('item',data = item_list)
    
    #clear part, for test function
    #firebase.delete('vegetable_data',None)
    #firebase.patch('vegetable_data',data = {'default' : 0})
    
    print('upload sucess')

