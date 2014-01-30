# -*- coding: utf-8 -*-
import numpy as np
from scipy import linalg as LA
from math import log, pi

data = np.loadtxt("ex17-5.dat", comments="#", delimiter="\t")
x = data[:,0]
y = data[:,1]
N = len(x)

k = 9       # パラメータの数x^kの項まで使う
l = 1       # sigma^2/sigma_0^2

# 回帰分析
G = np.array([x**i for i in range(k+1)]).T
a = LA.solve(G.T.dot(G) + l*np.identity(k+1), G.T.dot(y))
print a
