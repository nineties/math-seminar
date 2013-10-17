from math import pi

a = 0.0
b = 1.0
def f(x):
    return 1/(1+x*x)
def err(v):
    return abs(pi/4-v)

for n in [ 10**k for k in range(1, 10)]:
    dx = (b-a)/n
    s = 0.0
    for i in xrange(n):
        s += f(a + i*dx) + f(a + (i+1)*dx)
    s *= dx/2
    print "{0} {1}".format(dx, err(s))
