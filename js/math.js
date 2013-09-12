define(["numeric"], function (N) {
    function leastSquaresMethod(y, x) {
        var N = Math.min(x.length, y.length);
        var sumx = 0, sumy = 0, sumx2 = 0, sumxy = 0;
        for (var i = 0; i < N; i++) {
            sumx += x[i];
            sumy += y[i];
            sumx2 += x[i]*x[i];
            sumxy += x[i]*y[i];
        }
        var a = (N*sumxy-sumx*sumy)/(N*sumx2-sumx*sumx);
        var b = (sumx2*sumy-sumxy*sumx)/(N*sumx2-sumx*sumx);
        return {
            coef: [b, a],
        }
    }

    function rungekutta(f, x, dt, arg) {
        var k1 = f(x, arg);
        var k2 = f(N.add(x, N.mul(k1, dt*0.5)), arg);
        var k3 = f(N.add(x, N.mul(k2, dt*0.5)), arg);
        var k4 = f(N.add(x, N.mul(k3, dt)), arg);
        return N.add(x,
            N.mul(
            N.add(k1,
            N.add(N.mul(k2, 2),
            N.add(N.mul(k3, 2),
                        k4))), dt/6));
    }
    return {
        leastSquaresMethod: leastSquaresMethod,
        rungekutta: rungekutta
    }
});
