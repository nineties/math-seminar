from random import gauss

a = 1.0
b = 5.0
c = 3.0

for i in range(20):
    x = i*0.5;
    print "{0}\t{1}".format(x, round(gauss(a*x**2-b*x+c, 1)*10)/10)

