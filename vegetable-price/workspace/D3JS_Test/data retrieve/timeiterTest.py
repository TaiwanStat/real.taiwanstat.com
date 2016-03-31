import time
from datetime import timedelta, date

start_date = date(2010, 1, 1)
end_date = date.today()

d = start_date
delta = timedelta(days = 1)

while d <= end_date:
    print d.strftime("%Y-%m-%d")
    d += delta