from math import cos
x = 0.7             # x(n)
xm1 = 0; xm2 = 0    # x(n-1) and x(n-2)
for i in range(1, 30):
    if abs(x-xm1)<1e-10:
        break
    if i%3 == 0:
        x, xm1, xm2 = xm2 - (xm1-xm2)*(xm1-xm2)/(x-2*xm1+xm2), x, xm1
    else:
        x, xm1, xm2 = cos(x), x, xm1
    print "step:{0} x={1}".format(i, x)
