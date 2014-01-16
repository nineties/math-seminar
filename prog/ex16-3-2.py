import numpy as np
from scipy import linalg as LA
#x  y
N = 20
x = np.array([0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5])
y = np.array([3.7, 1.2, -3.2, -1.0, -4.1, -3.3, -3.5, -2.4, -1.8, 1.7, 2.7, 5.5, 8.5, 11.4, 17.1, 22.4, 26.4, 33.2, 39.2, 46.2])

G = np.array([x*x*x*x, x*x*x, x*x, x, np.ones(N)]).T
print LA.solve(G.T.dot(G), G.T.dot(y))
