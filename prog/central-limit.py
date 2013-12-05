import numpy as np
from collections import Counter

M = 1000
for N in [10,30,50]:
    data = [np.average(np.random.poisson(3, N)) for i in range(M)]
    hist,key = np.histogram(data, bins=np.arange(1,5,0.1), density=True)
    for i in range(len(hist)):
        print "{0}\t{1}".format(key[i], hist[i])

    print "\n"
