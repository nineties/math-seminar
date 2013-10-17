define(["d3", "util"], function (d3, U) {
    var size = {
            width: 800, height: 300,
            top: 20, right: 20, bottom: 30, left: 80
        };

    function appendCircle(G, i, x, y) {
        G.points[i] = G.svg.append("circle")
            .attr("cx", G.area.x(x))
            .attr("cy", G.area.y(y))
            .attr("r", 5)
            .attr("fill", "pink")
            .style("cursor", "pointer")
            .call(d3.behavior.drag()
                .on("drag", function () {
                    var x = G.area.x.invert(d3.mouse(this)[0]);
                    var y = Math.sin(x);
                    G.xs[i] = x;
                    G.ys[i] = y;
                    G.points[i]
                        .attr("cx", G.area.x(x))
                        .attr("cy", G.area.y(y));
                    G.path.attr("d", G.line(G.xticks));
                }));
    }

    function draw(slide) {
        var G = {};
        var xrange = [0,  2*Math.PI];
        var yrange = [-1, 1];

        G.xticks = d3.range(0, 10, 0.1);
        G.N = 3;
        G.xs = [2*Math.PI/3, Math.PI, 4*Math.PI/3];
        G.ys = [Math.sin(G.xs[0]), Math.sin(G.xs[1]), Math.sin(G.xs[2])];

        G.svg = U.createSVGArea(slide, size)
        G.area = U.createArea(size, xrange, yrange);
        U.drawXaxis(G);
        U.drawYaxis(G);

        G.points = [];
        for (var i = 0; i < G.N; i++) {
            appendCircle(G, i, G.xs[i], G.ys[i]);
        }

        G.line = d3.svg.line()
            .x(function (x) { return G.area.x(x); })
            .y(function (x) {
                var y = 0;
                for (var i = 0; i < G.N; i++) {
                    var t = G.ys[i];
                    for (var j = 0; j < G.N; j++) {
                        if (i === j) continue;
                        t *= (x - G.xs[j])/(G.xs[i] - G.xs[j]);
                    }
                    y += t;
                }
                return G.area.y(y);
            })
            .interpolate("basis");

        G.svg.append("path")
            .attr("class", "line")
            .attr("d", d3.svg.line()
                .x(function (x) { return G.area.x(x); })
                .y(function (x) { return G.area.y(Math.sin(x)); })
                .interpolate("basis")(G.xticks));

        G.path = G.svg.append("path")
            .attr("class", "line")
            .style("stroke", "lightpink")
            .attr("d", G.line(G.xticks));

        G.path
            .style("cursor", "pointer")
            .on("dblclick", function (d) {
                var x = G.area.x.invert(d3.mouse(this)[0]);
                var y = Math.sin(x);
                G.xs[G.N] = x;
                G.ys[G.N] = y;

                var i = G.N;
                appendCircle(G, G.N, x, y);

                G.N += 1;
                G.path.attr("d", G.line(G.xticks));
            });

        slide.G = G;
    }

    return {
        initialize: draw
    }
});
