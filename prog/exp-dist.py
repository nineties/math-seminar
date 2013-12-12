from math import log
from random import random

def exponential(lam):
    return -log(random())/lam

import numpy as np
N = 1000
data = [exponential(5) for i in range(N)]
hist,key = np.histogram(data, bins=np.arange(0,2,0.1), density=True)
for i in range(len(hist)):
    print "{0}\t{1}".format(key[i]+0.05, hist[i])
