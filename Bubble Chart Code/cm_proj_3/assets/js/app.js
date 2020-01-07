//setting up the chart dimensions

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;
//append to visualization_3 NOTE NEED TO CHANGE WHEN COMBINING
var svg = d3.select("#visualization_3")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//NOTE NEED TO CHANGE FEEDING IN BY CSV FOR NOW WHILE WAITING FOR SQLITE
d3.csv("./assets/data/data.csv").then(function(financeData) {
  //created to read the date 
  var parseDate = d3.timeParse("%m/%d/%Y"); 
  
  // Set initial param to be updated by reference to menus
  var initialTicker = "16"
   // Create filter to target selected ticker
  financeData = financeData.filter(function(data) {
    return data["Category Number"] == initialTicker;
  });

//unpacked all data that was relevant. note that the category number had a space in the header so it is slightly different
  financeData.forEach(function(data) {
    data.category_number = +data["Category Number"];
    data.date = parseDate(data.Date);
    data.value = +data.Value;
    data.volume = +data.Volume;
  });
//x scale from min to max date
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(financeData, d => d.date), d3.max(financeData, d => d.date)])
      .range([0, chartWidth]);
    //y scale a bit higher than max value to account for large bubbles at the top of the chart going out of frame
    var yLinearScale = d3.scaleLinear()
      .domain([-50, d3.max(financeData, d => d.value)*1.1])
      .range([chartHeight, 0]);
    
    //generating axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
//change the format to date 
    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis.tickFormat(d3.timeFormat("%m/%d/%Y")));

    chartGroup.append("g")
      .call(leftAxis);

//right now is just 1 ticker. r is to make sure the graph is readable
    var financialGroup = chartGroup.selectAll("circle")
    .data(financeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.date))
    .attr("cy", d => yLinearScale(d.value))
    .attr("r", d => (d.Volume)/6000000)
    .attr("fill", "blue")
    .attr("opacity", ".1");

    chartGroup.append("text")
      .attr(`transform`, `rotate(-90)`)
      .attr("y", 0 - margin.left + 5)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Value of Ticker ($)");

    chartGroup.append("text")
      .attr(`transform`, `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Date");
  


    var legend_keys = ["Selected Ticker's Volume"]
    var color_key = ["blue"]
  
    var lineLegend = chartGroup.selectAll(".lineLegend").data(legend_keys)
      .enter().append("g")
      .attr("class","lineLegend")
      .attr("transform", function (d,i) {
        return "translate(" + chartWidth / 1.3 + "," + (chartHeight - 20 - (i*20)) +")";
      });
  
    lineLegend.append("text").text(function (d) {return d;})
      .attr("transform", "translate(15,9)"); //align texts with boxes
  
    lineLegend.append("circle")
      .attr("fill", function (d, i) {return color_key[i]; })
      .attr("r", 9);

    }).catch(function(error) {
    console.log(error);
  });
