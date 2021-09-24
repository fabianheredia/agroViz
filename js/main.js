const _urlData = "https://www.datos.gov.co/resource/2pnw-mmge.json"



width = 620,
    height = 400
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
}

var getData = (url) => {
    axios.get(url).then(response => {
        let data = response.data
        let dataFiltrada = data.filter(d => d.ciclo_de_cultivo == 'PERMANENTE')
        let dataViz = dataFiltrada.reduce((l, c) => {
            l[c.a_o] = +c.rea_sembrada_ha + (l[c.a_o] || 0)
            return l
        }, {})

        let xx = Object.keys(dataViz).map(d => ({ anio: d, val: dataViz[d] }))
        viz(xx)

        console.log(xx);
    })
}


var viz = (data) => {
    x = d3.scaleBand()
        .domain(data.map(d => d.anio))
        .rangeRound([margin.left, width - margin.right])
    y = d3.scaleLinear()
        .domain([(d3.max(data, d => +d.val)), (d3.min(data, d => +d.val) - 100)]) //por que se pone max-min
        .range([margin.top, height - margin.bottom])


    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))


    svg = d3.select(".dataviz > svg")
        .attr("id", "viz")
        .attr("viewBox", [0, 0, width, height])
    svg.selectAll('.bars').data([data]).join('g').attr('class', 'bars')
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", (d) => x(d.anio))
        .attr("y", d => y(+d.val))
        .transition()
        .duration(4000)
        .attr("width", 20)
        .attr("height", d => y(d3.min(data, d => +d.val) - 100) - y(+d.val))

    svg.selectAll('.xaxis').data([0]).join('g').attr('class', 'xaxis')
        .call(xAxis);

    svg.selectAll('.yaxis').data([0]).join('g').attr('class', 'yaxis')
        .call(yAxis);


}


getData(_urlData)