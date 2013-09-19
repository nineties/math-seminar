define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
                width: 900, height: 600,
                top: 0, right: 0, bottom: 0, left: 0
        },
        walk = {
            size: {
                width: 800, height: 200,
                top: 20, right: 20, bottom: 30, left: 80
            }
        },
        graph = {
            size: {
                width: 800, height: 200,
                top: 300, right: 20, bottom: 30, left: 80
            }
        },
        N = 100,
        maxstep = 100,
        color = d3.scale.category20();

    function initState(sim) {
        sim.pos = [];
        for (var i = 0; i < N; i++) { sim.pos[i] = 0; }
        sim.xmax = 4;
        sim.step = 0;
        sim.dt = 0.5;
        sim.counts = [];
        sim.history = [];
    }

    function initializeWalk(sim) {
        sim.walk = {};
        sim.walk.svg = U.createGroup(sim.svg, walk.size);
        sim.walk.area = U.createArea(walk.size, [-sim.xmax, sim.xmax], [0, walk.size.height]);

        sim.walk.point = [];
        for (var i = 0; i < N; i++) {
            sim.walk.point[i] = sim.walk.svg.append("circle")
                .attr("cx", sim.walk.area.x(0))
                .attr("cy", sim.walk.area.y(walk.size.height*(i+1)/(N+1)))
                .attr("r", 3)
                .style("fill", color(i));
        }

        sim.walk.xaxis = U.drawXaxis(sim.walk);

        sim.walk.info = sim.walk.svg.append("text")
            .attr("x", walk.size.width/2+50)
            .attr("y", walk.size.height*3/4)
            .style("fill", "white")
            .style("opacity", 0.7)
            .text("step=" + 0);
    }

    function initializeGraph(sim) {
        sim.graph = {};
        sim.graph.svg = U.createGroup(sim.svg, graph.size);
        sim.graph.area = U.createArea(graph.size, [-sim.xmax-1, sim.xmax+1], [0, N/3]);
        sim.graph.xaxis = U.drawXaxis(sim.graph);
        sim.graph.yaxis = U.drawYaxis(sim.graph);

        sim.graph.path = sim.graph.svg.append("path")
            .style("stroke", "white")
            .style("fill", "none");
        sim.graph.line = d3.svg.line()
            .x(function (d) { return sim.graph.area.x(d[0]); })
            .y(function (d) { return sim.graph.area.y(d[1]); })
            .interpolate("step");
    }

    function transit(sim, duration) {
        sim.walk.area.x.domain([-sim.xmax-1, sim.xmax+1]);
        sim.walk.area.xscale.domain([0, 2*sim.xmax+2]);
        sim.walk.area.y.domain([0, 2*sim.xmax*walk.size.height/walk.size.width]);

        for (var i = 0; i < N; i++) {
            sim.walk.point[i]
                .transition().duration(duration/2).ease("linear")
                .attr("cx", sim.walk.area.x(sim.pos[i]))
                .attr("r", 3);
        }

        sim.walk.info.text("step=" + sim.step);

        sim.walk.xaxis.transition().duration(duration)
            .call(d3.svg.axis().scale(sim.walk.area.x).orient("bottom"));

        sim.graph.area.x.domain([-sim.xmax-1, sim.xmax+1]);

        sim.graph.xaxis.transition().duration(duration)
            .call(d3.svg.axis().scale(sim.graph.area.x).orient("bottom"));

        var count = [];
        for (var x = 0; x < 2*sim.xmax+1; x++) {
            count[x] = [x-sim.xmax, 0];
            for (var j = 0; j < N; j++) {
                if (sim.pos[j] == x-sim.xmax) { count[x][1] += 1; }
            }
        }
        sim.graph.path.attr("d", sim.graph.line(count));

        if (sim.step > 0 && sim.step%30 == 0) {
            sim.counts.push(count);
            sim.history[sim.step/30-1] = sim.graph.svg.append("path")
                .style("stroke", color(sim.step/30-1))
                .style("fill", color(sim.step/30-1))
                .attr("d", sim.graph.line(sim.counts[sim.step/30-1]));
        }

        for (var i = 0; i < sim.counts.length; i++) {
            sim.history[i].transition().duration(duration)
                .attr("d", sim.graph.line(sim.counts[i]));
        }
    }

    function simulate(sim) {
        if (sim.step == maxstep) return;
        sim.step += 1;
        for (var i = 0; i < N; i++) {
            if (Math.random() <= 0.5) {
                sim.pos[i] += 1;
            } else {
                sim.pos[i] -= 1;
            }
            if (Math.abs(sim.pos[i]) > sim.xmax) { sim.xmax = Math.abs(sim.pos[i]); }
        }
        transit(sim, sim.dt*1000);
    }

    function initialize(slide) {
        var sim = {};
        sim.svg = U.createSVGArea(slide, size);
        initState(sim);
        initializeWalk(sim);
        initializeGraph(sim);
        slide.sim = sim;
    }

    function start(slide) {
        var sim = slide.sim;
        if (!sim) return;
        initState(sim);
        transit(sim, 0);
        sim.interval = setInterval(function () { simulate(sim); }, sim.dt*1000);
    }

    function stop(slide) {
        var sim = slide.sim;
        if (!sim) return;
        initState(sim);
        transit(sim, 0);
        clearInterval(sim.interval);
    }

    return {
        initialize: initialize,
        start: start,
        stop: stop
    }
});
