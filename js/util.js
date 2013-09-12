define(["d3"], function (d3) {
    function createSVGArea(slide, size) {
        return d3.select(slide).select("svg")
            .attr("width", size.width + size.left + size.right)
            .attr("height", size.height + size.top + size.bottom)
            .append("g")
            .attr("transform", "translate(" + size.left + "," + size.top + ")");
    }

    function createGroup(svg, size) {
        return svg.append("g")
            .attr("transform", "translate(" + size.left + "," + size.top + ")");
    }

    function createArea(size, xrange, yrange) {
        var area = {};
        for (var x in size) { area[x] = size[x]; }
        var width = size.width;
        var height = size.height;
        area.x = d3.scale.linear().domain(xrange).range([0, width]);
        area.y = d3.scale.linear().domain(yrange).range([height, 0]);
        area.xscale = d3.scale.linear()
            .domain([0, xrange[1]-xrange[0]]).range([0, width]);
        area.yscale = d3.scale.linear()
            .domain([0, yrange[1]-yrange[0]]).range([0, height]);
        return area;
    }

    function drawXaxis(G) {
        return G.svg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + G.area.height + ")")
            .call(d3.svg.axis().scale(G.area.x).orient("bottom"));
    }

    function drawYaxis(G) {
        return G.svg.append("g").attr("class", "y axis")
            .call(d3.svg.axis().scale(G.area.y).orient("left"));
    }

    function drawLine(G, b, e) {
        return G.svg.append("line").attr("class", "line")
            .attr("x1",G.area.x(b[0])).attr("y1",G.area.y(b[1]))
            .attr("x2",G.area.x(e[0])).attr("y2",G.area.y(e[1]));
    }

    function computeSpring(points, range, opt) {
        var left = range[0];
        var right = range[1];
        var w = (right - left - 2*opt.offset)/(opt.nzigzag + 1);
        points[0] = [left, opt.y];
        points[1] = [left + opt.offset, opt.y];
        for (var i = 2, n = opt.nzigzag + 2; i < n; i++) {
            points[i] = [
                left + opt.offset + (i-1)*w,
                (i%2 == 0)?(opt.y + opt.w):(opt.y - opt.w)
            ];
        }
        points[opt.nzigzag + 2] = [right - opt.offset, opt.y];
        points[opt.nzigzag + 3] = [right, opt.y];
    }

    return {
        createSVGArea: createSVGArea,
        createGroup: createGroup,
        createArea: createArea,
        drawXaxis: drawXaxis,
        drawYaxis: drawYaxis,
        drawLine: drawLine,
        computeSpring: computeSpring
    }
});
