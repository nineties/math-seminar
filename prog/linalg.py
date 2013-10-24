# -*- coding: utf-8 -*-

import numpy as np

def mat_add(a, b):
    if a.shape != b.shape:
        raise ArithmeticError, u"行列の型の不一致"
    (m,n) = a.shape
    r = np.zeros( (m,n) )
    for i in xrange(m):
        for j in xrange(n):
            r[i,j] = a[i,j] + b[i,j]
    return r

def mat_scale(k, a):
    (m,n) = a.shape
    r = np.zeros( (m,n) )
    for i in xrange(m):
        for j in xrange(n):
            r[i,j] = k * a[i,j]
    return r

def mat_mul(a, b):
    (l, m) = a.shape
    (m2, n) = b.shape
    if m != m2:
        raise ArithmeticError, u"行列の型の不一致"

    c = np.zeros( (l,n) )
    for i in xrange(l):
        for j in xrange(n):
            v = 0
            for k in xrange(m):
                v += a[i,k] * b[k,j]
            c[i,j] = v
    return c

a = np.array([[1,2,3],[4,5,6]])
b = np.array([[2,1,4],[5,2,1]])

print mat_add(a, b)
print mat_scale(2, a)

a = np.array([[1,2,3],[4,5,6]])
b = np.array([[2,1,4],[5,2,1],[0,1,3]])
print mat_mul(a, b)
