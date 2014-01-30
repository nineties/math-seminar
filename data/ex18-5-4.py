# -*- coding: utf-8 -*-
import numpy as np
from scipy import linalg as LA
from math import log, pi

data = np.loadtxt("ex17-5.dat", comments="#", delimiter="\t")
x = data[:,0]
y = data[:,1]
N = len(x)

k = 9       # パラメータの数x^kの項まで使う

# L = sigma^2 * Sigma_0^{-1}
L = np.diag([10**i for i in range(k+1)])

# 回帰分析
G = np.array([x**i for i in range(k+1)]).T
a = LA.solve(G.T.dot(G) + L, G.T.dot(y))

print "{0}".format(a[0]),
for i in range(1, k+1):
    print " + {0}*x**{1}".format(a[i], i),
print ""
