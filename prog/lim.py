from math import cos
x = 0.7             # x(n)
xm1 = 0             # x(n-1)
for i in range(1, 60):
    if abs(x-xm1)<1e-10:
        break
    x, xm1 = cos(x), x
    print "step:{0} x={1}".format(i, x)
