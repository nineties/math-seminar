from random import gauss

N = 10

# z = 5x^2+y^2-4xy-6x+2y+2
print "#x\ty\tz"
for i in range(N):
    x = gauss(1, 9)
    y = gauss(1, 9)
    z = gauss(5*x**2-4*x*y+y**2-6*x+2*y+2, 15)
    print "{0:.2f}\t{1:.2f}\t{2:.2f}".format(x,y,z)
