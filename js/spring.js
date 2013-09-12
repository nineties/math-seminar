define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
            width: 800, height: 100,
            top: 20, right: 20, bottom: 30, left: 20
        },
        dt = 0.1,
        m = 1,
        k = 1.3,
        minf = 0.5,
        springOpt = {
            y: 0.5,
            w: 0.4,
            offset: 0.2, 
            nzigzag: 25
        };

    function initState(sim) {
        sim.x = [0, 0]; // position, velocity
        sim.drag = false;
        sim.springPoints = [];
        sim.stage = 0;
    }

    function clip(sim) {
        if (sim.x[0] > 3) sim.x[0] = 3;
        else if (sim.x[0] < -3) sim.x[0] = -3;
    }

    function initialize(slide) {
        var sim = {};

        initState(sim);
        sim.svg = U.createSVGArea(slide, size);
        sim.area = U.createArea(size, [-5, 4], [0, 1]);

        sim.svg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + sim.area.height + ")")
            .call(d3.svg.axis().scale(sim.area.x).tickValues([-3,-2,-1,0,1,2,3]).orient("bottom"));
        U.drawLine(sim, [-5, 0], [-5, 1]);

        sim.line = d3.svg.line()
            .x(function (d) { return sim.area.x(d[0]); })
            .y(function (d) { return sim.area.y(d[1]); });
        U.computeSpring(sim.springPoints, [-5, 0-0.5], springOpt);

        sim.svg.append("defs").append("marker")
            .attr("id", "force")
            .attr("refX", 0.5)
            .attr("refY", 1)
            .attr("markerUnits", "strokeWidth")
            .attr("markerWidth", 3)
            .attr("markerHeight", 2)
            .attr("orient", "auto")
            .append("path").attr("d", "M 0,0 V 2 L3,1 Z")
            .style("fill", "orange");

        sim.spring = sim.svg.append("path").attr("class", "line")
            .attr("d", sim.line(sim.springPoints));
        sim.ball = sim.svg.append("circle")
            .attr("cx", sim.area.x(0))
            .attr("cy", sim.area.y(0.5))
            .attr("r", sim.area.xscale(0.5))
            .style("fill", "lightblue")
            .style("cursor", "pointer")
            .call(d3.behavior.drag()
                .on("dragstart", function(){
                    d3.event.sourceEvent.stopPropagation();
                    sim.drag = true;
                })
                .on("drag", function(){
                    sim.x[0] = sim.area.x.invert(d3.mouse(this)[0]);
                    sim.x[1] = 0;
                    clip(sim);
                    transit(sim, 0);
                })
                .on("dragend", function(){ sim.drag = false; })
            );

        sim.force = U.drawLine(sim, [sim.x[0], 0.5], [sim.x[0], 0.5])
            .style("stroke", "orange")
            .style("stroke-width", 40)
            .style("opacity", 0)
            .style("marker-end", "url(#force)")
            .style("pointer-events", "none");

        transit(sim, 0);
        slide.sim = sim;
    }

    function transit(sim, duration, ease) {
        if (!ease) ease = "quad";
        U.computeSpring(sim.springPoints, [-5, sim.x[0]-0.5], springOpt);
        sim.spring.transition().duration(duration).ease(ease)
            .attr("d", sim.line(sim.springPoints));
        sim.ball.transition().duration(duration).ease(ease)
            .attr("cx", sim.area.x(sim.x[0]));
        var f = -k*sim.x[0];
        var opacity = (Math.abs(f) > minf) ? 0.75 : 0;
        sim.force
            .transition().duration(duration).ease(ease)
            .attr("x1", sim.area.x(sim.x[0]))
            .attr("x2", sim.area.x(sim.x[0] + f))
            .style("opacity", opacity);
    }

    // dx/dt = v
    // dv/dt = -(k/m)x
    function accel(x) {
        return [x[1], -k/m*x[0]];
    }

    function simulate(sim) {
        if (sim.drag) return;
        sim.x = M.rungekutta(accel, sim.x, dt);
        transit(sim, dt*1000);
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
