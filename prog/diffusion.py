import numpy as np

D = 1
dt = 0.002
nx = 21
dx = 2.0/(nx-1)

print D*dt/(dx*dx)

u = np.zeros(nx)
u[nx/2] = 1.0
new_u = np.zeros(nx)

for j in range(50):
    if j%5 == 0:
        for i in range(nx):
            print "{0} {1}".format(i*dx, u[i])
        print "\n\n"

    new_u[0] = u[1]
    new_u[nx-1] = u[nx-2]
    for i in range(1, nx-1):
        new_u[i] = u[i] + D*dt/(dx*dx)*(u[i+1]-2*u[i]+u[i-1])

    new_u, u = u, new_u
