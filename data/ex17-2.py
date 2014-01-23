import numpy as np
from scipy import linalg as LA

data = np.loadtxt("ex17-2.dat", comments="#", delimiter="\t")
x = data[:,0]
y = data[:,1]
z = data[:,2]
N = len(x)

G = np.array([x, y, np.ones(N)]).T
print LA.solve(G.T.dot(G), G.T.dot(z))
