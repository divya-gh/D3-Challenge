//=============================================================================//
// STEP 1:  - Set SVG width and Height 
//          - Set margins for the chart area
//          - Calculate chart area (chartWidth and ChartHeight)
//============================================================================//

//Step 1 : Set SVG height and width inside the div container with id '#satter'
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 50
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//==================================================================//
//STEP 2:   - Create an SVG wrapper, append an SVG group that will hold our chart,
//            and shift the latter by left and top margins.
//           - To make the svg-area responsive (use property 'viewBox')
//=================================================================//

//
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 900 500")
  .classed("chart", true); ;

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//==================================================================//
//STEP 3:   - Use d3.csv promise function to get data from data.csv file 
//          - Parse data to convert string values to numbers
//          - print to check
//=================================================================//
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

  //==================================================================//
  //STEP 4:   - Create X and Y scales
  //=================================================================//
    
    //X scale
    var xScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) -0.9 , d3.max(censusData, d => d.poverty) +1])
    .range([0, chartWidth]);

    //print min and max values for xscale
    console.log('xscale Min and Max:' , d3.min(censusData, d => d.poverty)  , d3.max(censusData, d => d.poverty) )
    
    //Y scale
    var yScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.healthcare)-1 , d3.max(censusData, d => d.healthcare) +2])
    .range([chartHeight, 0]);

    //print min and max values for yscale
    console.log('yscale Min and Max:' , d3.min(censusData, d => d.healthcare)  , d3.max(censusData, d => d.healthcare) )
   
    //==================================================================//
    //STEP 5:   - Create and append Axes
    //=================================================================//

    // create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // append axes
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);
  

  // ================================================================// 
  // Step 6:   - Create Circles to generate a scatter plot
  //           - Bind data to all the groups and append circles and text
  //           - Hint: https://stackoverflow.com/questions/12266967/d3-js-how-to-add-labels-to-scatter-points-on-graph
  //           - text element can not be added to circles . Create groups and add 2 elements on the same point.
  // ===============================================================//
  
  //Create groups and bind data
  var circlesGroup = chartGroup.selectAll("g")
    .data(censusData)
    .enter()
    .append('g')
    
  //append circles to each group 
    circlesGroup.append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "16")
    .attr("class", "stateCircle")
    .attr("opacity", ".8")


    //append text to each group 
    circlesGroup.append("text")
                .text(d => `${d.abbr}`)
                .attr("x", function (d) {
                  return xScale(d.poverty);
              })
              .attr("y", function (d) {
                  return (yScale(d.healthcare)+6);
              }).attr("class", "stateText")
            

// ================================================================// 
// Step 7:    - Create X and Y titles
//            - Append text elements to chart group
// ===============================================================//
  
// Create X title
chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top -5})`)
    .classed("atext", true)
    .text("In Poverty (%)");

//Create Y title
chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left )
      .attr("x", 0 - (chartHeight / 2 + 50))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

});