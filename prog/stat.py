from scipy import stats

for n in range(1,11):
    print "{0}\t&{1}\t&{2}\t&{3}\\\\".format(
            n,
            stats.t.ppf(0.9, n),
            stats.t.ppf(0.95, n),
            stats.t.ppf(0.975, n))
