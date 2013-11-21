# -*- coding: utf-8 -*-
import numpy as np
import scipy.sparse as sp
from scipy.sparse.linalg import spsolve
import numpy.linalg as la
from time import time

N = 10000
A = sp.rand(N, N, format='lil')
A.setdiag(np.random.randn(N))
A = A.tocsr()
A_dense = A.todense()
b = np.random.randn(N)

print "非CSR方式: ",
start = time()
x1 = la.solve(A_dense, b)
print time()-start, "sec"

print "CSR方式: ",
start = time()
x2 = spsolve(A, b)
print time()-start, "sec"

print la.norm(x1-x2)
