from VG import VG_LIST
import os.path
import csv
from statistics import mean

dir = os.path.dirname(os.path.abspath(__file__))

#--------------------------------------------------------------------------------
def vg_csv_file(vagetable:str):
    return dir + '/vagetable/' +vagetable+'.csv'
#--------------------------------------------------------------------------------

def average():
    print('runing average...')
    #print(VG_LIST)
    csvfile_list = list()
    for vagetable in VG_LIST:
    	csvfile = open(vg_csv_file(vagetable), 'r', newline='')
    	csvfile_list.append(csv.DictReader(csvfile))

    avg_csvfile = open(vg_csv_file('avg'), 'w', newline='')
    fieldnames = ['year', 'month', 'day', 'price', 'delta', 'delta_percent']
    avg_writer = csv.DictWriter(avg_csvfile, fieldnames=fieldnames)
    avg_writer.writeheader()

    yesterday_price = 20.0 #first day default
    break_control = False
    while(True):
        year = 0
        month = 0
        day = 0
        price_list = list()
        for ele in csvfile_list:
            try:
                row = next(ele)
                price_list.append(float(row['price']) )
            except:#EOF
                break_control = True
                break
            finally:
                year = row['year']
                month = row['month']
                day = row['day']
        if(break_control):
            break


        avg_price = float(format(mean(price_list), '.2f'))
        delta = avg_price - yesterday_price
        delta_percent = format( (delta / yesterday_price)*100, '.2f')
        avg_writer.writerow({'year':year,
                            'month':month,
                            'day':day, 
                            'price':avg_price,
                            'delta':delta,
                            'delta_percent':delta_percent})
        yesterday_price = avg_price
    print('done')





if __name__ == '__main__':
	average()
