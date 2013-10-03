import csv
reader = csv.reader(open("../data/data1.csv", "rb"), delimiter=",")

sumx    = 0     # sum x
sumy    = 0     # sum y
sumx2   = 0     # sum x^2
sumxy   = 0     # sum xy
n       = 0     # number of the data

for x,y in reader:
    x = float(x)
    y = float(y)
    sumx += x
    sumy += y
    sumx2 += x*x
    sumxy += x*y
    n += 1

a = (n*sumxy-sumx*sumy)/(n*sumx2-sumx*sumx)
b = (sumx2*sumy-sumx*sumxy)/(n*sumx2-sumx*sumx)
print "y={0:.5f}x + {1:.5f}".format(a, b)
