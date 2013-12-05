from math import factorial,exp

for l in [1,5,10]:
    for k in range(20):
        print "{0}\t{1}".format(k, l**k * exp(-l) / factorial(k))
    print "\n\n"
