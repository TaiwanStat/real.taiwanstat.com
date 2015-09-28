import sys
import subprocess
import datetime
'''
http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?dir=%2Fgfs.2015051406
http://www.nco.ncep.noaa.gov/pmb/products/gfs/gfs.t00z.pgrbf00.grib2.shtml
'''

i = (datetime.datetime.now() - datetime.timedelta(hours=12))
date = i.strftime('%Y%m%d') 

gfs = ''
h = i.hour/6*6
if h == 0:
    date = date + '0' + str(h)
    gfs = 'gfs.t00z.pgrb2.1p00.anl'
elif h == 6:
    date = date + '0' + str(h)
    gfs = 'gfs.t06z.pgrb2.1p00.anl'
elif h == 12:
    date += str(h)
    gfs = 'gfs.t12z.pgrb2.1p00.anl'
elif h == 18:
    date += str(h)
    gfs = 'gfs.t18z.pgrb2.1p00.anl'
print date

def update_data(url, path):
    subprocess.call(['curl', url, '-o', 'tmp.grib2'])
    subprocess.call(['../grib2json-0.8.0-SNAPSHOT/bin/grib2json', \
            '-d', '-n', '-o', path, 'tmp.grib2'])
    data = ''
    f = open(path, 'r')
    data = f.read().replace(' ', '').replace('\n', '')
    f.close()
    f = open(path, 'w')
    f.write(data)
    f.close()
    subprocess.call(['rm', 'gfs*'])

wind_url = 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=' + gfs + '&lev_surface=on&lev_1000_mb=on&var_UGRD=on&var_VGRD=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.' + date
path = './data/weather/current/current-wind-surface-level-gfs-1.0.json'
update_data(wind_url, path)

temp_url = 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=' + gfs + '&lev_surface=on&var_TMP=on&lev_1000_mb=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.' + date
path = './data/weather/current/current-temp-surface-level-gfs-1.0.json'
update_data(temp_url, path)

rh_url = 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=' + gfs + '&lev_surface=on&lev_1000_mb=on&var_RH=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.' + date
path = './data/weather/current/current-relative_humidity-surface-level-gfs-1.0.json'
update_data(rh_url, path)

pwat_url = 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=' + gfs + '&all_lev=on&var_PWAT=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.' + date
path = './data/weather/current/current-total_precipitable_water-gfs-1.0.json'
update_data(pwat_url, path)


cwat_url = 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=' + gfs + '&all_lev=on&var_CWAT=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.' + date
path = './data/weather/current/current-total_cloud_water-gfs-1.0.json'
update_data(cwat_url, path)

mslet_url = 'http://nomads.ncep.noaa.gov/cgi-bin/filter_gfs_1p00.pl?file=' + gfs + '&all_lev=on&var_MSLET=on&leftlon=0&rightlon=360&toplat=90&bottomlat=-90&dir=%2Fgfs.' + date
path = './data/weather/current/current-mean_sea_level_pressure-gfs-1.0.json'
update_data(mslet_url, path)
