define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
            width: 800, height: 100,
            top: 20, right: 20, bottom: 30, left: 20
        },
        dt = 0.5;

    function initState(sim) {
        sim.x = [0, 1]; // position, velocity
        sim.m = 1;
        sim.f = 0;
        sim.drag = false;
        sim.moved = false;
    }

    function clip(v) {
        if (v > 2) return 2;
        else if (v < -2) return -2;
        return v;
    }

    function initialize(slide) {
        var sim = {};

        initState(sim);
        sim.svg = U.createSVGArea(slide, size);
        sim.area = U.createArea(size, [-5, 5], [0, 1]);

        sim.xaxis = sim.svg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + sim.area.height + ")")
            .call(d3.svg.axis().scale(sim.area.x).orient("bottom"));

        sim.line = d3.svg.line()
            .x(function (d) { return sim.area.x(d[0]); })
            .y(function (d) { return sim.area.y(d[1]); });

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

        sim.ball = sim.svg.append("circle")
            .attr("cx", sim.area.x(sim.x[0]))
            .attr("cy", sim.area.y(0.5))
            .attr("r", sim.area.xscale(0.5))
            .style("fill", "lightblue")
            .style("cursor", "pointer")
            .call(d3.behavior.drag()
                .on("dragstart", function () {
                    d3.event.sourceEvent.stopPropagation();
                    sim.drag = true;
                    sim.moved = false;
                })
                .on("drag", function () {
                    sim.moved = true;
                    var f = clip(sim.area.x.invert(d3.mouse(this)[0])-sim.x[0]);
                    f = Math.round(f*2)/2;
                    sim.f = f;
                    var opacity = (Math.abs(f) > 0) ? 0.75 : 0;
                    sim.info.text("m=" + sim.m + "kg, F=" + sim.f + "N");
                    sim.force
                        .attr("x2", sim.area.x(f+sim.x[0]))
                        .style("opacity", opacity);
                })
                .on("dragend", function () {
                    sim.drag = false;
                    if (sim.moved) return;
                    sim.svg.select("#medit").remove();
                    sim.svg.append("foreignObject")
                        .attr("id", "medit")
                        .attr("x", d3.mouse(this)[0])
                        .attr("y", d3.mouse(this)[1])
                        .attr("width", 100)
                        .attr("height", 80)
                        .append("xhtml:form")
                        .attr("class", "inputbox")
                        .style("font", "20px sans-serif")
                        .style("color", "black")
                        .style("background", "white")
                        .style("border", "1px solid blue")
                        .html("m=<input type=\"text\" size=\"1\" value=\"" + sim.m + "\">")
                        .on("submit", function() {
                            var value = parseFloat(d3.event.target.elements[0].value);
                            if (!isNaN(value) && value > 0)
                                sim.m = value;
                            sim.svg.select("#medit").remove();
                            sim.info.text("m=" + sim.m + "kg, F=" + sim.f + "N");
                        });
                })
                );

        sim.info = sim.svg.append("text")
            .attr("font-size", "1em")
            .attr("x", size.width/2+100)
            .attr("y", size.height/2)
            .attr("fill", "white")
            .attr("opacity", 0.8)
            .text("m=" + sim.m + "kg, F=" + sim.f + "N");

        sim.force = U.drawLine(sim, [0, 0.5], [sim.x[0], 0.5])
            .style("stroke", "orange")
            .style("stroke-width", 40)
            .style("opacity", 0)
            .style("marker-end", "url(#force)")
            .style("pointer-events", "none")
            .style("cursor", "pointer")
            .call(d3.behavior.drag()
                .on("drag", function () {
                    var f = clip(sim.area.x.invert(d3.mouse(this)[0])-sim.x[0]);
                    f = Math.round(f*2)/2;
                    sim.f = f;
                    var opacity = (Math.abs(f) > 0) ? 0.75 : 0;
                    sim.info.text("F=" + sim.f);
                    sim.force
                        .attr("x2", sim.area.x(f+sim.x[0]))
                        .style("opacity", opacity);
                }));

        transit(sim, 0);
        slide.sim = sim;
    }

    function transit(sim, duration) {
        sim.area.x.domain([sim.x[0]-5, sim.x[0]+5]);
        sim.xaxis.transition().duration(duration).ease("linear")
            .call(d3.svg.axis().scale(sim.area.x).orient("bottom"));
    }

    // dx/dt = v
    // dv/dt = -(k/m)x
    function accel(x, sim) {
        return [x[1], sim.f/sim.m];
    }

    function simulate(sim) {
        if (sim.drag) return;
        sim.x = M.rungekutta(accel, sim.x, dt, sim);
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
