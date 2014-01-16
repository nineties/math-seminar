import numpy as np
n = 10
x = np.arange(10)
y = np.array([1.6, 2.9, 7.8, 11.2, 11.7, 14.2, 16.0, 20.0, 17.7, 18.9])

denom = n * np.sum(x**2) - (np.sum(x))**2
a = (n * np.sum(x*y) - np.sum(x) * np.sum(y))/denom
b = (np.sum(x**2) * np.sum(y) - np.sum(x*y) * np.sum(x))/denom

print "a={0} b={1}".format(a,b)
