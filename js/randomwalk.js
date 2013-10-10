define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
                width: 900, height: 500,
                top: 0, right: 0, bottom: 0, left: 0
        },
        walk = {
            size: {
                width: 800, height: 50,
                top: 20, right: 20, bottom: 30, left: 80
            }
        },
        graph = {
            size: {
                width: 800, height: 250,
                top: 150, right: 20, bottom: 30, left: 80
            }
        },
        dt = 0.5;

    function initState(sim) {
        sim.pos = 0;
        sim.data = [0];
        sim.xmax = 4;
        sim.step = 0;
    }

    function initializeWalk(sim) {
        sim.walk = {};
        sim.walk.svg = U.createGroup(sim.svg, walk.size);
        sim.walk.area = U.createArea(walk.size, [-sim.xmax, sim.xmax], [0, 2*sim.xmax*walk.size.height/walk.size.width]);

        sim.walk.point = sim.walk.svg.append("circle")
            .attr("cx", sim.walk.area.x(0))
            .attr("cy", sim.walk.area.y(0.3))
            .attr("r", sim.walk.area.xscale(0.3))
            .style("fill", "pink");

        sim.walk.xaxis = U.drawXaxis(sim.walk);
    }

    function initializeGraph(sim) {
        sim.graph = {};
        sim.graph.svg = U.createGroup(sim.svg, graph.size);
        sim.graph.area = U.createArea(graph.size, [0, 10], [-sim.xmax-1, sim.xmax+1]);
        sim.graph.xaxis = U.drawXaxis(sim.graph);
        sim.graph.yaxis = U.drawYaxis(sim.graph);

        U.drawLine(sim.graph, [0, 0], [10, 0])
            .style("stroke-dasharray", [5, 5]);

        sim.graph.svg.append("text")
            .attr("class", "label")
            .attr("x", graph.size.width/2)
            .attr("y", graph.size.height+50)
            .attr("text-anchor", "middle")
            .text("ステップ数");

        sim.graph.path = sim.graph.svg.append("path")
            .attr("class", "line")
            .style("stroke", "pink");

        sim.graph.line = d3.svg.line()
            .x(function (d,i) { return sim.graph.area.x(i); })
            .y(function (d) { return sim.graph.area.y(d); });
    }

    function transit(sim, duration) {
        sim.walk.area.x.domain([-sim.xmax-1, sim.xmax+1]);
        sim.walk.area.xscale.domain([0, 2*sim.xmax+2]);
        sim.walk.area.y.domain([0, 2*sim.xmax*walk.size.height/walk.size.width]);

        sim.walk.point
            .attr("cx", sim.walk.area.x(sim.pos))
            .attr("cy", sim.walk.area.y(0.3))
            .attr("r", sim.walk.area.xscale(0.3));

        sim.walk.xaxis.transition().duration(duration)
            .call(d3.svg.axis().scale(sim.walk.area.x).orient("bottom"));

        sim.graph.area.x.domain([0, d3.max([10, sim.step])]);
        sim.graph.area.y.domain([-sim.xmax-1, sim.xmax+1]);

        sim.graph.xaxis.transition().duration(duration)
            .call(d3.svg.axis().scale(sim.graph.area.x).orient("bottom"));
        sim.graph.yaxis.transition().duration(duration)
            .call(d3.svg.axis().scale(sim.graph.area.y).orient("left"));

        sim.graph.path
            .attr("d", sim.graph.line(sim.data));
    }

    function simulate(sim) {
        sim.step += 1;
        if (Math.random() <= 0.5) {
            sim.pos += 1;
        } else {
            sim.pos -= 1;
        }
        sim.data.push(sim.pos);
        if (Math.abs(sim.pos) > sim.xmax) { sim.xmax = Math.abs(sim.pos); }
        transit(sim, dt*1000);
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
        sim.interval = setInterval(function () { simulate(sim); }, dt*1000);
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
