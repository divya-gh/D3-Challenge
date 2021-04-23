//Set SVG height and width inside the div container with id '#satter'
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 30
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 900 500")
  .classed("chart", true); ;

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Read data file data.csv
d3.csv("assets/data/data.csv").then(function(censusData) {

    //print data
    console.log('Actual Data:' , censusData)

        // parse data
        censusData.forEach(function(data) {
            data.poverty = +data.poverty ;
            data.age = +data.age ;
            data.income = +data.income ;
            data.healthcare = +data.healthcare ;
            data.obesity = +data.obesity ;
            data.smokes = +data.smokes ;    
    });

    //print parsed data
    console.log('parsed data:' , censusData)

    ///////////////////////////////////////////////////////////////////////////////////////
    // create X and Y scales
    ///////////////////////////////////////////////////////////////////////////////////////

    //X scale
    var xTimeScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) , d3.max(censusData, d => d.poverty)])
    .range([0, chartWidth]);

    //print min and max values for xscale
    console.log('xscale Min and Max:' , d3.min(censusData, d => d.poverty)  , d3.max(censusData, d => d.poverty) )
    
    //Y scale
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare)  , d3.max(censusData, d => d.healthcare)])
    .range([chartHeight, 0]);

    //print min and max values for yscale
    console.log('yscale Min and Max:' , d3.min(censusData, d => d.healthcare)  , d3.max(censusData, d => d.healthcare) )
   
    ///////////////////////////////////////////////////////////////////////////////////////////
    //Create and Append Axes
    ///////////////////////////////////////////////////////////////////////////////////////////

    // create axes
    var xAxis = d3.axisBottom(xTimeScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);
  
});