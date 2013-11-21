# -*- coding: utf-8 -*-
import numpy as np
import scipy.sparse as sp
from time import time

N = 10000
A = sp.rand(N, N, format='csr')
A_dense = A.todense()
x = np.random.randn(N)

REPEAT = 100    # 繰り返しAxを計算

print "非CSR方式: ",
start = time()
for i in range(REPEAT):
    A_dense.dot(x)
print time()-start, "sec"

print "CSR方式: ",
start = time()
for i in range(REPEAT):
    A.dot(x)
print time()-start, "sec"
