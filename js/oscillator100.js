define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
                width: 900, height: 600,
                top: 0, right: 0, bottom: 0, left: 0
        },
        osci = {
            size: {
                width: 800, height: 100,
                top: 20, right: 20, bottom: 30, left: 80
            }
        },
        graph = {
            size: {
                width: 800, height: 300,
                top: 150, right: 20, bottom: 30, left: 80
            }
        },
        N = 100,
        k = [],
        l = [],
        m = [],
        dt = 0.1;

    for (var i = 0; i <= N; i++) {
        k[i] = 100;
        l[i] = 1;
    }

    for (var i = 0; i < N; i++) {
        m[i] = 1;
    }

    function initState(sim) {
        sim.k = k.slice(0);
        sim.m = m.slice(0);
        sim.x = [];
        sim.drag = [];
        sim.moved = [];
        sim.offs = [];
        for (var i = 0; i < N; i++) {
            sim.x[2*i] = 0;     // position
            sim.x[2*i + 1] = 0; // velocity
            sim.drag[i] = false;
        }
        for (var i = 0, offs=0; i <= N; i++) {
            sim.offs[i] = offs;
            offs += l[i];
        }
        sim.w = d3.sum(l);
        sim.h = osci.size.height/osci.size.width*sim.w;

        sim.step = 0;
        sim.timeOffset = 0;
    }

    function clip(dx) {
        if (dx > 0.5) dx = 0.5;
        else if (dx < -0.5) dx = -0.5;
        return dx;
    }

    function initializeOscillator(sim) {
        sim.osci = {};
        sim.osci.svg = U.createGroup(sim.svg, osci.size);
        sim.osci.area = U.createArea(osci.size, [0, sim.w], [0, sim.h]);

        U.drawLine(sim.osci, [0, 0], [sim.w, 0]);
        U.drawLine(sim.osci, [0, 0], [0, sim.h]);
        U.drawLine(sim.osci, [sim.w, 0], [sim.w, sim.h]);

        for (var i = 1; i <= N; i++)
            U.drawLine(sim.osci, [sim.offs[i], 0], [sim.offs[i], -0.05]);

        sim.osci.line = d3.svg.line()
            .x(function (d) { return sim.osci.area.x(d[0]); })
            .y(function (d) { return sim.osci.area.y(d[1]); });

        sim.object = [];
        for (var i = 0; i < N; i++) {
            sim.object[i] = sim.osci.svg
                .append("rect")
                .attr("x", sim.osci.area.x(sim.offs[i+1]-0.1))
                .attr("y", sim.osci.area.y(sim.h))
                .attr("width", sim.osci.area.xscale(0.5))
                .attr("height", sim.osci.area.yscale(sim.h)-2)
                .style("fill", "white");
        }
    }

    function addEventListeners(sim) {
        sim.osci.svg.selectAll("rect")
            .style("cursor", "pointer")
            .call(d3.behavior.drag()
                .on("dragstart", function (d, i) {
                    d3.event.sourceEvent.stopPropagation();
                    sim.drag[i] = true;
                    sim.moved[i] = false;
                    sim.object[i].style("stroke", "red");
                })
                .on("drag", function (d, i) {
                    sim.moved[i] = true;
                    var dx = clip(sim.osci.area.xscale.invert(d3.mouse(this)[0])-sim.offs[i+1]);
                    sim.x[2*i] = dx;
                    sim.x[2*i+1] = 0;
                })
                .on("dragend", function (d, i) {
                    sim.drag[i] = false;
                    sim.object[i].style("stroke", "none");
                    
                    if (sim.moved[i]) return;
                    sim.osci.svg.select("#medit"+i).remove();
                    sim.osci.svg.append("foreignObject")
                        .attr("id", "medit" + i)
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
                        .html("m=<input type=\"text\" size=\"1\" value=\"" + sim.m[i] + "\">")
                        .on("submit", function() {
                            var value = parseFloat(d3.event.target.elements[0].value);
                            if (!isNaN(value) && value > 0)
                                sim.m[i] = value;
                            sim.osci.svg.select("#medit"+i).remove();
                        });
                })
            );
    }

    function initializeGraph(sim) {
        sim.graph = {};
        sim.graph.svg = U.createGroup(sim.svg, graph.size);
        sim.graph.area = U.createArea(graph.size, [0, N-1], [-1,1]);
        sim.graph.xaxis = U.drawXaxis(sim.graph);
        U.drawYaxis(sim.graph);
        U.drawLine(sim.graph, [0, 0], [N-1, 0])
            .style("stroke-dasharray", [5, 5]);

        sim.graph.svg.append("text")
            .attr("class", "label")
            .attr("x", graph.size.width/2)
            .attr("y", graph.size.height+50)
            .attr("text-anchor", "middle")
            .text("質点の位置");

        sim.graph.svg.append("text")
            .attr("class", "label")
            .attr("x", -70)
            .attr("y", graph.size.height/2)
            .attr("text-anchor", "middle")
            .attr("writing-mode", "tb")
            .text("変位");

        sim.points = [];
        for (var i = 0; i < N; i++) {
            sim.points[i] = sim.graph.svg
                .append("circle")
                .attr("cx", sim.graph.area.x(i))
                .attr("cy", sim.graph.area.y(sim.x[2*i]))
                .attr("r", 3)
                .style("fill", "white")
                .style("stroke", "blue");
        }
    }

    function transit(sim, duration) {
        for (var i = 0; i < N; i++) {
            var x = Math.abs(sim.x[2*i]);
            var c1 = 255*(1-x);
            var c2 = 255*(1-0.5*x);
            if (c1 < 0) { c1 = 0; }
            if (c2 < 0) { c2 = 0; }
            sim.object[i].transition().duration(duration).ease("linear")
                .attr("x", sim.osci.area.x(sim.offs[i+1] + sim.x[2*i] - 0.1))
                .style("fill", "rgb(" + c1 + "," + c1 + "," + c2 + ")");
            sim.points[i].transition().duration(duration).ease("linear")
                .attr("cy", sim.graph.area.y(sim.x[2*i]));
        }
    }

    function accel(x, sim) {
        var newx = new Array(2*N);
        for (var i = 0; i < N; i++) {
            if (sim.drag[i]) {
                newx[2*i] = 0;
                newx[2*i+1] = 0;
            } else {
                newx[2*i] = x[2*i+1];
                newx[2*i+1] = 
                    (-sim.k[i]*(x[2*i]-((i>0)?x[2*i-2]:0))+
                      sim.k[i+1]*(((i<N-1)?x[2*i+2]:0)-x[2*i]))/sim.m[i];
            }
        }
        return newx;
    }

    function simulate(sim) {
        sim.x = M.rungekutta(accel, sim.x, dt, sim);

        sim.step += 1;
        var time = sim.step * dt;

        transit(sim, dt*1000);
    }

    function initialize(slide) {
        var sim = {};
        sim.svg = U.createSVGArea(slide, size);
        initState(sim);
        initializeOscillator(sim);
        initializeGraph(sim);
        addEventListeners(sim);
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
