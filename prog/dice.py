from random import random

def dice():
    r = random()
    for i in range(1,7):
        if r < i/6.0: return i
