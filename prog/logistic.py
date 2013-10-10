def g(t, x):
    return x*(1-x)

x = 0.01    # x(0) = 0.01
dt = 0.5
for i in xrange(20):
    t = dt*i

    print "{0} {1}".format(t, x)

    k1 = g(t, x)
    k2 = g(t + dt/2, x + k1*dt/2)
    k3 = g(t + dt/2, x + k2*dt/2)
    k4 = g(t + dt, x + k3*dt)
    x += (k1 + 2*k2 + 2*k3 + k4)*dt/6
