/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7
const height = window.innerHeight * 0.7
const margin = { top: 20, bottom: 60, left: 60, right: 40 }
let chartType = "Area"

// columns:
// "Year","Manhattan","Bronx","Brooklyn","Queens","StatenIsland"

/* LOAD DATA */
d3.csv('median_birth_rates_nyc.csv', d => {
  return {
    year: new Date(+d.Year, 0, 1), // converts 2001 into Jan 1 2001, etc.
    MH: d.Manhattan,
    BX: d.Bronx,
    BK: d.Brooklyn,
    QN: d.Queens,
    SI: d.StatenIsland,
  }
}).then(data => {
  console.log('data :>> ', data);

  // SCALES
  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.BK)) // using Brooklyn
  .range([height - margin.bottom, margin.top])

  const xScale = d3.scaleTime()
  .domain(d3.extent(data, d => d.year))
  .range([margin.left, width - margin.right])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  // BUILD AND CALL AXES
  const xAxis = d3.axisBottom(xScale)
  .ticks(6) // limit the number of tick marks showing -- note: this is approximate

  const xAxisGroup = svg.append("g")
  .attr("class", "xAxis")
  .attr("transform", `translate(${0}, ${height - margin.bottom})`)
  .call(xAxis)

  xAxisGroup.append("text")
  .attr("class", 'xLabel')
  .attr("transform", `translate(${width / 2}, ${35})`)
  .text("Year")

  const yAxis = d3.axisLeft(yScale)

  const yAxisGroup = svg.append("g")
  .attr("class", "yAxis")
  .attr("transform", `translate(${margin.right}, ${0})`)
  .call(yAxis)

  yAxisGroup.append("text")
  .attr("class", 'yLabel')
  .attr("transform", `translate(${-45}, ${height / 2})`)
  .attr("writing-mode", 'vertical-rl')
  .text("Birth rate per 1000")

  if (chartType="Line"){
    // LINE GENERATOR FUNCTION
    const line = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.BK)) // Brooklyn

    // DRAW LINE
    const path = svg.selectAll(".line")
    .data([data]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", d => line(d))
  }

  if (chartType="Area"){
    // AREA GENERATOR FUNCTION
    const area = d3.area()
      .x(d => xScale(d.year))
      .y1(d => yScale(d.BK))
      .y0(height-margin.bottom); // took a while to figure this out!

    // DRAW LINE
    const path = svg.selectAll(".line")
    .data([data]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("d", d => area(d))
  }

});