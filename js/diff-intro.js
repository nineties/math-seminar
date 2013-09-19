define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
            width: 800, height: 300,
            top: 20, right: 20, bottom: 30, left: 80
        };

    function f(x) {
        return x*x;
    }

    function tangent(a, b, x) {
        return (b+a)*(x-a)+a*a;
    }
    
    function grad(a, b) {
        return a + b;
    }

    function draw(slide) {
        var G = {};
        var xrange = [0, 1];
        var yrange = [0, 1];
        var x = d3.range(0, 1, 0.01);
        var x0 = 0.3;
        var x1 = 0.8;

        G.svg = U.createSVGArea(slide, size)
        G.area = U.createArea(size, xrange, yrange);
        U.drawXaxis(G);
        U.drawYaxis(G);

        G.line = d3.svg.line()
            .x(function (d) { return G.area.x(d); })
            .y(function (d) { return G.area.y(f(d)); })
            .interpolate("basis");

        G.svg.append("path")
            .attr("class", "line")
            .attr("d", G.line(x));

        // movable objects
        G.svg.append("circle")
            .attr("cx", G.area.x(x0))
            .attr("cy", G.area.y(f(x0)))
            .attr("r", 6)
            .style("fill", "pink");

        G.point = G.svg.append("circle")
            .attr("cx", G.area.x(x1))
            .attr("cy", G.area.y(f(x1)))
            .attr("r", 6)
            .style("fill", "pink");

        G.tangent = 
            U.drawLine(G,
                [0, tangent(x0, x1, 0)],
                [1, tangent(x0, x1, 1)]
            )
            .style("stroke", "lightblue");

        U.drawLine(G, [x0, 0], [x0, f(x0)])
            .style("stroke-dasharray", [5, 5])
            .style("stroke", "white");
        G.line1 = U.drawLine(G, [x1, 0], [x1, f(x1)])
            .style("stroke-dasharray", [5, 5])
            .style("stroke", "white");
        G.line2 = U.drawLine(G, [x0, f(x0)], [x1, f(x0)])
            .style("stroke-dasharray", [5, 5])
            .style("stroke", "pink");
        G.line3 = U.drawLine(G, [x1, f(x0)], [x1, f(x1)])
            .style("stroke-dasharray", [5, 5])
            .style("stroke", "pink");

        G.info = G.svg.append("text")
            .attr("class", "label")
            .attr("x", G.area.x(x1)+30)
            .attr("y", G.area.y(f(x1)))
            .text("傾き=" + Math.round(grad(x0, x1)*1000)/1000);

        // mouse event
        G.point.style("cursor", "pointer");
        G.point.call(d3.behavior.drag()
                .on("drag", function () {
                    var x = G.area.x.invert(d3.mouse(this)[0]);

                    G.point
                        .attr("cx", G.area.x(x))
                        .attr("cy", G.area.y(f(x)));

                    G.tangent
                        .attr("x1", G.area.x(0))
                        .attr("x2", G.area.x(1))
                        .attr("y1", G.area.y(tangent(x0, x, 0)))
                        .attr("y2", G.area.y(tangent(x0, x, 1)));

                    G.line1
                        .attr("x1", G.area.x(x))
                        .attr("x2", G.area.x(x))
                        .attr("y2", G.area.y(f(x)));

                    G.line2
                        .attr("x2", G.area.x(x));

                    G.line3
                        .attr("x1", G.area.x(x))
                        .attr("x2", G.area.x(x))
                        .attr("y2", G.area.y(f(x)));

                    G.info
                        .attr("x", G.area.x(x)+30)
                        .attr("y", G.area.y(f(x)))
                        .text("傾き=" + Math.round(grad(x0, x)*1000)/1000);
                }));

        slide.G = G;
    }

    return {
        initialize: draw
    }
});
