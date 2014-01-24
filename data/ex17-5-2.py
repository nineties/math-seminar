# -*- coding: utf-8 -*-
import numpy as np
from scipy import linalg as LA
from math import log, pi

data = np.loadtxt("ex17-5.dat", comments="#", delimiter="\t")
x = data[:,0]
y = data[:,1]
N = len(x)

k = 3   # パラメータの数x^kの項まで使う

# 回帰分析
G = np.array([x**i for i in range(k+1)]).T
a = LA.solve(G.T.dot(G), G.T.dot(y))
print a

# AICの計算(最後の項もつけておいた)
f = G.dot(a)    # 理論値
AIC = N*log(np.sum((y-f)**2)/N) + 2*k + N*(log(2*pi)+1)

print AIC
