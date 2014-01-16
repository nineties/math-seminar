import numpy as np

x = np.array([0.0, 0.5, 1.0, 1.8, 2.1, 2.6, 3.1, 3.7, 4.2, 4.7])
y = np.array([0.0, 0.2, 0.5, 0.7, 0.9, 1.1, 1.1, 1.1, 0.9, 0.6])
a = 0.4
print a
while True:
    next_a = a - (np.sum( x*np.sin(2*a*x) ) - 2 * np.sum( x*y*np.cos(a*x) )) / (np.sum( 2*x*x*np.cos(2*a*x) ) + 2 * np.sum( x*x*y*np.sin(a*x) ))
    if abs((next_a-a)/a) < 1.0e-6:
        break
    a = next_a
    print a
print a
