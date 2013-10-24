# -*- coding: utf-8 -*-
import numpy as np

def solve(A, b):
    # 前進代入
    n = b.size
    p = np.arange(n)    # [0,1,2,...,n-1] 
    for k in xrange(n-1):

        # ピボット選択
        pivot_idx = p[k]
        pivot_max = 0
        for i in xrange(k, n):
            v = abs(A[p[i], k])
            if v > pivot_max:
                pivot_max = v
                pivot_idx = i

        if pivot_max < 1e-10:
            raise ArithmeticError, u'ピボットが小さすぎ'

        # ピボット行の交換
        if p[k] != pivot_idx:
            p[k], p[pivot_idx] = p[pivot_idx], p[k]

        pivot = A[p[k],k]
        for i in xrange(k+1, n):
            l = A[p[i], k]/pivot

            for j in xrange(k+1, n):
                A[p[i], j] -= l * A[p[k], j]
            b[p[i]] -= l * b[p[k]]

    # 後退代入
    x = np.zeros(n)
    for i in reversed(xrange(n)):
        x[i] = b[p[i]]/A[p[i], i]
        for j in xrange(i):
            b[p[j]] -= A[p[j],i]*x[i]
    return x


A = np.array([[2,3,-1],[4,6,-3],[2,-3,1]], dtype=float)
b = np.array([5,3,-1], dtype=float)

print solve(A, b)
