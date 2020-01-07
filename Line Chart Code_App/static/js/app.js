//function makeResponsive() {

// ----------- General constants -----------

const colorList = [
    '#FFB300', // Vivid Yellow
    '#803E75', // Strong Purple
    '#FF6800', // Vivid Orange
    '#A6BDD7', // Very Light Blue
    '#C10020', // Vivid Red
    '#CEA262', // Grayish Yellow
    '#817066', // Medium Gray
    '#007D34', // Vivid Green
    '#F6768E', // Strong Purplish Pink
    '#00538A', // Strong Blue
    '#FF7A5C', // Strong Yellowish Pink
    '#53377A', // Strong Violet
    '#FF8E00', // Vivid Orange Yellow
    '#B32851', // Strong Purplish Red
    '0#4C800', // Vivid Greenish Yellow
    '#7F180D', // Strong Reddish Brown
    '#93AA00', // Vivid Yellowish Green
    '#593315', // Deep Yellowish Brown
    '#F13A13', // Vivid Reddish Orange
    '#232C16'  // Dark Olive Green
    ];

// Pull these values from database
const tickersList = [
// FRED
	'US Housing Starts',
	'US Case Shiller Home Price Index',
	'US Consumer Price Index',
	'US Unemployment Rate',
// Tickers	
	'Materials /XLB/',
	'Communication Services /XLC/',
	'Energy /XLE/',
	'Financials /XLF/',
	'Industrials /XLI/',
	'Technology /XLK/',
	'Consumer Staples /XLP/',
	'Real Estate /XLRE/',
	'Utilities /XLU/',
	'Health Care /XLV/',
	'Consumer Discretionary /XLY/',
	'S&P 500 /SPY/'
];


  // Define SVG area dimensions
  const svgWidth = window.innerWidth - 50;
  const svgHeight = window.innerHeight / 1.8;

  // Define the chart's margins as an object
  const margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };

  // Define dimensions of the chart area
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  // Configure a parseTime function which will return a new Date object from a string
  var parseDate = d3.timeParse("%m/%d/%Y");

  // references to charts
  var chartGroups = {};

function initPage(){
	// dropdown menus
	$('#ticker-checkboxes').multiselect({
		nonSelectedText: 'Select Ticker',
		onChange: function(option, checked, select) {
			let idx = $(option).val();
			let lineExists = d3.select("#tickerLine" + idx)._groups[0][0] !== null;
			if(lineExists){
				d3.select("#tickerLine" + idx).style("opacity", +checked);
			}else if(checked){
				createTickerChartLine(idx);
			}
			createViz1Legend();
		}
	});
	let tickerOptions = [];
	for(let i = 5; i <= 16; i++){
		tickerOptions.push({label: tickersList[i-1], title: tickersList[i-1], value: i});
	}
	$('#ticker-checkboxes').multiselect('dataprovider', tickerOptions);
	$('#fred-checkboxes').multiselect({
		nonSelectedText: 'Select Indicator',
		<!-- includeSelectAllOption: true, -->
		onChange: function(option, checked, select) {
			let idx = $(option).val();
			let lineExists = d3.select("#fredLine" + idx)._groups[0][0] !== null;
			if(lineExists){
				d3.select("#fredLine" + idx).style("opacity", +checked);
			}else if(checked){
				createFredChartLine(idx);
			}
			createViz1Legend();
		},
		<!-- onSelectAll: function() { -->
			<!-- alert('onSelectAll triggered!'); -->
		<!-- }, -->
		<!-- onDeselectAll: function() { -->
			<!-- alert('onDeselectAll triggered!'); -->
		<!-- } -->
	});
	let fredOptions = [];
	for(let i = 1; i <= 4; i++){
		fredOptions.push({label: tickersList[i-1], title: tickersList[i-1], value: i});
	}
	$('#fred-checkboxes').multiselect('dataprovider', fredOptions);

	$('#x-checkboxes').multiselect({
		// nonSelectedText: 'Select X Ticker',
		onChange: function(option, checked, select) {
			// let idx = $(option).val();
			createChart2();
		}
	});
	let xOptions = [];
	for(let i = 5; i <= 16; i++){
		xOptions.push({label: tickersList[i-1], title: tickersList[i-1], value: i});
	}
	$('#x-checkboxes').multiselect('dataprovider', xOptions);
	$('#y-checkboxes').multiselect({
		// nonSelectedText: 'Select Y Ticker',
		onChange: function(option, checked, select) {
			// let idx = $(option).val();
			createChart2();
		}
	});
	let yOptions = [];
	for(let i = 1; i <= 4; i++){
		yOptions.push({label: tickersList[i-1], title: tickersList[i-1], value: i});
	}
	$('#y-checkboxes').multiselect('dataprovider', yOptions);
	$('#snp-checkboxes').multiselect({
		// nonSelectedText: 'Select Y Ticker',
		onChange: function(option, checked, select) {
			// let idx = $(option).val();
			createChart3();
		}
	});
	let snpOptions = [];
	for(let i = 5; i <= 16; i++){
		snpOptions.push({label: tickersList[i-1], title: tickersList[i-1], value: i});
	}
	$('#snp-checkboxes').multiselect('dataprovider', snpOptions);

	// if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
	const svgArea = d3.select("body").select("svg");

	  // clear svg is not empty
	  if (!svgArea.empty()) { svgArea.remove(); }

	// create charts
	chartGroups.chart1 = createChartBase('visualization_1', "FRED vs. Selected S&P Sectors", "Date", "Ratio of Value to Max Value");

	createChart2(5,1);

	createChart3();
	
	// Preselect some values
	$('#fred-checkboxes').multiselect('select', [1, 2, 3, 4]);
	createFredChartLine(1);
	createFredChartLine(2);
	createFredChartLine(3);
	createFredChartLine(4);
	$('#ticker-checkboxes').multiselect('select', ['5']);
	createTickerChartLine(5);

	// Update legend
	createViz1Legend();
}

