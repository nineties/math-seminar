import numpy as np

def forward_elimination(A, b):
    n = b.size
    for k in xrange(n-1):
        pivot = A[k,k]

        for i in xrange(k+1, n):
            l = A[i, k]/pivot

            for j in xrange(k+1):
                A[i, j] = 0

            for j in xrange(k+1, n):
                A[i, j] -= l * A[k, j]
            b[i] -= l * b[k]

def backward_substitution(U, b):
    n = b.size
    x = np.zeros(n)
    for i in reversed(xrange(n)):
        x[i] = b[i]/U[i, i]
        for j in xrange(i):
            b[j] -= U[j,i]*x[i]
    return x


A = np.array([[8,4,-3],[6,1,-2],[2,-3,1]], dtype=float)
b = np.array([7,2,-1], dtype=float)

print "before forward-elimination"
print A
print b

forward_elimination(A, b)
print "after forward-elimination"
print A
print b

print "the answer"
print backward_substitution(A, b)
