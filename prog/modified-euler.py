def g(t, x):
    return x

x = 1
dt = 0.1
for i in range(10):
    t = i*dt
    print "{0} {1}".format(t, x)
    k1 = g(t, x)
    k2 = g(t + dt, x + k1*dt)
    x += (k1 + k2)*dt/2
