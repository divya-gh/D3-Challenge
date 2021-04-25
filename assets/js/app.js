//=============================================================================//
// STEP 1:  - Set SVG width and Height 
//          - Set margins for the chart area
//          - Calculate chart area (chartWidth and ChartHeight)
//============================================================================//

//Step 1 : Set SVG height and width inside the div container with id '#satter'
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 40,
  right: 40,
  bottom: 100,
  left: 100
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
  .attr("viewBox", "0 0 960 600")
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

  //Set default x and y values
    var xValue = "poverty" ;
    var yValue = "healthcare" ;

    // Call the function to calculate xScale and YScale for default x and y values
    xyScales = createScales(censusData, xValue, yValue) ;

    //Get Xscale and YScale
    xScale = xyScales[0];
    yScale = xyScales[1];
    
    
    //==================================================================//
    //STEP 5:   - Create and append Axes
    //=================================================================//

    // create axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // append axes
    var xGroup = chartGroup.append("g").classed("xaxis", "true")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    var yGroup = chartGroup.append("g").classed("yaxis", "true")
      .call(yAxis);
  

  // ================================================================// 
  // Step 6:   - Create Circles to generate a scatter plot
  //           - Bind data to all the groups and append circles and text
  //           - Hint: https://stackoverflow.com/questions/12266967/d3-js-how-to-add-labels-to-scatter-points-on-graph
  //           - text element can not be added to circles . Create groups and add 2 elements on the same point.
  // ===============================================================//
  
  //Create groups and bind data
  var circlesGroup = chartGroup.selectAll(".gr")
    .data(censusData)
    .enter()
    .append('g')
    .classed("gr" , true)
    
  //append circles to each group 
    circlesGroup.append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "15")
    .attr("class", "stateCircle")
    .attr("opacity", ".8")


    //append text to each group 
    circlesGroup.append("text")
                .text(d => `${d.abbr}`)
                .attr("x", function (d) {
                  return xScale(d.poverty);
              })
              .attr("y", function (d) {
                  return (yScale(d.healthcare)+5);
              }).attr("class", "stateText")
            

// ================================================================// 
// Step 7:    - Create a group for axis labels
//            - Create X and Y titles
//            - Append text elements to chart group
// ===============================================================//
  
// Create X title
chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top -5})`)
    .classed("aText xtitle", true)
    .text("In Poverty (%)");

//Create Y title
chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left +60)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "ytitle aText")
      .text("Lacks Healthcare (%)");

//=====================================================================//
// Bonus: More Data, More Dynamics

// Step 8: - Add more labels to X and Y
// ===============================================================//


// Create X title
//-----------------//
//1: Add Age(Median) to X axis
chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 18})`)
    .classed("xtitle aText inactive inactive:hover", true)
    .text("Age (Median)")

