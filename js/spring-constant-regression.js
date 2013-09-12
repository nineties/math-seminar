define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
            width: 700, height: 200,
            top: 20, right: 20, bottom: 70, left: 70
        },
        radius = 3;

    function lm(x, y, o) {
        var sumx2 = 0, sumxy = 0;
        for (var i = 0; i  < x.length; i++) {
            if (o[i]) continue;
            sumx2 += x[i]*x[i];
            sumxy += x[i]*y[i];
        }
        return sumxy/sumx2;
    }

    function error(x, y, o, k) {
        var E = 0;
        for (var i = 0; i < x.length; i++) {
            if (o[i]) continue;
            var e = (y[i] - k * x[i]);
            E += e*e;
        }
        return E;
    }

    function round(v) {
        return Math.round(v*100)/100;
    }

    function mapper(d) {
        var outlierB, springB;
        if (d.springB[0] === "o") {
            outlierB = true;
            springB = +d.springB.slice(1);
        } else {
            outlierB = false;
            springB = +d.springB;
        }
        return {
            dx: +d.dx,
            springB: springB,
            outlierB: outlierB
        }
    }

    function putText(info, k, E) {
        info.text("k=" + round(k) + "kgw/cm=" + round(k*981) + "N/m, E=" + round(E));
    }

    function draw(slide) {
        var sim = {};

        sim.svg = U.createSVGArea(slide, size);

        d3.csv("data/spring.csv", mapper,
            function (rows) {
                var xrange = [0, d3.max(rows, function (d) { return d.dx; })];
                var yrange = [0, d3.max(rows, function (d) { return d.springB; })];

                sim.area = U.createArea(size, xrange, yrange);
                U.drawXaxis(sim);
                U.drawYaxis(sim);

                for (var i = 1; i <= xrange[1]; i++) {
                    U.drawLine(sim, [i, 0], [i, yrange[1]])
                        .style("stroke-dasharray", [2, 5]);
                }
                for (var i = 0; i <= yrange[1]; i++) {
                    U.drawLine(sim, [0, i], [xrange[1], i])
                        .style("stroke-dasharray", [2, 5]);
                }

                for (var i = 0; i < rows.length; i++) {
                    sim.svg.append("circle")
                        .attr("cx", sim.area.x(rows[i].dx))
                        .attr("cy", sim.area.y(rows[i].springB))
                        .attr("r", radius)
                        .style("fill", "pink")
                        .style("stroke", "red");
                }

                sim.svg.append("text")
                    .attr("class", "label")
                    .attr("x", -50)
                    .attr("y", size.height/2)
                    .attr("font-size", "0.8em")
                    .attr("text-anchor", "middle")
                    .attr("writing-mode", "tb")
                    .text("F:復元力の大きさ(kg重)");
                sim.svg.append("text")
                    .attr("class", "label")
                    .attr("x", size.width/2)
                    .attr("y", size.height + 50)
                    .attr("text-anchor", "middle")
                    .text("x:伸び(cm)");

                var x = rows.map(function (d) { return d.dx; });
                var yB = rows.map(function (d) { return d.springB; });
                var oB = rows.map(function (d) { return d.outlierB; });
                var kB = lm(x, yB, oB);

                var E = error(x, yB, oB, kB);
                sim.info = sim.svg.append("text")
                    .attr("class", "label")
                    .attr("font-size", "1.4em")
                    .attr("x", sim.area.x(8))
                    .attr("y", sim.area.y(1))
                    .style("opacity", 0.9);
                putText(sim.info, kB, E);

                sim.lineB = U.drawLine(sim, [0, 0], [xrange[1], kB*xrange[1]])
                    .style("cursor", "pointer")
                    .call(d3.behavior.drag()
                        .on("drag", function () {
                            var pos = d3.mouse(this);
                            var k = sim.area.y.invert(pos[1])/sim.area.x.invert(pos[0]);
                            var E = error(x, yB, oB, k);
                            sim.lineB.attr("y2", sim.area.y(k*xrange[1]));
                            putText(sim.info, k, E);
                        }));
            });
        slide.sim = sim;
    }

    return {
        initialize: draw
    }
});
