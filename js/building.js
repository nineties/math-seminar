define(["d3", "util", "math", "numeric"], function (d3, U, M, numeric) {
    var size = {
            width: 800, height: 500,
            top: 20, right: 20, bottom: 30, left: 80
        },
        dt = 0.1;

    function createSimplBuilding(b, N) {
        var l = [];
        var k = [];
        var m = [];
        var mu = []
        var offs = [];
        for (var i = 0, o = 0; i < N; i++) {
            l[i] = 1;
            k[i] = 50;
            m[i] = 1;
            mu[i] = 0.2;
            o += l[i];
            offs[i] = o;
        }
        var x = [];
        for (var i = 0; i <= N; i++) {
            x[2*i] = 0;
            x[2*i+1] = 0;
        }

        b.N = N;
        b.x = x;
        b.l = l;
        b.k = k;
        b.m = m;
        b.mu = mu;
        b.offs = offs;
    }

    function setExternalForce(sim) {
        sim.T = 15.56;
        sim.A = 0.1;
    }

    function initState(sim) {
        sim.step = 0;
        if (!sim.buildings) {
            sim.N = 2;
            sim.buildings = [{}, {}];
        }
        createSimplBuilding(sim.buildings[0], 30);
        createSimplBuilding(sim.buildings[1], 10);
        setExternalForce(sim);

        computeEigenMatrix(sim.buildings[0]);
        computeEigenMatrix(sim.buildings[1]);
    }
    
    function clip(dx) {
        if (dx > 0.05) dx = 0.05;
        else if (dx < -0.05) dx = -0.05;
        return dx;
    }

    function initializeSimulator(sim) {
        initState(sim);
        var maxHeight = d3.max(sim.buildings.map(function (b) { return d3.sum(b.l) }));
        sim.area = U.createArea(size, [0, 2*sim.N+1], [-1, maxHeight]);
        sim.line = d3.svg.line()
            .x(function (d) { return sim.area.x(d[0]); })
            .y(function (d) { return sim.area.y(d[1]); })
            .interpolate("linear-closed");

        sim.ground = sim.svg.append("rect")
            .attr("x", sim.area.x(0)).attr("y", sim.area.y(0))
            .attr("width", sim.area.xscale(2*sim.N+1))
            .attr("height", sim.area.yscale(1))
            .style("fill", "saddlebrown")
            .style("stroke", "none");

        for (var i = 0; i < sim.N; i++) {
            var b = sim.buildings[i];
            b.path = sim.svg.append("path")
                .attr("class", "line")
                .style("fill", "lightgrey")
                .style("stroke", "grey")
                .style("stroke-width", 3);
            sim.svg.append("rect")
                .attr("x", sim.area.x(2*i+1))
                .attr("y", sim.area.y(d3.sum(b.l)))
                .attr("width", sim.area.xscale(1))
                .attr("height", sim.area.yscale(d3.sum(b.l)))
                .style("fill", "none")
                .style("stroke", "white")
                .style("stroke-dasharray", [5, 5]);
        }
    }

    function transit(sim, duration) {
        for (var i = 0; i < sim.N; i++) {
            var b = sim.buildings[i];
            var points = [];
            points.push([2*i+1 + external(sim) ,0]);
            for (var j = 0; j < b.N; j++) {
                points.push([2*i+1+b.x[2*j], b.offs[j]]);
            }
            for (var j = b.N-1; j >= 0; j--) {
                points.push([2*i+2+b.x[2*j], b.offs[j]]);
            }
            points.push([2*i+2 + external(sim), 0]);
            b.path.transition().duration(duration).ease("linear")
                .attr("d", sim.line(points));
        }
        sim.ground.transition().duration(duration).ease("linear")
            .attr("x", sim.area.x(external(sim)));
    }

    function external(sim) {
        return sim.A*Math.sin(2*Math.PI*sim.step*dt/sim.T);
    }

    function accel(x, arg) {
        var sim = arg[0];
        var b = arg[1];
        var newx = new Array(2*b.N);

        newx[0] = x[1];
        newx[1] = (-b.k[0]*(x[0]-external(sim))
                  +b.k[1]*(x[2]-x[0]))/b.m[0];

        for (var i = 1; i < b.N-1; i++) {
            newx[2*i] = x[2*i+1];
            newx[2*i+1] = 
                (-b.k[i]*(x[2*i]-x[2*i-2])+
                  b.k[i+1]*(x[2*i+2]-x[2*i])
                 -b.mu[i]*x[2*i+1])/b.m[i];
        }

        newx[2*(b.N-1)] = x[2*(b.N-1)+1];
        newx[2*(b.N-1)+1] = -b.k[b.N-1]*(x[2*(b.N-1)]-x[2*(b.N-2)])/b.m[b.N-1];
        return newx;
    }

    function computeEigenMatrix(b) {
        var mat = [];
        for (var i = 0; i < b.N; i++) {
            mat[i] = [];
            for (var j = 0; j < b.N; j++) {
                mat[i][j] = 0;
            }
        }
        mat[0][0] = (b.k[0]+b.k[1])/b.m[0];
        mat[0][1] = -b.k[1]/b.m[0];

        for (var i = 1; i < b.N-1; i++) {
            mat[i][i-1] = -b.k[i]/b.m[i];
            mat[i][i] = (b.k[i]+b.k[i+1])/b.m[i];
            mat[i][i+1] = -b.k[i+1]/b.m[i];
        }

        mat[b.N-1][b.N-2] = -b.k[b.N-1]/b.m[b.N-1];
        mat[b.N-1][b.N-1] = b.k[b.N-1]/b.m[b.N-1];

    }

    function simulate(sim) {
        if (false) {
            for (var i = 0; i < sim.N; i++) {
                var b = sim.buildings[i];
                var E = 0;
                for (var j = 0; j < b.N; j++) {
                    var dx = b.x[2*j]- ((j > 0)?b.x[2*j-2]:0);
                    var v = b.x[2*j+1];
                    E += b.k[j]*dx*dx/2;
                    E += b.m[j]*v*v/2;
                }
                createSimplBuilding(b, b.N);
            }
            sim.step = 0;
            sim.T += 0.01;
        }
        for (var i = 0; i < sim.N; i++) {
            var b = sim.buildings[i];
            b.x = M.rungekutta(accel, b.x, dt, [sim,b]);
        }
        transit(sim, dt*1000);
        sim.step += 1;
    }

    function initialize(slide) {
        var sim = {};
        sim.svg = U.createSVGArea(slide, size);

        initializeSimulator(sim);
        slide.sim = sim;
    }

    function start(slide) {
        var sim = slide.sim;
        if (!sim) return;
        initState(sim);
        transit(sim, 0);
        sim.interval = setInterval(function () { simulate(sim); }, dt*1000);
    }

    function stop(slide) {
        var sim = slide.sim;
        if (!sim) return;
        transit(sim, 0);
        clearInterval(sim.interval);
    }

    return {
        initialize: initialize,
        start: start,
        stop: stop
    }
});