//2: Add Household Income(Median) to X axis
chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 40})`)
    .classed("xtitle aText inactive inactive:hover", true)
    .text("Household Income (Median)")

// Create Y title
//----------------//

//1: Add Smokes(%) to Y axis
chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "ytitle aText inactive inactive:hover")
      .text("Smokes (%)");

//2: Add Obese(%) to Y axis
chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left +20)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "ytitle aText inactive inactive:hover")
      .text("Obese (%)");

 //=====================================================================//
// Step 9:    - Create charts based on the selection of tiles on X and Y axis
//            - For all the text elements with class .aText, find their values when clicked
//            - Use lacks Healthcare and Pverty as default titles
//            - update the domain of xscale and yscale based on the title
// ===============================================================//     
      
    //create a function to handle events
    chartGroup.selectAll(".aText")
      .on("click", function() {

        // get value of the selection
          var value = d3.select(this).text();      
          console.log(`Value of clicked title : ${value}`)

          //call function createXY to slect x and y values based on selection
          var xyValue = createXY(value, xValue, yValue) ;

          xValue = xyValue[0] ;
          yValue = xyValue[1] ;

          //print 
          console.log(`XValue : ${xValue} \n YValue : ${yValue}`)

          //change the domain of x and y scale
          //==================================//
          if(value === 'In Poverty (%)' || value === 'Age (Median)' || value === 'Household Income (Median)'){
              //calculate i for scaling - call function calcI
              var iMinMAx = calcI(value) ;

              //update xscale- domain        
              xScale.domain([d3.min(censusData, d => d[xValue]) - iMinMAx[0] , d3.max(censusData, d => d[xValue]) + iMinMAx[1]])
              console.log('New xScale Min and Max:' , d3.min(censusData, d => d[xValue]) , d3.max(censusData, d => d[xValue]))
          }
          else {
              //calculate i for scaling - call function calcI
              var jMinMAx = calcJ(value) ;

              //update yscale- domain  
              yScale.domain([d3.min(censusData, d => d[yValue])-jMinMAx[0] , d3.max(censusData, d => d[yValue]) + jMinMAx[1]])
              console.log('New yScale Min and Max:', d3.min(censusData, d => d[yValue]) , d3.max(censusData, d => d[yValue]))
              }
          
          
          // updates x axis with transition
          xGroup.transition().duration(500).call(d3.axisBottom(xScale))
          yGroup.transition().duration(500).call(d3.axisLeft(yScale)) 

          //make selected title active
          d3.select(this).classed('inactive inactive:hover', false)

          //update data or circles for x and y vlaues- create a scatter plot          
          circlesGroup.selectAll("circle")
                      .transition()
                      .duration(500)
                      .attr("cx", d => xScale(d[xValue]))
                      .attr("cy", d => yScale(d[yValue]))

          
          //update text(abbr) based on the selection
          circlesGroup.selectAll("text")
                      .transition()
                      .duration(100)
                      .attr("x", d => xScale(d[xValue]))
                      .attr("y", d => yScale(d[yValue])+3)
                      
        
      });

  //=====================================================================//
  // Bonus 2:  Incorporate d3-tip
  // Step 10:    - Initialize tool tip
  //             - set values to to circles
  // ===============================================================//
  
    // Step 10: Initialize tool tip
    var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([20, 60])
                    .html( d => `${d.state}<br>${xValue}: ${d[xValue]}%<br>${yValue}: ${d[yValue]}%`);
    
    //Create tooltip in the chart
    chartGroup.call(toolTip);

    //Event listeners to display and hide the tooltip
    //On mouseover,
    chartGroup.selectAll('g').on("mouseover", d => toolTip.show(d, this))
    // onmouseout,
                .on("mouseout", d => toolTip.hide(d)) ;
});


//=======================================================================================//
// Function to create XScale and YScale
//======================================================================================//

function createScales(censusData, xValue, yValue) {
      //X scale
      var xScale = d3.scaleLinear()
                     .domain([d3.min(censusData, d => d[xValue]) -1 , d3.max(censusData, d => d[xValue]) +2])
                     .range([0, chartWidth]);

      //print min and max values for xscale
      console.log('xscale Min and Max:' , d3.min(censusData, d => d[xValue])  , d3.max(censusData, d => d[xValue]) )

      //Y scale
      var yScale = d3.scaleLinear()
                     .domain([d3.min(censusData, d => d[yValue])-1 , d3.max(censusData, d => d[yValue]) +3])
                     .range([chartHeight, 0]);

      //print min and max values for yscale
      console.log('yscale Min and Max:' , d3.min(censusData, d => d[yValue])  , d3.max(censusData, d => d[yValue]) )
      
      return [xScale, yScale]
}


//=======================================================================================//
// Function to select X and Y value to create scales
//======================================================================================//

function  createXY(value,xValue, yValue){
  //set default values 
  
  if(value === 'In Poverty (%)') {
    xValue = 'poverty' ;

    // Make the title inactive if not selected
    chartGroup.selectAll(".xtitle").classed('inactive inactive:hover', true)

  }
  else if(value === 'Age (Median)') {
    xValue = 'age' ;
    // Make the title inactive if not selected
    chartGroup.selectAll(".xtitle").classed('inactive inactive:hover', true)        
          }
  else if(value === 'Household Income (Median)') {
    xValue = 'income' ;
    // Make the title inactive if not selected
    chartGroup.selectAll(".xtitle").classed('inactive inactive:hover', true)
              }
  else if(value === 'Lacks Healthcare (%)') {
    yValue = 'healthcare' ;
    // Make the title inactive if not selected
    chartGroup.selectAll(".ytitle").classed('inactive inactive:hover', true)
          }
  else if(value === 'Smokes (%)') {
    yValue = 'smokes' ;
    // Make the title inactive if not selected
    chartGroup.selectAll(".ytitle").classed('inactive inactive:hover', true)
          }  
  else if(value === 'Obese (%)') {
    yValue = 'obesity' ;
    // Make the title inactive if not selected
    chartGroup.selectAll(".ytitle").classed('inactive inactive:hover', true)
          }  

  return [xValue , yValue] ;
}

//=======================================================================================//
// Function to i for x scaling
//======================================================================================//

function calcI(value){

  var iMin = 0 ;
  var iMax = 0;

  if(value === 'Age (Median)') {
    iMin= 3.5 ;
    iMax = 5 ;
  }
  else if(value === 'Household Income (Median)') {
    iMin =  3000;
    iMax = 9000 ;
  }
  else {
    iMin= 1 ;
    iMax = 2
  }
  return [iMin, iMax] ;
}

//=======================================================================================//
// Function to j for y scaling
//======================================================================================//

function calcJ(value){

  var jMin = 0 ;
  var jMax = 0;

  if(value === 'Smokes (%)') {
    jMin= 1.5 ;
    jMax = 3 ;
  }
  else if(value === 'Obese (%)') {
    jMin = 3;
    jMax = 4 ;
  }
  else {
    jMin= 1 ;
    jMax = 3
  }
  return [jMin, jMax] ;
}