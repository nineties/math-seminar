from numpy import *

def f(x):
    return 1.0/(1+x*x)
a = 0.0
b = 1.0

N = 10
T = zeros( (N+1, N+1) )

T[0,0] = (f(a) + f(b))*(b-a)/2
for i in range(1, N+1):

    n = 2**i
    dx = (b-a)/n
    s = 0.0
    for j in range(n):
        s += f(a + j*dx) + f(a + (j+1)*dx)
    T[i,0] = s*dx/2

    for j in range(1, i+1):
        T[i,j] = T[i, j-1] + (T[i, j-1] - T[i-1,j-1])/(4**j-1)

    print "{0} {1}".format(dx, abs(pi/4-T[i,i]))
