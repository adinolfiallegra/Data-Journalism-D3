
// D3 Scatter plot
console.log("app.js")
var svgWidth = 960;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
.select(".chart")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// Append an SVG group
var chart = svg.append("g");
// Append a div to the bodyj to create tooltips, assign it a class
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// import csv data
d3.csv('data/data.csv', function(error, data){
    if (error) throw error;
    console.log('data')
    data.forEach(function(data){
        data.TeethRemoved = +data.TeethRemoved;
        data.BachelorHigher = +data.BachelorHigher;
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

// Create axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

  // These variables store the minimum and maximum values in a column in data.csv
  var xMin;
  var xMax;
  var yMax;
  var yMin;

  function findMinAndMax(dataColumnX, dataColumnY) {
    xMin = d3.min(data, function(data) {
    return +data[dataColumnX] * 0.8;
    });

    xMax = d3.max(data, function(data) {
    return +data[dataColumnX] * 1.1;
    });

    yMin = d3.min(data, function(data) {
    return +data[dataColumnY] * 0.8;
    });

    yMax = d3.max(data, function(data) {
    return +data[dataColumnY] * 1.1;
    });
}
var currentAxisLabelX = "BachelorHigher";
var currentAxisLabelY = "TeethRemoved";

// Call findMinAndMax() with 'bachelorOrHigher' as default
findMinAndMax(currentAxisLabelX, currentAxisLabelY);

// Set the domain of an axis to extend from the min to the max value of the data column
xLinearScale.domain([xMin, xMax]);
yLinearScale.domain([yMin, yMax]);

// Initialize tooltip
var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    // Define position
    .offset([0, 0])
    // The html() method allows us to mix JavaScript with HTML in the callback function
    .html(function(data) {
    var states = data.Location;
    var valueX = +data[currentAxisLabelX];
    var valueY = +data[currentAxisLabelY];
    var stringX;
    var stringY;
    // Tooltip text depends on which axis is active/has been clicked
    if (currentAxisLabelX === "BachelorHigher") {
        stringX = "Bachelor: ";
        stringY = "No Teeth: ";
        }
        return states +
        "<br>" +
        stringX +
        valueX +
        "<br>" +
        stringY +
        valueY;
    });
    // Create tooltip
    chart.call(toolTip);
    
    // Create circle
    chart
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
        return xLinearScale(+data[currentAxisLabelX]);
        })
        .attr("cy", function(data, index) {
        return yLinearScale(+data[currentAxisLabelY]);
        })
        .attr("r", "18")
        .attr("fill", "lightblue")
        .attr("class", "circle")
        // display tooltip by d3-Tip
        .on('mouseover', toolTip.show)
        .on('mouseout', toolTip.hide);
    // Create abbrivation of states to show on the circle
    chart
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function(data, index) {
          return xLinearScale(+data[currentAxisLabelX]);
        })
        .attr("y", function(data, index) {
          return yLinearScale(+data[currentAxisLabelY]);
        })
        .attr("dx", "-0.65em")
        .attr("dy", "0.4em")
        .style("font-size", "13px")
        .style("fill", "white")
        .attr("class", "abbr")
        .text(function(data, index) {
          return data.Abbrevation;
        });

    chart
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        // The class name assigned here will be used for transition effects
        .attr("class", "x-axis")
        .call(bottomAxis);
    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 80)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .attr("class", "axis-text change")
        .attr("data-axis-name", "TeethRemoved")
        .attr("id", "TeethRemoved")
        .text("65+ with All Teeth Removed (%)");

    // Append x-axis labels
    chart
        .append("text")
        .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")"
        )
        // This axis label is active by default
        .attr("class", "axis-text active")
        .attr("data-axis-name", "BachelorHigher")
        .text("Education level: Bachelor or higher (%)");
        function labelChange(clickedAxis) {
            d3
            .selectAll(".axis-text")
            .filter(".active")
            // An alternative to .attr("class", <className>) method. Used to toggle classes.
            .classed("active", false)
            .classed("inactive", true);
    
            d3
            .selectAll(".axis-text")
            .filter(".change")
            .classed("change", false)
            .classed("unchange", true);
    
            clickedAxis.classed("inactive", false).classed("active", true);
            corrAxis.classed("unchange", false).classed("change", true);
        }
        d3.selectAll(".axis-text").on("click", function() {
            // Assign a variable to current axis
            var clickedSelection = d3.select(this);
            // "true" or "false" based on whether the axis is currently selected
            var isClickedSelectionInactive = clickedSelection.classed("inactive");
            
            // console.log("this axis is inactive", isClickedSelectionInactive)
            // Grab the data-attribute of the axis and assign it to a variable
            // e.g. if data-axis-name is "poverty," var clickedAxis = "poverty"
            var clickedAxis = clickedSelection.attr("data-axis-name");
 // The onclick events below take place only if the x-axis is inactive
        // Clicking on an already active axis will therefore do nothing
        if (isClickedSelectionInactive) {
            // Assign the clicked axis to the variable currentAxisLabelX
            currentAxisLabelX = clickedAxis;
            currentAxisLabelY = corrAxis.attr("data-axis-name");
            // Call findMinAndMax() to define the min and max domain values.
            findMinAndMax(currentAxisLabelX, currentAxisLabelY);
            // Set the domain for the x-axis
            xLinearScale.domain([xMin, xMax]);
            yLinearScale.domain([yMin, yMax]);
    
            // Create a transition effect for the x-axis
            svg
                .select(".x-axis")
                .transition()
                // .ease(d3.easeElastic)
                .duration(1800)
                .call(bottomAxis);
    
            // Create a transition effect for the y-axis
            svg
                .select(".y-axis")
                .transition()
                // .ease(d3.easeElastic)
                .duration(1800)
                .call(leftAxis);
    
            // Select all circles to create a transition effect, then relocate its location
            // based on the new axis that was selected/clicked
            d3.selectAll("circle").each(function() {
                d3
                .select(this)
                .transition()
                // .ease(d3.easeBounce)
                .attr("cx", function(data) {
                    return xLinearScale(+data[currentAxisLabelX]);
                })
                .attr("cy", function(data, index) {
                    return yLinearScale(+data[currentAxisLabelY]);
                })
                .duration(1800);
            });
    
            // Select all texts on circle to create a transition effect, then relocate its location
            // based on the new axis that was selected/clicked
            d3.selectAll(".Abbreviation").each(function() {
                d3
                .select(this)
                .transition()
                .attr("x", function(data) {
                    return xLinearScale(+data[currentAxisLabelX]);
                })
                .attr("y", function(data, index) {
                    return yLinearScale(+data[currentAxisLabelY]);
                })
                .duration(1800);
            });
            // Change the status of the axes. See above for more info on this function.
            labelChange(clickedSelection);
            }
        });
        });