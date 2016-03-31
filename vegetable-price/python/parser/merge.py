from VG import VG_LIST
import os.path
import csv

dir = os.path.dirname(os.path.abspath(__file__))

#--------------------------------------------------------------------------------
def vg_csv_file(vagetable:str):
    return dir + '/vagetable/' +vagetable+'.csv'
#--------------------------------------------------------------------------------

def merge():
    print('runing merge...')
    #print(VG_LIST)
    csvfile_list = list()
    for vagetable in VG_LIST:
    	csvfile = open(vg_csv_file(vagetable), 'r', newline='')
    	csvfile_list.append(csv.DictReader(csvfile))

    avg_csvfile = open(vg_csv_file('merge'), 'w', newline='')
    fieldnames = ['year', 'month', 'day']+VG_LIST
    avg_writer = csv.DictWriter(avg_csvfile, fieldnames=fieldnames)
    avg_writer.writeheader()

    
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

        data_list = [year, month, day]+price_list
        zipdata = dict(zip(fieldnames, data_list))
        avg_writer.writerow(zipdata)
		

	
    print('done')

if __name__ == '__main__':
	merge()
