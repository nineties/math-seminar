define(["d3", "util", "math"], function (d3, U, M) {
    var size = {
            width: 700, height: 300,
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

    function mapper(d) {
        var outlierA, outlierB, springA, springB;
        if (d.springA[0] === "o") {
            outlierA = true;
            springA = +d.springA.slice(1);
        } else {
            outlierA = false;
            springA = +d.springA;
        }
        if (d.springB[0] === "o") {
            outlierB = true;
            springB = +d.springB.slice(1);
        } else {
            outlierB = false;
            springB = +d.springB;
        }
        return {
            dx: +d.dx,
            springA: springA,
            outlierA: outlierA,
            springB: springB,
            outlierB: outlierB
        }
    }

    function draw(slide) {
        var sim = {};

        sim.svg = U.createSVGArea(slide, size);

        d3.csv("data/spring.csv", mapper,
            function (rows) {
                var xrange = [0, d3.max(rows, function (d) { return d.dx; })];
                var yrange = [0, d3.max(rows, function (d) { 
                    return d3.max([d.springA, d.springB]);
                })];

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
                        .attr("cy", sim.area.y(rows[i].springA))
                        .attr("r", radius)
                        .style("fill", "lightblue")
                        .style("stroke", "blue");

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
                    .attr("text-anchor", "middle")
                    .attr("writing-mode", "tb")
                    .text("復元力の大きさ(kg重)");
                sim.svg.append("text")
                    .attr("class", "label")
                    .attr("x", size.width/2)
                    .attr("y", size.height + 50)
                    .attr("text-anchor", "middle")
                    .text("伸び(cm)");

                var x = rows.map(function (d) { return d.dx; });
                var yA = rows.map(function (d) { return d.springA; });
                var yB = rows.map(function (d) { return d.springB; });
                var oA = rows.map(function (d) { return d.outlierA; });
                var oB = rows.map(function (d) { return d.outlierB; });
                var kA = lm(x, yA, oA);
                var kB = lm(x, yB, oB);
                sim.lineA = U.drawLine(sim, [0, 0], [xrange[1], kA*xrange[1]]);
                sim.lineB = U.drawLine(sim, [0, 0], [xrange[1], kB*xrange[1]]);
            });
        slide.sim = sim;
    }

    return {
        initialize: draw
    }
});
