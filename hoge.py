import numpy as np

A = np.array([[2,-1],[0,3]])


for i in range(-5,6):
    for j in range(-5, 6):
        x = i+j
        y = -j
        v = np.dot(A, [x,y])
        print "{0} {1} {2} {3}".format(x, y, v[0]-x,v[1]-y)
