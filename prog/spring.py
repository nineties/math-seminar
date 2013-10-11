import numpy as np
from math import sin

k = 1.0
m = 1.0
mu = 0.2
A = 0.5
#B = 0.3
B = 1.0

def g(t, x):
    return np.array([x[1], -k/m*x[0]-mu/m*x[1]+A/m*sin(B*t)])

x = np.array([1.0, 0.0])    # x(0) = 1, v(0) = 0
dt = 0.2

for i in range(400):
    t = i*dt
    print "{0} {1}".format(t, x[0])

    k1 = g(t, x)
    k2 = g(t + dt/2, x + k1*dt/2)
    k3 = g(t + dt/2, x + k2*dt/2)
    k4 = g(t + dt, x + k3*dt)
    x += (k1 + 2*k2 + 2*k3 + k4)*dt/6
