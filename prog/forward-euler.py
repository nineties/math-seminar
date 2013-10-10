x = 1
dt = 0.1
for i in xrange(10):
    t = dt*i
    print "{0}  {1}".format(t, x)
    x = x + x*dt
