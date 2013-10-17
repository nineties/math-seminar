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
    for i in xrange(0, n, 2):
        s += f(a + i*dx) + 4*f(a + (i+1)*dx) + f(a + (i+2)*dx)
    s *= dx/3
    print "{0} {1}".format(dx, err(s))
