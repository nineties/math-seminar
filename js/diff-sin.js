define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
                width: 900, height: 600,
                top: 0, right: 0, bottom: 0, left: 0
        },
        graph1 = {
            size: {
                width: 800, height: 180,
                top: 20, right: 20, bottom: 30, left: 80
            }
        },
        graph2 = {
            size: {
                width: 800, height: 180,
                top: 280, right: 20, bottom: 30, left: 80
            }
        };

    function tangent(a, x) {
        return Math.cos(a)*(x-a)+Math.sin(a);
    }

    function draw(slide) {
        var xrange = [-5, 5];
        var yrange = [-1, 1];
        var x = d3.range(-5, 5, 0.1);

        var G = {};
        G.graph1 = {};
        G.graph1.svg = U.createSVGArea(slide, graph1.size)
        G.graph1.area = U.createArea(graph1.size, xrange, yrange);
        U.drawXaxis(G.graph1);
        U.drawYaxis(G.graph1);
        U.drawLine(G.graph1, [-5, 0], [5, 0])
            .style("stroke-dasharray", [5, 5]);
        U.drawLine(G.graph1, [0, -1], [0, 1])
            .style("stroke-dasharray", [5, 5]);

        G.graph1.line = d3.svg.line()
            .x(function (d) { return G.graph1.area.x(d); })
            .y(function (d) { return G.graph1.area.y(Math.sin(d)); })
            .interpolate("basis");

        G.graph1.svg.append("path")
            .attr("class", "line")
            .attr("d", G.graph1.line(x));

        G.graph2 = {};
        G.graph2.svg = U.createSVGArea(slide, graph2.size)
        G.graph2.area = U.createArea(graph2.size, xrange, yrange);
        U.drawXaxis(G.graph2);
        U.drawYaxis(G.graph2);
        U.drawLine(G.graph2, [-5, 0], [5, 0])
            .style("stroke-dasharray", [5, 5]);
        U.drawLine(G.graph2, [0, -1], [0, 1])
            .style("stroke-dasharray", [5, 5]);

        G.graph2.line = d3.svg.line()
            .x(function (d) { return G.graph2.area.x(d); })
            .y(function (d) { return G.graph2.area.y(Math.cos(d)); })
            .interpolate("basis");

        G.graph2.svg.append("path")
            .attr("class", "line")
            .attr("d", G.graph2.line(x));

        // movable objects
        G.graph1.point = G.graph1.svg.append("circle")
            .attr("cx", G.graph1.area.x(0))
            .attr("cy", G.graph1.area.y(0))
            .attr("r", 6)
            .style("fill", "pink");
        G.graph2.point = G.graph2.svg.append("circle")
            .attr("cx", G.graph2.area.x(0))
            .attr("cy", G.graph2.area.y(1.0))
            .attr("r", 6)
            .style("fill", "pink");

        G.graph1.tangent =
            U.drawLine(G.graph1,
                    [-1.5, tangent(0, -1.5)],
                    [1.5, tangent(0, 1.5)]
            )
            .style("stroke", "lightblue");

        G.graph1.line1 = U.drawLine(G.graph1, [0, 0], [0, 0])
            .style("stroke-dasharray", [5, 5])
            .style("stroke", "pink");
        G.graph2.line1 = U.drawLine(G.graph2, [0, 0], [0, 1.0])
            .style("stroke-dasharray", [5, 5])
            .style("stroke", "pink");
        G.graph2.line2 = U.drawLine(G.graph2, [-5, 1.0], [0, 1.0])
            .style("stroke-dasharray", [5, 5])
            .style("stroke", "pink");

        G.graph1.info = G.graph1.svg.append("text")
            .attr("class", "label")
            .attr("x", G.graph1.area.x(0)+20)
            .attr("y", G.graph1.area.y(0))
            .text("微分係数=" + 1.0);

        // mouse event
        G.graph1.point.style("cursor", "pointer");
        G.graph1.point.call(d3.behavior.drag()
                .on("drag", function () {
                    var x = G.graph1.area.x.invert(d3.mouse(this)[0]);

                    G.graph1.point
                        .attr("cx", G.graph1.area.x(x))
                        .attr("cy", G.graph1.area.y(Math.sin(x)));

                    G.graph2.point
                        .attr("cx", G.graph2.area.x(x))
                        .attr("cy", G.graph2.area.y(Math.cos(x)));

                    G.graph1.tangent
                        .attr("x1", G.graph1.area.x(x-1.5))
                        .attr("x2", G.graph1.area.x(x+1.5))
                        .attr("y1", G.graph1.area.y(tangent(x, x-1.5)))
                        .attr("y2", G.graph1.area.y(tangent(x, x+1.5)));

                    G.graph1.line1
                        .attr("x1", G.graph1.area.x(x))
                        .attr("x2", G.graph1.area.x(x))
                        .attr("y2", G.graph1.area.y(Math.sin(x)));

                    G.graph2.line1
                        .attr("x1", G.graph1.area.x(x))
                        .attr("x2", G.graph1.area.x(x))
                        .attr("y2", G.graph1.area.y(Math.cos(x)));

                    G.graph2.line2
                        .attr("x2", G.graph1.area.x(x))
                        .attr("y1", G.graph1.area.y(Math.cos(x)))
                        .attr("y2", G.graph1.area.y(Math.cos(x)));

                    G.graph1.info
                        .attr("x", G.graph1.area.x(x)+20)
                        .attr("y", G.graph1.area.y(Math.sin(x)))
                        .text("微分係数=" + Math.round(Math.cos(x)*1000)/1000);
                }));

        slide.G = G;
    }

    return {
        initialize: draw
    }
});
