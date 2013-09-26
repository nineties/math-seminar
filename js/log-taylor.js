define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
            width: 800, height: 300,
            top: 20, right: 20, bottom: 30, left: 80
        },
        nsample = 100,
        N = 10,
        name = "y=ln(x)",
        fact = [1];
    for (var i = 1; i <= N; i++) {
        fact[i] = i*fact[i-1];
    }

    function diff(n, a) {
        if (n === 0)
            return Math.log(a);
        var v = fact[n-1]/(Math.pow(a, n))
        if (n%2 === 0)
            return -v;
        else
            return v;
    }

    function genLine(G, f) {
        return d3.svg.line()
            .x(function (d) { return G.area.x(d); })
            .y(function (d) { return G.area.y(f(d)); })
            .interpolate("basis");
    }

    function genTaylor(G, n) {
        return function (x) {
            var v = 0.0;
            var dx = 1.0;
            var fact = 1;
            v = diff(0, G.a);
            for (var k = 1; k <= n; k++) {
                dx *= x-G.a;
                fact *= k;
                v += diff(k, G.a)/fact*dx;
            }
            return v;
        }
    }

    function round(x) {
        return Math.round(x*100)/100;
    }

    function draw(G) {
        G.point
            .attr("cx", G.area.x(G.a))
            .attr("cy", G.area.y(diff(0, G.a)));

        for (var i = 0; i < N+1; i++) {
            G.paths[i]
                .attr("d", G.lines[i](G.xticks));
        }

    }

    function initialize(slide) {
        var G = {};
        xrange = [0+1/1000, 5];
        yrange = [-5, 5];
        G.xticks  = d3.range(xrange[0], xrange[1], (xrange[1]-xrange[0])/nsample);
        G.a = 1;
        G.color = d3.scale.category20();

        G.svg = U.createSVGArea(slide, size)
        G.area = U.createArea(size, xrange, yrange);
        U.drawXaxis(G);
        U.drawYaxis(G);
        U.drawLine(G, [xrange[0], 0], [xrange[1], 0])
            .style("stroke-dasharray", [5, 5]);
        U.drawLine(G, [0, yrange[0]], [0, yrange[1]])
            .style("stroke-dasharray", [5, 5]);

        G.lines = [];
        G.lines[0] = genLine(G, function (x) { return diff(0, x); });
        for (var i = 1; i < N+1; i++) {
            G.lines[i] = genLine(G, genTaylor(G, i));
        }

        G.paths = [];
        for (var i = 0; i < N+1; i++) {
            G.paths[i] = G.svg.append("path")
                .attr("class", "line")
                .style("stroke", G.color(i))
                .attr("d", G.lines[i](G.xticks));
        }

        G.point = G.svg.append("circle")
            .attr("cx", G.area.x(G.a))
            .attr("cy", G.area.y(diff(0, G.a)))
            .attr("r", 6)
            .style("fill", "pink")
            .style("cursor", "pointer");

        for (var i = 0; i < N+1; i++) {
            G.svg.append("text")
                .attr("x", size.width/2+200)
                .attr("y", i*25)
                .style("font-size", "0.5em")
                .style("fill", G.color(i))
                .text((i==0)?name:(i + "次近似式"));
        }

        G.point.call(d3.behavior.drag()
                .on("drag", function () {
                    var x = G.area.x.invert(d3.mouse(this)[0]);
                    G.a = x;
                    draw(G);
                }));

        draw(G);

        slide.G = G;
    }

    return {
        initialize: initialize
    }
});
