# -*- coding: utf-8 -*-
import numpy as np

def lu(A):
    A = np.copy(A)  # 作業用

    n = A.shape[0]
    L = np.identity(n, dtype=float)      # 対角行列
    U = np.zeros((n,n), dtype=float)     # 零行列

    for k in xrange(n):
        U[k,k] = A[k,k]
        for i in xrange(k+1,n):
            U[k,i] = A[k,i]
            L[i,k] = A[i,k]/A[k,k]
        for i in xrange(k+1,n):
            for j in xrange(k+1,n):
                A[i,j] -= L[i,k] * U[k,j]
    return (L, U)

A = np.array([[4, 5, 1, 9], [2, 1, 3, 1], [3, 1, 5, 3], [-2, 1, 4, 3]], dtype=float)
L,U = lu(A)
print "A=\n",A
print "L=\n",L
print "U=\n",U
print "LU=\n", np.dot(L, U)
