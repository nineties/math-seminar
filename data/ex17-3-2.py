import numpy as np
from scipy import linalg as LA

data = np.loadtxt("ex17-3-2.dat", comments="#", delimiter=" ")
x_A = data[0,:]
x_B = data[1,:]
x_S = data[2,:]
y   = data[3,:]
N = len(x_A)

G = np.array([x_A, x_B, x_S, np.ones(N)]).T
print LA.solve(G.T.dot(G), G.T.dot(y))
