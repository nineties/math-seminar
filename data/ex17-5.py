from random import gauss

# y = x^2-2x+1

for i in range(10):
    x = gauss(1, 2)
    y = gauss((x-1)**2, 2)
    print "{0:.1f}\t{1:.1f}".format(x,y)
