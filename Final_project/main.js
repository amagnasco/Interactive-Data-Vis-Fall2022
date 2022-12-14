// columns:
// Key,Affected,Gini,Year

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7
const height = window.innerHeight * 0.7
const margin = { top: 20, bottom: 60, left: 60, right: 40 }

/* basic colors:
{
  "DVH":"red",
  "DH":"orange",
  "DM":"yellow",
  "NH":"blue",
  "NM":"cyan",
  "NL":"green"
}
*/

// code for chart heavily inspired by https://d3-graph-gallery.com/graph/connectedscatter_multi.html

/* LOAD DATA */

d3.csv('gini.csv').then(data => {
  console.log('data :>> ', data);

  // convert columnar series to 
  const Cats = ["DVH","DH","DM","NH","NM","NL"]
  const reformat = Cats.map(function(catName){
    return {
      name: catName,
      values: data.map(function(d){
        return {year: d.Year, gini: +d[catName]};
      })
    };
  });
  console.log('reformatted data :>> ', reformat);

  // SCALES
  const yScale = d3.scaleLinear()
  .domain([0.4,0.6]) // manually set
  .range([height - margin.bottom, margin.top])

  const xScale = d3.scaleLinear()
  .domain([2009.5,2015.5]) ////////// gave up and set manually
  .range([margin.left, width - margin.right])
  console.log('xscale debug :>> ',xScale.domain());

  const CatColor = d3.scaleOrdinal()
    .domain(Cats)
    .range(d3.schemeSet2);

  // CREATE SVG ELEMENT
  const svgGini = d3.select("#containerGini")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  // BUILD AND CALL AXES
  const xAxis = d3.axisBottom(xScale)
  .ticks(6) // limit the number of tick marks showing
  .tickFormat(d3.format("d")); // remove thousands comma from dates

  const xAxisGroup = svgGini.append("g")
  .attr("class", "xAxis")
  .attr("transform", `translate(${0}, ${height - margin.bottom})`)
  .call(xAxis)

  xAxisGroup.append("text")
  .attr("class", 'xLabel')
  .attr("transform", `translate(${width / 2}, ${35})`)
  .text("Year")

  const yAxis = d3.axisLeft(yScale)

  const yAxisGroup = svgGini.append("g")
  .attr("class", "yAxis")
  .attr("transform", `translate(${margin.right * 1.5}, ${0})`) // added +20 or *1.5
  .call(yAxis)

  yAxisGroup.append("text")
  .attr("class", 'yLabel')
  .attr("transform", `translate(${-45}, ${height / 2})`)
  .attr("writing-mode", 'vertical-rl')
  .text("Gini index")

  // LINE GENERATOR FUNCTION
  const line = d3.line()
  .x(d => xScale(+d.year)) /////////////
  .y(d => yScale(+d.gini))

  // DRAW LINES
  const path = svgGini.selectAll(".line")
  .data(reformat) // data needs to take an [] but reformat is already an array
  .join("path")
    .attr("d",d => line(d.values)) ////////////
    .attr("stroke",d => CatColor(d.name))
    .style("stroke-width",3)
    .style("fill","none")

  // DRAW POINTS
  svgGini
  .selectAll("Dots")
  .data(reformat)
  .join('g')
    .style("fill", d => CatColor(d.name))
  .selectAll("Points")
  .data(d => d.values)
  .join("circle")
    .attr("cx", d => xScale(d.year))
    .attr("cy", d => yScale(d.gini))
    .attr("r", 5)
    .attr("stroke", "white")

  // DRAW LEGENDS
  svgGini
  .selectAll("Legends")
  .data(reformat)
  .join('g')
    .append("text")
      .datum(d => { return {name: d.name, value: d.values[0]}; })  // only keep first value
      .attr("transform",d => `translate(${xScale(d.value.year)},${yScale(d.value.gini)})`) // put text on that value
      .attr("x", -42) // shift label to the left so it doesn't cross the lines 
      .text(d => d.name)
      .style("fill", d => CatColor(d.name))
      .style("font-size", 15)

});