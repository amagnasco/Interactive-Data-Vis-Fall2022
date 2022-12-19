/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  minRadius = 1;
  maxRadius = 10;

// columns:
// ID,OfficialViols,AEP,RepairCount,RepairCost,ClassB_count,ClassB,ClassC_count,ClassC,SumViols,ViolsDiff

// class C count vs repair count
// sized by repair cost
// color by AEP

/* LOAD DATA */
d3.csv("bg_anon.csv", d3.autoType).then(data => {
  console.log(data)

  /* SCALES */
  // xscale  - linear,count
  const xScale = d3.scaleSqrt() // was linear, changed to sqrt to zoom in the bottom left corner.
    .domain([0, d3.max(data.map(d => d.ClassC_count))])
    .range([margin.left, width - margin.right])
    .nice(); // cleans up the min/max

    // yscale - linear,count
  const yScale = d3.scaleSqrt() // idem
    .domain([0, d3.max(data, d => d.RepairCount)])
    .range([height - margin.bottom, margin.top])
    .nice(); // cleans up the min/max

  const colorScale = d3.scaleOrdinal()
    .domain([0,1])
    .range(["lightblue", "red"])

  const rScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.RepairCost)])
    .range([minRadius,maxRadius])

  /* HTML ELEMENTS */
  // svg
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // axis scales
  const xAxis = d3.axisBottom(xScale)
  svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(xAxis);
  
  const yAxis = d3.axisLeft(yScale)
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  /* MAKE IT GLOW */
  // from https://www.visualcinnamon.com/2016/06/glow-filter-d3-visualization/
  var defs = svg.append("defs"); // creates a container that defines the gradients
  var filter = defs.append("filter") // allows us to specify which SVG elements to glow
    .attr("id","glow");
  filter.append("feGaussianBlur") // apply a Gaussian blur to the element
    .attr("stdDeviation","3.5")
    .attr("result","coloredBlur");
  var feMerge = filter.append("feMerge"); 
  feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
  feMerge.append("feMergeNode") // puts the original element on top of the blurred one for the glow
    .attr("in","SourceGraphic");

  var toGlowOrNotToGlow = function(){
    if (d=1){return ["filter","url(#glow)"]}
    //else {return "url(#NoGlow)"};
  };

  // circles
  const dot = svg
    .selectAll("circle")
    .data(data, d => d.ID) // second argument is the unique key for that row
    .join("circle")
    .attr("cx", d => xScale(d.ClassC_count))
    .attr("cy", d => yScale(d.RepairCount))
    .attr("r", d => rScale(d.RepairCost))
    .attr("fill", d => colorScale(d.AEP))
    .style(d=> toGlowOrNotToGlow(d.AEP));

});