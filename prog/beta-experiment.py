from random import random
def beta25():
    while True:
        u1 = random()
        u2 = random() * 2.6
        if u2 <= 30*u1*(1-u1)**4:
            return u1

import numpy as np
N = 1000
data = [beta25() for i in range(N)]
hist,key = np.histogram(data, bins=np.arange(0,1,0.05), density=True)
for i in range(len(hist)):
    print "{0}\t{1}".format(key[i]+0.025, hist[i])