function createChartBase(elId, title, xText, yText){
	
  // Append SVG area to element, and set its dimensions
  let svg = d3.select("#" + elId).append("svg").attr("width", svgWidth).attr("height", svgHeight);

  // Append a group area, then set its margins
  let chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Create Title 
  svg.append("text").attr("x", (svgWidth / 2)).attr("y", (margin.top / 2))
    .attr("text-anchor", "middle")  
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
    .text(title);

  //Create X axis label   
  // svg.append("text")
    // .attr("x", svgWidth / 2 )
    // .attr("y",  svgHeight - 18)
    // .style("text-anchor", "middle")
    // .text(xText);

  //Create Y axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - (svgHeight / 2))
    .attr("y", svgWidth / 90)
    //.attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yText);  

  return chartGroup;
}

  // Load data from tickerData.csv
  // ************************THIS LOADS THE TICKER DATA****************************
function createTickerChartLine(idx){
	d3.json('/Tickerdata/' + idx).then(function(tickerData) {
    
		// Create filter to remove #N/A
		// tickerData = tickerData.filter(function(ticker) {
		  // return ticker.Value_to_Max_Value_Ratio != "#N/A"
		// })
		
		// Format the date and cast the respective values as needed
		tickerData.forEach(function(data) {
		  data.date = parseDate(data.date);
		  data.Value_to_Max_Value_Ratio = +data.Value_to_Max_Value_Ratio;
		  //data.category_Number = data.category_Number;
		  //data.number = +data.number;
		});

		// Configure a time scale with a range between 0 and the chartWidth
		// Set the domain for the xTimeScale function
		// d3.extent returns the an array containing the min and max values for the property specified
		var xTimeScale = d3.scaleTime().range([0, chartWidth]).domain(d3.extent(tickerData, data => data.date));

		// Configure a linear scale with a range between the chartHeight and 0
		// Set the domain for the xLinearScale function
		var yLinearScale = d3.scaleLinear().range([chartHeight, 0]).domain([0, d3.max(tickerData, data => data.Value_to_Max_Value_Ratio)]);

		// Configure a drawLine function which will use our scales to plot the line's points
		var drawLine = d3.line().x(data => xTimeScale(data.date)).y(data => yLinearScale(data.Value_to_Max_Value_Ratio));

		// Append an SVG path and plot its points using the line function
		chartGroups.chart1.append("path")
		  // The drawLine function returns the instructions for creating the line for milesData
		  .attr("d", drawLine(tickerData)).attr("id", "tickerLine" + idx)
		  //.attr("data-legend",function(tickerData) { return tickerData.category_Number})
		  .classed("trendline", true).attr('stroke', colorList[idx]);

		createViz1Axis(xTimeScale);

		// // Create the tooltip in chartGroup.
		// chartGroup.call(toolTip);

		// // Create "mouseover" event listener to display tooltip
		// chartGroup.on("mouseover", function(d) {
		//   toolTip.show(d, this);
		// })
		// // Create "mouseout" event listener to hide tooltip
		// .on("mouseout", function(d) {
		//   toolTip.hide(d);
		// });

	  }).catch(function(error) {
		console.log(error);
	  });
}

