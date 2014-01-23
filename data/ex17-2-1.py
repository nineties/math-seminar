from random import gauss

for i in range(10):
    x = round(gauss(50, 10))
    y = round(gauss(x, 10))
    z = round(gauss(x+y, 10))
    print "{0}\t{1}\t{2}".format(x,y,z)
