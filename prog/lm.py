import csv
import numpy as np
from numpy import linalg as LA

reader = csv.reader(open("./test-data.csv", "rb"), delimiter=",")

sum_x2 = 0.0
sum_y2 = 0.0
sum_z2 = 0.0
sum_xy = 0.0
sum_yz = 0.0
sum_zx = 0.0
sum_xw = 0.0
sum_yw = 0.0
sum_zw = 0.0

for x,y,z,w in reader:
    x = float(x)
    y = float(y)
    z = float(z)
    w = float(w)

    sum_x2 += x*x
    sum_y2 += y*y
    sum_z2 += z*z
    sum_xy += x*y
    sum_yz += y*z
    sum_zx += z*x
    sum_xw += x*w
    sum_yw += y*w
    sum_zw += z*w

A = np.array([[sum_x2, sum_xy, sum_zx],
              [sum_xy, sum_y2, sum_yz],
              [sum_zx, sum_yz, sum_z2]])
b = np.array([sum_xw, sum_yw, sum_zw])
print LA.solve(A, b)
