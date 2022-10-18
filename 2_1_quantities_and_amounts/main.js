/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8;
const height = 250;

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
.then(data => {
  console.log("data", data)

  /* SCALES */
  // yscale - categorical, activity
  const yScale = d3.scaleBand()
    .domain(data.map(d=> d.activity))
    .range([0, (height*0.95)]) // visual variable
    .paddingInner(0.3)
    .paddingOuter(1)

  // xscale - linear,count
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d=> d.count)])
    .range([0, (width*0.95)])

  /* HTML ELEMENTS */
  // svg container
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
  
  // inner SVG to prevent overlap with axis, does this mess up the axis accuracy?
  const innerSVG = svg.append("svg")
    .attr("width", width*0.95)
    .attr("height", height*0.95)

  // axis labels, modified from https://d3-graph-gallery.com/graph/barplot_horizontal.html 
  // x axis
  svg.append("g")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)") // puts x axis labels at 45 deg angle
      .style("text-anchor","end")
  // y axis
  svg.append("g")
    .call(d3.axisLeft(yScale))

  // add bars as rect
  const bars = innerSVG.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", d=> xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("x", xScale(0))
    .attr("y", d=> yScale(d.activity))
    .attr("fill", "#00ffff") // aqua color

  /* add labels, modified from https://stackoverflow.com/questions/37723541/how-to-append-text-to-a-line-in-d3-js 
  svg.selectAll("text.barLabels")
    .data(data)
    .append("text")
    .attr("class","barLabels")
    .attr("text-anchor","middle")
    //.attr("y", d=>bars.height)
    //.attr("x", 10)
    //.text("hello") //d=>d.activity
  */  
})