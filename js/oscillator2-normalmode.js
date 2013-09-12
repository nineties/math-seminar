define(["d3", "util", "math", "numeric", "MathJax"], function (d3, U, M, numeric, MathJax) {
    var size = {
                width: 900, height: 500,
                top: 0, right: 0, bottom: 0, left: 0
        },
        osci = {
            size: {
                width: 800, height: 50,
                top: 20, right: 20, bottom: 30, left: 80
            }
        },
        graph1 = {
            size: {
                width: 800, height: 110,
                top: 120, right: 20, bottom: 30, left: 80
            }
        },
        graph2 = {
            size: {
                width: 800, height: 110,
                top: 300, right: 20, bottom: 30, left: 80
            }
        },
        N = 2,
        k = [1, 1, 1],
        l = [1, 1, 1],
        m = [1, 1],
        colors = ["lightblue", "lightgreen"],
        dt = 0.1,
        drawSpring = true,
        trange = 20,
        xrange = [-1, 1];

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

        if (drawSpring) {
            sim.springPoints = [];
            for (var i = 0; i <= N; i++)
                sim.springPoints[i] = [];
            sim.springOpt = {
                y: sim.h/2,
                w: sim.h/2*0.9,
                offset: 0.15,
                nzigzag: 20
            }
        }

        sim.step = 0;
        sim.timeOffset = 0;

        sim.history = [];
        for (var i = 0; i < N; i++) sim.history[i] = [];

        sim.modes = [];
        for (var i = 0; i < N; i++) sim.modes[i] = [];

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

        if (drawSpring) {
            sim.spring = [];
            for (var i = 0; i <= N; i++) {
                U.computeSpring(
                        sim.springPoints[i],
                        [sim.offs[i], sim.offs[i] + l[i]],
                        sim.springOpt);
                sim.spring[i] = sim.osci.svg
                    .append("path").attr("class", "line")
                    .attr("id", "spring")
                    .attr("d", sim.osci.line(sim.springPoints[i]));
            }
        }

        sim.object = [];
        for (var i = 0; i < N; i++) {
            sim.object[i] = sim.osci.svg
                .append("rect")
                .attr("x", sim.osci.area.x(sim.offs[i+1]-0.1))
                .attr("y", sim.osci.area.y(sim.h))
                .attr("width", sim.osci.area.xscale(0.2))
                .attr("height", sim.osci.area.yscale(sim.h)-2)
                .style("fill", colors[i]);
        }
    }

    function addEventListeners(sim) {
        sim.osci.svg.selectAll("#spring")
            .style("cursor", "pointer")
            .on("click", function (d, i) {
                sim.osci.svg.select("#kedit"+i).remove();
                sim.osci.svg.append("foreignObject")
                    .attr("id", "kedit" + i)
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
                    .html("k=<input type=\"text\" size=\"1\" value=\"" + sim.k[i] + "\">")
                    .on("submit", function() {
                        var value = parseFloat(d3.event.target.elements[0].value);
                        if (!isNaN(value) && value > 0)
                            sim.k[i] = value;
                        sim.osci.svg.select("#kedit"+i).remove();
                        computeEigenMatrix(sim);
                    });
            });

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
                            computeEigenMatrix(sim);
                        });
                })
            );
    }

    function initializeDisplGraph(sim) {
        sim.graph1 = {};
        sim.graph1.svg = U.createGroup(sim.svg, graph1.size);
        sim.graph1.area = U.createArea(graph1.size, [0, trange], xrange);
        sim.graph1.xaxis = U.drawXaxis(sim.graph1);
        sim.graph1.yaxis = sim.graph1.svg.append("g").attr("class", "y axis")
            .call(d3.svg.axis().ticks(5).scale(sim.graph1.area.y).orient("left"));
        U.drawLine(sim.graph1, [0, 0], [trange, 0])
            .style("stroke-dasharray", [5, 5]);

        sim.graph1.svg.append("text")
            .attr("class", "label")
            .attr("x", -70)
            .attr("y", graph1.size.height/2)
            .attr("text-anchor", "middle")
            .attr("writing-mode", "tb")
            .text("変位");

        sim.graphs1 = [];
        for (var i = 0; i < N; i++) {
            sim.graphs1[i] = sim.graph1.svg.append("path")
                .attr("class", "line")
                .style("stroke", colors[i]);
        }
        sim.graph1.line = d3.svg.line()
            .x(function (d,i) { return sim.graph1.area.x(dt*i+sim.timeOffset); })
            .y(function (d) { return sim.graph1.area.y(d); });
    }

    function round(x) { return Math.round(x*100)/100; }
    function computeEigenMatrix(sim, slide) {
        var mat = [];
        for (var i = 0; i < N; i++) {
            mat[i] = [];
            for (var j = 0; j < N; j++) {
                mat[i][j] = 0;
            }
        }
        for (var i = 0; i < N; i++) {
            if (i > 0) mat[i][i-1] = -sim.k[i]/sim.m[i];
            mat[i][i] = (sim.k[i]+sim.k[i+1])/sim.m[i];
            if (i < N-1) mat[i][i+1] = -sim.k[i+1]/sim.m[i];
        }

        var eig = numeric.eig(mat);
        sim.mat = eig.E.inv();

        if (!sim.info) {
            sim.info = d3.select(slide).append("p")
                .style("font-size", "0.7em");
        }
        var text = "";
        for (var i = 0; i < N; i++) {
            text += "基準振動" + i + ": \\(";
            for (var j = 0; j < N; j++) {
                var v = round(sim.mat.x[i][j]);
                if (v === 0) continue;
                text += v + "x_" + j;
                if (j !== N-1) text += " + ";
            }

            var lambda = eig.lambda.x[i];
            var T = 2*Math.PI/Math.sqrt(lambda);
            text += "\\), 固有値: \\(" + round(lambda) + "\\), 周期: \\(" + round(T) + "\\)秒";
            if (i !== N-1) text += "<br>";
        }
        sim.info.html(text);
        MathJax.Hub.Typeset(slide);
    }

    function computeNormalMode(sim, i) {
        var h = sim.history[0].length-1;
        var x = 0;
        for (var j = 0; j < N; j++) {
            x += sim.history[j][h] * sim.mat.x[i][j];
        }
        return x;
    }

    function initializeNormalModeGraph(sim) {
        sim.graph2 = {};
        sim.graph2.svg = U.createGroup(sim.svg, graph2.size);
        sim.graph2.area = U.createArea(graph2.size, [0, trange], xrange);
        sim.graph2.xaxis = U.drawXaxis(sim.graph2);
        sim.graph2.yaxis = sim.graph2.svg.append("g").attr("class", "y axis")
            .call(d3.svg.axis().ticks(5).scale(sim.graph2.area.y).orient("left"));
        U.drawLine(sim.graph2, [0, 0], [trange, 0])
            .style("stroke-dasharray", [5, 5]);

        sim.graph2.svg.append("text")
            .attr("class", "label")
            .attr("x", graph2.size.width/2)
            .attr("y", graph2.size.height+50)
            .attr("text-anchor", "middle")
            .text("時刻");

        sim.graph2.svg.append("text")
            .attr("class", "label")
            .attr("x", -70)
            .attr("y", graph2.size.height/2)
            .attr("text-anchor", "middle")
            .attr("writing-mode", "tb")
            .text("基準振動");

        sim.graphs2 = [];
        for (var i = 0; i < N; i++) {
            sim.graphs2[i] = sim.graph2.svg.append("path")
                .attr("class", "line")
                .style("stroke", "white");
        }
        sim.graph2.line = d3.svg.line()
            .x(function (d,i) { return sim.graph2.area.x(dt*i+sim.timeOffset); })
            .y(function (d) { return sim.graph2.area.y(d); });
    }

    function transit(sim, duration) {
        if (drawSpring) {
            for (var i = 0; i <= N; i++) {
                U.computeSpring(
                        sim.springPoints[i],
                        [sim.offs[i] + ((i > 0) ? sim.x[2*i-2] : 0),
                         sim.offs[i] + l[i] + ((i < N) ? sim.x[2*i] : 0)],
                         sim.springOpt);
                sim.spring[i].transition().duration(duration).ease("linear")
                    .attr("d", sim.osci.line(sim.springPoints[i]));
            }
        }
        for (var i = 0; i < N; i++) {
            sim.object[i].transition().duration(duration).ease("linear")
                .attr("x", sim.osci.area.x(sim.offs[i+1] + sim.x[2*i] - 0.1));

            if (sim.history[i].length > 0) {
                sim.graphs1[i].transition().duration(duration).ease("linear")
                    .attr("d", sim.graph1.line(sim.history[i]));

                sim.graphs2[i].transition().duration(duration).ease("linear")
                    .attr("d", sim.graph2.line(sim.modes[i]));
            }
        }

        var time = sim.step * dt;
        if (time > trange) {
            sim.timeOffset = time-trange;
            sim.graph1.area.x.domain([sim.timeOffset, time]);
            sim.graph2.area.x.domain([sim.timeOffset, time]);
        } else if (sim.step == 0) {
            sim.graph1.area.x.domain([0, trange]);
            sim.graph2.area.x.domain([0, trange]);
        }

        sim.graph1.xaxis.transition().duration(duration).ease("linear")
            .call(d3.svg.axis().scale(sim.graph1.area.x).orient("bottom"));
        sim.graph2.xaxis.transition().duration(duration).ease("linear")
            .call(d3.svg.axis().scale(sim.graph2.area.x).orient("bottom"));
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

        for (var i = 0; i < N; i++) {
            sim.history[i].push(sim.x[2*i]);
            if (time > trange)
                sim.history[i].shift();
        }
        for (var i = 0; i < N; i++) {
            sim.modes[i].push(computeNormalMode(sim, i));
            if (time > trange)
                sim.modes[i].shift();
        }

        transit(sim, dt*1000);
    }

    function initialize(slide) {
        var sim = {};
        sim.svg = U.createSVGArea(slide, size);

        initState(sim);
        initializeOscillator(sim);
        initializeDisplGraph(sim);
        initializeNormalModeGraph(sim);
        computeEigenMatrix(sim, slide);
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
