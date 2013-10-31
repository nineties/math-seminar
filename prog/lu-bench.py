# -*- coding: utf-8 -*-
import numpy as np
import scipy
from scipy import linalg as LA
from time import time

N = 1000
A = np.random.randn(N, N)   # 係数行列
b = np.random.randn(N)      # 定数項

REPEAT = 100    # 繰り返しAx=bを解いてみる(とりあえず定数項は固定)

print "Without LU-factorization: ",
start = time()
for i in range(REPEAT):
    x = LA.solve(A, b)
print time()-start, "sec"

print "With LU-factorization: ",
start = time()
lu_A = LA.lu_factor(A)    # LU分解
for i in range(REPEAT):
    LA.lu_solve(lu_A, b)
print time()-start, "sec"
