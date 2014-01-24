from random import gauss,uniform

for i in range(10):
    x = uniform(0,10)
    y = uniform(0,10)
    z = gauss(0.001*x + 2*y, 3)
    print "{0:.1f}\t{1:.1f}\t{2:.1f}".format(x,y,z) 
