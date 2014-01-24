# -*- coding: utf-8 -*-
import numpy as np
from scipy import linalg as LA
from scipy import stats
from math import log,sqrt,pi

data = np.loadtxt("ex17-6.dat", comments="#", delimiter="\t")
x = data[:,0]
y = data[:,1]
z = data[:,2]
N = len(x)

# 回帰分析
m = 2 # 変数の数
G = np.array([x, y, np.ones(N)]).T
a = LA.solve(G.T.dot(G), G.T.dot(z))

## a について t検定
S2 = np.sum( (z-G.dot(a))**2 )/(N-m-1)
t = a/np.sqrt(np.diag(LA.inv(G.T.dot(G)))*S2)

print "a_hat = ", a
print "t = ", t

# 両側α点 (α=0.05)
print "t_alpha = %.2f" % stats.t.ppf(0.975, N-m-1)