// global variable
var hasAxis = false;

function createViz1Axis(xTimeScale){

	if(hasAxis) return;
	hasAxis = true;

    var bottomAxis = d3.axisBottom(xTimeScale);
    var yAxisScale = d3.scaleLinear().range([chartHeight, 0]).domain([0, 1])
    var leftAxis = d3.axisLeft(yAxisScale);
    chartGroups.chart1.append("g").classed("axis", true).call(leftAxis);
    chartGroups.chart1.append("g").classed("axis", true).attr("transform", "translate(0, " + chartHeight + ")").call(bottomAxis);
}	

function createViz1Legend(){

	// legend
    let legend_keys = [];

	let selectedOptions = $('#fred-checkboxes option:selected');
	for(let i = 0; i < selectedOptions.length; i++){
		legend_keys.unshift(tickersList[selectedOptions[i].value-1]);
	}	
	selectedOptions = $('#ticker-checkboxes option:selected');
	for(let i = 0; i < selectedOptions.length; i++){
		legend_keys.unshift(tickersList[selectedOptions[i].value-1]);
	}	

	// remove all lengend entries
	chartGroups.chart1.selectAll(".lineLegend").remove();

    let lineLegend = chartGroups.chart1.selectAll(".lineLegend").data(legend_keys).enter().append("g").attr("id",function(d,i){return "lineLegend" + i;}).attr("class", "lineLegend")
	.attr("transform", function (d,i) {return "translate(" + chartWidth / 1.15 + "," + (chartHeight - 15 - (i*20)) +")"; });

    lineLegend.append("text").text(function (d) {return d;}).attr("transform", "translate(15,9)"); //align texts with boxes
    lineLegend.append("rect").attr("fill", function (d, i) {return colorList[i]; }).attr("width", 10).attr("height", 10);
}

  // Get FRED data and put it into plot
function createFredChartLine(idx){
	d3.json('/FREDdata/' + idx).then(function(fredData) {

	// Remove #N/A
	fredData = fredData.filter(function(fred) { return fred.max_value != "#N/A" });

	// Format the date and cast values
	fredData.forEach(function(data) {
	  data.date = parseDate(data.date);
	  data.max_value = +data.max_value;
	});
	let xTimeScale = d3.scaleTime().range([0, chartWidth]).domain(d3.extent(fredData, data => data.date));
	let yLinearScale = d3.scaleLinear().range([chartHeight, 0]).domain([0, d3.max(fredData, data => data.max_value)]);
	let drawLine = d3.line().x(data => xTimeScale(data.date)).y(data => yLinearScale(data.max_value)).curve(d3.curveMonotoneX);
	chartGroups.chart1.append("path").attr("d", drawLine(fredData)).classed("trendline", true).attr("id", "fredLine" + idx).attr('stroke', colorList[idx]);

	}).catch(function(error) {
	console.log(error);
	});
}

function createChart3(){
	
		// clear svg is not empty
	const svgArea3 = d3.select("#visualization_3").select("svg");
	if (!svgArea3.empty()) { svgArea3.remove(); }

	let snpIdx = $('#snp-checkboxes').multiselect().val();

    chartGroups.chart3 = createChartBase('visualization_3', '', 'Value of Ticker ($)', 'Value of Ticker ($)');

    d3.json("/Tickerdata/" + snpIdx).then((function(financeData) {
    //created to read the date 

    //unpacked all data that was relevant. note that the category number had a space in the header so it is slightly different
    financeData.forEach(function(data) {
      data.number = +data.number;
      data.date = parseDate(data.date);
      data.value = +data.value;
      data.volume = +data.volume;
    });

    //x scale from min to max date
    var xLinearScale = d3.scaleLinear().domain([d3.min(financeData, d => d.date), d3.max(financeData, d => d.date)]).range([0, chartWidth]);
    //y scale a bit higher than max value to account for large bubbles at the top of the chart going out of frame
    var yLinearScale = d3.scaleLinear().domain([-50, d3.max(financeData, d => d.value)*1.1]).range([chartHeight, 0]);
    
    //generating axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    //change the format to date 
    chartGroups.chart3.append("g").attr("transform", `translate(0, ${chartHeight})`).call(bottomAxis.tickFormat(d3.timeFormat("%m/%d/%Y")));

    chartGroups.chart3.append("g").call(leftAxis);

    //right now is just 1 ticker. r is to make sure the graph is readable
    var financialGroup = chartGroups.chart3 .selectAll("circle")
    .data(financeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.date))
    .attr("cy", d => yLinearScale(d.value))
    .attr("r", d => (d.volume)/6000000)
    .attr("fill", "blue")
    .attr("opacity", ".1");

    var legend_keys = ["Selected Ticker's Volume"]
    var color_key = ["blue"]

    var lineLegend = chartGroups.chart3 .selectAll(".lineLegend").data(legend_keys)
      .enter().append("g")
      .attr("class","lineLegend")
      .attr("transform", function (d,i) {
        return "translate(" + chartWidth / 1.3 + "," + (chartHeight - 20 * (1 + i)) +")";
      });

    lineLegend.append("text").text(function (d) {return d;}).attr("transform", "translate(15,9)"); //align texts with boxes

    lineLegend.append("circle").attr("fill", function (d, i) {return color_key[i]; }).attr("r", 9);

   }))//.catch(function(error) {
   //   console.log(error);
   // })
}

