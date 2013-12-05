N = 10
binom = [1,1]
for k in range(1, N):
    newbinom = [1]
    for i in range(0, k):
        newbinom.append(binom[i] + binom[i+1])
    newbinom.append(1)
    binom = newbinom

for k in range(0,N+1):
    print "{0}\t{1}".format(k,binom[k]* 0.6**k * 0.3**(N-k))
