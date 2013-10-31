# -*- coding: utf-8 -*-
import numpy as np
import math

def determinant(A):
    # 前進消去
    n = A.shape[0]
    p = np.arange(n)    # [0,1,2,...,n-1] 
    det = 1.0
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
            det *= -1 # ピボット交換では符号を変える

        pivot = A[p[k],k]
        det *= pivot # 対角成分を掛け合わせる
        for i in xrange(k+1, n):
            l = A[p[i], k]/pivot

            for j in xrange(k+1, n):
                A[p[i], j] -= l * A[p[k], j]
    det *= A[p[n-1], n-1]   # これを忘れずに
    return det

def log_determinant(A):
    # 前進消去
    n = A.shape[0]
    p = np.arange(n)    # [0,1,2,...,n-1] 
    ldet = 0
    sign = 1
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
            sign *= -1  # ピボット交換では符号を変える

        pivot = A[p[k],k]
        ldet += math.log(pivot) # 対角成分を掛け合わせる
        for i in xrange(k+1, n):
            l = A[p[i], k]/pivot

            for j in xrange(k+1, n):
                A[p[i], j] -= l * A[p[k], j]
    ldet += math.log(A[p[n-1], n-1])    # これを忘れずに
    return (sign, ldet)


A = np.array([[3,2,5,1],[-2,3,4,1],[1,2,5,6],[0,7,1,3]],dtype=float)
print determinant(A)
A = np.array([[3,2,5,1],[-2,3,4,1],[1,2,5,6],[0,7,1,3]],dtype=float)
print math.exp(log_determinant(A)[1])
