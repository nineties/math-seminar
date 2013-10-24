# w = x + 2y + 3z

from random import gauss, random

N = 100
for i in range(N):
    x = random()
    y = random()
    z = random()
    w = gauss(x + 2*y + 3*z, 0.01)
    print "{0} {1} {2} {3}".format(x, y, z, w)
