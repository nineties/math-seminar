from fractions import Fraction

b = [1]
for n in range(1,10):
    v = 0
    c = 1   # C(n+1, k)
    for k in range(n):
        v += c * b[k]
        c *= Fraction(n-k+1, k+1)
    b.append(-v * Fraction(1, n+1))

print b
