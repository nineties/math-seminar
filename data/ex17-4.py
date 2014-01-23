from random import gauss

for i in range(10):
    x = gauss(10, 5)
    y = gauss(x, 2)
    print "{0}\t{1}".format(x,y)
