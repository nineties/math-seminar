import numpy as np
from scipy import linalg as LA

data = np.loadtxt("ex17-5.dat", comments="#", delimiter="\t")
x = data[:,0]
y = data[:,1]
N = len(x)

#G = np.array([x**i for i in range(N)]).T
G = np.array([x**i for i in range(3)]).T
a = LA.solve(G.T.dot(G), G.T.dot(y))
print a

f = G.dot(a)
y_avg = np.average(y)
print 1-np.sum((y-f)**2)/np.sum((y-y_avg)**2)
print 1-(np.sum((y-f)**2)/(N-2))/(np.sum((y-y_avg)**2)/(N-1))
