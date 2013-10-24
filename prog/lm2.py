import csv
import numpy as np
from numpy import linalg as LA

reader = csv.reader(open("data/lm-test-data.csv", "rb"), delimiter=",")
arr = np.array(list(reader), dtype=float) # (x y z w)

X = arr[...,0:3]    # (x y z)
w = arr[...,3:4]    # w
XT = X.T

print LA.solve(np.dot(XT, X), np.dot(XT, w))
