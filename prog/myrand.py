# -*- coding: utf-8 -*-
from random import random, gauss
from math import sqrt, exp, log, cos, pi

def uniform(a, b):
    return a + random()*(b-a)

def exponential(lam):
    return -log(random())/lam

def bernoulli(p):
    if random() <= p:
        return 1
    else:
        return 0

def binomial(n, p):
    x = 0
    for i in range(n):
        x += bernoulli(p)
    return x

def binomial2(n, p):    #n が大きい時
    return round(gauss(n*p, sqrt(n*p*(1-p))))

def poisson(lam):
    v = exp(lam) * random()
    k = 0
    while v >= 1:
        v *= random()
        k += 1
    return k

def beta25():
    while True:
        u1 = random()
        u2 = random() * 2.6
        if u2 <= 30*u1*(1-u1)**4:
            return u1

def normal(mu, sigma):
    x = random()
    y = random()
    z = sqrt(-2*log(x)) * cos(2*pi*y)
    return mu + sigma * z

def dice():
    r = random()
    for i in range(1,7):
        if r < i/6.0: return i