function createChart2(){
	
	// clear svg is not empty
	const svgArea = d3.select("#visualization_2").select("svg");
	if (!svgArea.empty()) { svgArea.remove(); }
	
	var svg = d3.select("#visualization_2").append("svg").attr("width", svgWidth).attr("height", svgHeight);

	chartGroups.chart2 = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

	let xIdx = $('#x-checkboxes').multiselect().val();
	let yIdx = $('#y-checkboxes').multiselect().val();

//console.log(xIdx, yIdx);

	d3.json('/Mchanges').then(function(data) {
	 
	 // Create bins to hold desired data
	  var fred = [];
	  var mchange = [];

	  let tick = ['xlb', 'xlc', 'xle', 'xlf', 'xli', 'xlk', 'xlp', 'xlre', 'xlu', 'xlv', 'xly', 'spy'][xIdx-5];
	  let pctTick = tick + '_percentage_diff';

      // Get spider data
	  data.forEach((data) => {
		Object.entries(data).forEach(([key, value]) => {
		  if (key === pctTick) {
			mchange.push(value);
		  }
		})
	  });

      // Get FRED data
	  d3.json('/FREDdata/' + yIdx).then(function(fredData) {
		var spy_percentage_diff = 'spy_percentage_diff';
		
	    // //unpacked all data that was relevant. note that the category number had a space in the header so it is slightly different
		fredData.forEach(function(data) {
		  data.change_pct = +data.change_pct;
		  fred.push(data.change_pct);
		});
		
	   //x scale from min to max date
	  var xLinearScale = d3.scaleLinear().domain([d3.min(fredData, d => d.change_pct), d3.max(fredData, d => d.change_pct)]).range([0, chartWidth]);
	 //y scale a bit higher than max value to account for large bubbles at the top of the chart going out of frame
	  var yLinearScale = d3.scaleLinear().domain([d3.min(mchange) * 1.5, d3.max(mchange) * 1.5]).range([chartHeight, 0]);

	  // Combine the data
		combined = []
		for (var i = 0; i < Math.min(mchange.length, fredData.length); i++) {
		  combined.push({ "mchange": mchange[i], "fred": fred[i] });
		}

	//generating axes
	  var bottomAxis = d3.axisBottom(xLinearScale);
	  var leftAxis = d3.axisLeft(yLinearScale);
	//change the format to date 

	  chartGroups.chart2.append("g").call(leftAxis).attr(`transform`, `translate(${chartWidth / 2})`);
	  chartGroups.chart2.append("g").call(bottomAxis).attr(`transform`, `translate(0, ${svgHeight / 2} )`);

	  //right now is just 1 ticker. r is to make sure the graph is readable
	  var chart2Cirlces = chartGroups.chart2.selectAll("circle")
	  .data(combined)
	  .enter()
	  .append("circle")
	  .attr("cx", d => xLinearScale(d.mchange))
	  .attr("cy", d => yLinearScale(d.fred))
	  .attr("r", 3)
	  .attr("fill", "blue");
	  })
	})
}
  // When the browser loads, makeResponsive() is called.
//makeResponsive();

// When the browser window is resized, makeResponsive() is called.
//d3.select(window).on("resize", makeResponsive);

