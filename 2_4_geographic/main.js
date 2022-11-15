/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };
  minRadius = 1
  maxRadius = 6

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/stateCapitals.csv", d3.autoType),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([
  geojson, 
  capitals,
  heatExtremes
]) => {

  console.log('geojson', geojson)
  console.log('capitals', capitals)
  console.log('heat extremes', heatExtremes)
  
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoAlbersUsa()
    .fitSize([width, height], geojson)

  const pathGen = d3.geoPath(projection)

  const colorScale = d3.scaleSequential(d3.interpolatePlasma)
  .domain([-15,15]) // should use min/max fns but chose these for aesthetic reasons

  const states = svg.selectAll("path.states")
    .data(geojson.features)
    .join("path")
    .attr("class", "states")
    .attr("d", coords => pathGen(coords))
    .attr("fill", "transparent")
    .attr("stroke", "black");

  const capitalCircles = svg.selectAll("circle.capital")
    .data(capitals)
    .join("circle")
    .attr("class", "capital")
    .attr("r", 2)
    .attr("fill", "black")
    .attr("transform", (d) => {
      const [x, y] = projection([d.longitude, d.latitude]);
      return `translate(${x}, ${y})`
    })

  const heatCircles = svg.selectAll("circle.heat")
    .data(heatExtremes)
    .join("circle")
    .attr("class", "heat")
    .attr("r", 5) // not using rScale
    .attr("fill", d => colorScale(d['Change in 95 percent Days']))
    .attr("transform", (d) => {
      const [x, y] = projection([d.Long, d.Lat]);
      return `translate(${x}, ${y})`
    })
});