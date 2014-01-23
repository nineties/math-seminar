from random import gauss

# 3 categories

for i in range(12):
    cat1 = ["A", "B", "C"][i%3]
    val1 = [10, 30, 70][i%3]
    cat2 = ["S", "T"][i%2]
    val2 = [80, 20][i%2]

    print "{0}\t{1}\t{2}".format(cat1, cat2, int(gauss(val1 + val2, 10)))
