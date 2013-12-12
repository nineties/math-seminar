from random import random
from math import sqrt,log,cos,pi

def normal(mu, sigma):
    x = random()
    y = random()
    z = sqrt(-2*log(x)) * cos(2*pi*y)
    return mu + sigma * z

import numpy as np
N = 10000
data = [normal(5.5,2) for i in range(N)]
hist,key = np.histogram(data, bins=np.arange(0,11,0.2), density=True)
for i in range(len(hist)):
    print "{0}\t{1}".format(key[i]+0.1, hist[i])
