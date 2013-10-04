x = 0.2
dt = 0.01
k = 8
for i in xrange(20):
    t = dt*i

    print "{0},{1}".format(t, x)

    x = k*x*(1-x)*dt
