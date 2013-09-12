define(["d3", "MathJax", "util", "math"], function (d3, M, U, M) {
    var size = {
            width: 250, height: 250,
            top: 60, right: 20, bottom: 20, left: 60
        },
        dt = 0.1,
        g = 9.8,
        v0 = Math.sqrt(5/2*g),
        r = 0.2,
        num_trajectory = 11;

    function initState(sim) {
        sim.x = [0, 0, v0, 0]; // x, y, vx, vy
        sim.count = 0;
        if (!sim.trajectory) return;
        for (var i = 0; i < num_trajectory; i++) {
            if (!sim.trajectory[i]) continue;
            sim.trajectory[i].style("opacity", 0);
        }
    }

    function initialize(slide) {
        var sim = {};

        initState(sim);
        sim.svg = U.createSVGArea(slide, size);
        sim.area = U.createArea(size, [0, 5], [-5, 0]);

        sim.svg.append("g").attr("class", "x axis")
            .call(d3.svg.axis().scale(sim.area.x).ticks(5).orient("top"));
        sim.svg.append("text").attr("class", "label")
            .attr("x", size.width/2).attr("y", -size.top/2)
            .text("x");
        sim.svg.append("g").attr("class", "y axis")
            .call(d3.svg.axis().scale(sim.area.y).ticks(5).orient("left"));
        sim.svg.append("text").attr("class", "label")
            .attr("x", -size.left+10).attr("y", size.height/2)
            .text("y");

        sim.ball = sim.svg.append("circle")
            .attr("cx", sim.area.x(sim.x[0]))
            .attr("cy", sim.area.y(sim.x[1]))
            .attr("r",  sim.area.xscale(r))
            .style("fill", "lightblue");

        sim.trajectory = [];
        for (var i = 0; i <= num_trajectory; i++) {
            sim.trajectory[i] = sim.svg.append("circle")
                .attr("cx", sim.area.x(sim.x[0]))
                .attr("cy", sim.area.y(sim.x[1]))
                .attr("r", sim.area.xscale(r))
                .style("fill", "none")
                .style("stroke", "white")
                .style("stroke-dasharray", [2,2]);
            sim.x = M.rungekutta(accel, sim.x, dt);
        }

        slide.sim = sim;
    }

    function transit(sim, duration, ease) {
        sim.ball.transition().duration(duration).ease("linear")
            .attr("cx", sim.area.x(sim.x[0]))
            .attr("cy", sim.area.y(sim.x[1]));
        sim.trajectory[sim.count].style("opacity", 1);
    }

    // dx/dt = vx
    // dy/dt = vy
    // dvx/dt = 0
    // dvy/dt = -g
    function accel(x) {
        return [x[2], x[3], 0, -g];
    }

    function simulate(sim) {
        if (sim.x[0] > 10) {
            initState(sim);
            transit(sim, 0);
        } else {
            sim.x = M.rungekutta(accel, sim.x, dt);
            transit(sim, dt*1000);
            sim.count += 1;
        }
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
