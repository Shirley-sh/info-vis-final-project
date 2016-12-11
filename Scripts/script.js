//draw map
	var bikeColor = "#4C9CF2";
	var taxiColor= "#FFDF40";
	var googleMap;
	var height = 600;
	var width = 600;
	var maxLon, maxLat,minLon, minLat;
	var year = 2015;
	var month = 1;
	var day = 20;
	var selectingStart = true;
	var mouseSelectStartX = -73.9;
	var mouseSelectStartY = 40.75;
	var mouseSelectEndX = -73.9;
	var mouseSelectEndY = 40.75;
	var timeSelectBegin = new Date("2015-1-20");
	var timeSelectEnd = new Date("2015-1-21");
	var startROnMap = 0.2;
	var endROnMap = 0.2;
	var taxiData, bikeData;
	var timeline, brush, timeBegin, timeEnd;
	function initMap() {
		var googleMap = new google.maps.Map(document.getElementById('map'), {
			center: new google.maps.LatLng(40.75, -73.95),
			zoom:12,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			styles: [
				{
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#442222"
						}
					]
				},
				{
					"elementType": "labels.icon",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"color": "#212121"
						}
					]
				},
				{
					"featureType": "administrative",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#757575"
						},
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "administrative.country",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#9e9e9e"
						}
					]
				},
				{
					"featureType": "administrative.land_parcel",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "administrative.land_parcel",
					"elementType": "labels",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "administrative.locality",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#bdbdbd"
						}
					]
				},
				{
					"featureType": "poi",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "labels.text",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "poi",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#757575"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#181818"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#616161"
						}
					]
				},
				{
					"featureType": "poi.park",
					"elementType": "labels.text.stroke",
					"stylers": [
						{
							"color": "#1b1b1b"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "geometry.fill",
					"stylers": [
						{
							"color": "#774444"
						},
						{
							"weight": 1
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels.icon",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#8a8a8a"
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "labels",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "road.local",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#616161"
						}
					]
				},
				{
					"featureType": "transit",
					"stylers": [
						{
							"visibility": "off"
						}
					]
				},
				{
					"featureType": "transit",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#757575"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "geometry",
					"stylers": [
						{
							"color": "#665555"
						}
					]
				},
				{
					"featureType": "water",
					"elementType": "labels.text.fill",
					"stylers": [
						{
							"color": "#3d3d3d"
						}
					]
				}
			]
		});
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(new google.maps.LatLng(40.7, -74.0));//sw
		bounds.extend(new google.maps.LatLng(40.8, -73.9));//ne
		googleMap.fitBounds(bounds);
	}
	function loadScript() {
		var script = document.createElement('script');
		script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=initMap';
		document.body.appendChild(script);
	}

	//draw data
	d3.json("taxi_10000_bundled.json", loadBike);
	function loadBike(rawData) {
		taxiData = rawData;
		d3.json("bike_400_bundled.json", main);
	}

	function main(rawData) {
		bikeData = rawData;

		drawHistogram(taxiData,bikeData);

		 var margin = 0.05;
		 maxLat = 40.8+margin-0.025;
		 maxLon = -73.9+margin;
		 minLat = 40.75-margin-0.025;
		 minLon = -74.0-margin;

		scaleX = d3.scale.linear().domain([minLon,maxLon]).rangeRound([0,width]);
		scaleY = d3.scale.linear().domain([minLat,maxLat]).rangeRound([height,0]);
		var container = d3.select("#data").append("svg")
				.attr("width",width)
				.attr("height",height);

		var taxiCurves = container.append("g").attr("id","taxi-curves");
		var bikeCurves = container.append("g").attr("id","bike-curves");

		//draw curves
		//taxi curves
        
        var lineFunction = d3.svg.line()
                                 .x(function(d){return d.x})
                                 .y(function(d){return d.y})
                                 .interpolate("linear");

		taxiCurves.selectAll("path")
				.data(taxiData)
				.enter()
				.append("path")
				.attr("d", function(d){return lineFunction(d.path)})
				.attr("stroke-width", 2)
				.attr("fill","transparent")
				.attr("opacity", 0.2)
				.attr("stroke", taxiColor);

		//bike curves
		bikeCurves.selectAll("path")
				.data(bikeData)
				.enter()
				.append("path")
				.attr("d", function (d) {
					return	lineFunction(d.path);
				})
				//				.attr("x1", function (d) { return scaleX(d.pickup_longitude)})
				//				.attr("y1", function (d) { return  scaleY(d.pickup_latitude)})
				//				.attr("x2", function (d) { return scaleX(d.dropoff_longitude)})
				//				.attr("y2", function (d) { return  scaleY(d.dropoff_latitude)})
				.attr("stroke-width", 2)
				.attr("fill","transparent")
				.attr("opacity", 0.2)
				.attr("stroke", "#4C9CF2");

		//circle selection

		//draw ui
		//background
		container.append("rect")
				.attr("width",180)
				.attr("height",110)
				.attr("x",0)
				.attr("y",0)
				.attr("fill-opacity",0.5);

		//text buttons
		container.append("text")
				.attr("class","circle-ui")
				.attr("id","start-text")
				.attr("transform", "translate(40,40)")
				.attr("fill","#FF6666")
				.text("Select Pick Up")
				.on("click",function () {
					d3.select("#start-text").attr("fill","#FF6666");
					d3.select("#end-text").attr("fill","white");
					selectingStart = true;
				});

		container.append("text")
				.attr("class","circle-ui")
				.attr("id","end-text")
				.attr("transform", "translate(40,60)")
				.attr("fill","white")
				.text("Select Drop Off")
				.on("click",function () {
					d3.select("#end-text").attr("fill","#5745FF");
					d3.select("#start-text").attr("fill","white");
					selectingStart = false;
				});


		container.append("text")
				.attr("class","circle-ui")
				.attr("transform", "translate(40,80)")
				.attr("fill","white")
				.attr("z-index","50")
				.text("Clear Selection")
				.on("click", function(){
					clearCircles();
					mouseSelectStartX = -73.9;
					mouseSelectStartY = 40.75;
					mouseSelectEndX = -73.9;
					mouseSelectEndY = 40.75;
					startROnMap = 0.2;
					endROnMap = 0.2;
					updateMapData(taxiData,"taxi");
					updateMapData(bikeData,"bike");
					updateHistogram(taxiData,bikeData)
				});



		//init circles
		container.append("circle")
				.attr("id","mouse-selector-start")
				.attr("r", 0)
				.attr("cx",0)
				.attr("cy",0)
				.attr("fill-opacity",0)
				.attr("stroke-width", 2)
				.attr("stroke", "white");

		container.append("circle")
				.attr("cx",20)
				.attr("cy",35)
				.attr("r", 10)
				.attr("id","mouse-selector-start-label")
				.attr("fill","#ff6666")
				.attr("fill-opacity",0.8);

		container.append("circle")
				.attr("id","mouse-selector-end")
				.attr("r", 0)
				.attr("cx",0)
				.attr("cy",0)
				.attr("fill-opacity",0)
				.attr("stroke-width", 2)
				.attr("stroke", "white");

		container.append("circle")
				.attr("cx",20)
				.attr("cy",55)
				.attr("r", 10)
				.attr("id","mouse-selector-end-label")
				.attr("fill","#5745FF")
				.attr("fill-opacity",0.8);

		container.append("circle")
				.attr("cx",20)
				.attr("cy",35)
				.attr("r", 3)
				.attr("fill","white")
				.attr("stroke-width",2)
				.attr("stroke","#ff6666");
		container.append("circle")
				.attr("cx",20)
				.attr("cy",55)
				.attr("r", 3)
				.attr("fill","white")
				.attr("stroke-width",2)
				.attr("stroke","#5745FF");

		var selectCenterX, selectCenterY;
		mouseIsDown = false;
		mouseMoved = false;

		//handle mouse events
		container
				.on("mousedown", function() {
					mouseIsDown = true;
					var coords = d3.mouse(this);
					selectCenterX = coords[0];
					selectCenterY = coords[1];

		})
				.on("mousemove",function () {
					if(mouseIsDown) {
						var coords = d3.mouse(this);
						var r = Math.sqrt(Math.pow((coords[0] - selectCenterX), 2) + Math.pow((coords[1] - selectCenterY), 2));
						if(selectingStart) {
							container.selectAll("#mouse-selector-start")
									.attr("cx", selectCenterX)
									.attr("cy", selectCenterY)
									.attr("r", r);
							container.selectAll("#mouse-selector-start-label")
									.attr("cx", coords[0])
									.attr("cy", coords[1])
									.attr("r", 10);
							startROnMap =  Math.sqrt(Math.pow((scaleX.invert(coords[0]) - scaleX.invert(selectCenterX)), 2) + Math.pow((scaleY.invert(coords[1]) - scaleY.invert(selectCenterY)), 2));
							mouseSelectStartX=scaleX.invert(selectCenterX);
							mouseSelectStartY=scaleY.invert(selectCenterY);
						}else {
							container.selectAll("#mouse-selector-end")
									.attr("cx", selectCenterX)
									.attr("cy", selectCenterY)
									.attr("r", r);
							container.selectAll("#mouse-selector-end-label")
									.attr("cx", coords[0])
									.attr("cy", coords[1])
									.attr("r", 10);
							endROnMap =  Math.sqrt(Math.pow((scaleX.invert(coords[0]) - scaleX.invert(selectCenterX)), 2) + Math.pow((scaleY.invert(coords[1]) - scaleY.invert(selectCenterY)), 2));
							mouseSelectEndX=scaleX.invert(selectCenterX);
							mouseSelectEndY=scaleY.invert(selectCenterY);
						}
						//update data selection
						updateMapData(taxiData, "taxi");
						updateMapData(bikeData, "bike");

						updateHistogram(taxiData,bikeData);
						mouseMoved = true;
					}
				})
				.on("mouseup",function () {
//					updateMapData();
					mouseIsDown = false;
				})

		var controller = d3.select("#controller").append("svg")
				.attr("width",width)
				.attr("height",height);

		function clearCircles() {
			container.selectAll("#mouse-selector-start")
					.attr("cx",0)
					.attr("cy",0)
					.attr("r", 0);

			container.selectAll("#mouse-selector-start-label")
					.attr("cx",20)
					.attr("cy",35)
					.attr("r", 10)

			container.selectAll("#mouse-selector-end")
					.attr("cx",0)
					.attr("cy",0)
					.attr("r", 0)

			container.selectAll("#mouse-selector-end-label")
					.attr("cx",20)
					.attr("cy",55)
					.attr("r", 10)
		}

		//timeline
		drawTimeline(taxiData, bikeData);

		function drawTimeline(taxiData, bikeData) {
			var timelineWidth = 500;
			var timelineHeight = 100;

			timeline = controller.append("g")
					.attr("width", timelineWidth)
					.attr("height", timelineHeight)
					.attr("class", "timeline");


			timeBegin = new Date(year, month-1, day, 0, 0, 0);
			timeEnd = new Date(year, month-1, day+1, 0, 0, 0);

			timeBeginOffset = new Date(year, month-1, day, 8, 0, 0);
			timeEndOffset = new Date(year, month-1, day+1, 8, 0, 0);
			var timeXScale = d3.time.scale()
					.domain([timeBegin, timeEnd])
					.range([0, timelineWidth]);

			var timeXScaleOffset = d3.time.scale()
					.domain([timeBeginOffset, timeEndOffset])
					.range([0, timelineWidth]);

			var timelineXAxis = d3.svg.axis()
					.orient("bottom")
					.scale(timeXScale)
					.tickFormat(d3.time.format("%H:%M"));

			//draw frame
			timeline.append("rect")
					.attr("width", timelineWidth)
					.attr("height", timelineHeight)
					.attr("transform", "translate(20,40)")
					.attr("fill","transparent")
					.attr("stroke-width", 1)
					.attr("stroke", "white");

			//draw description
			timeline.append("text")
					.attr("class", "timeline-text")
					.attr("transform", "translate(20,20)")
					.text(timeBegin.toLocaleDateString());

			//draw axis
			timeline.append("g")
					.attr("class", "timeline-axis")
					.attr("transform", "translate(20,"+(timelineHeight+40)+")")
					.call(timelineXAxis);

			var taxiTimeData = [];
			var bikeTimeData = [];
			taxiData.forEach(function (entry) {
				var time = new Date(entry.tpep_pickup_datetime.replace(/\s/, 'T'));
				taxiTimeData.push(time);
			});

			bikeData.forEach(function (entry) {
				var time = new Date(entry.starttime.replace(/\s/, 'T'))
				bikeTimeData.push(time);
			});

			var	taxiBins = d3.layout.histogram()
						.bins(timeXScaleOffset.ticks(24*4))
						(taxiTimeData);
			var	bikeBins = d3.layout.histogram()
						.bins(timeXScaleOffset.ticks(24*4))
						(bikeTimeData);
			var timeYScale = d3.scale.linear()
					.domain([200, 0])
					.range([0, timelineHeight]);

			var bikeArea = d3.svg.area()
					.x(function(d) { return (timeXScaleOffset(d.x)+20) ; })
					.y0(timelineHeight+40)
					.y1(function(d) { return timeYScale(d.y)+40; });

			timeline.append("path")
					.datum(bikeBins)
					.attr("class", "area")
					.attr("d", bikeArea)
					.attr("fill",bikeColor)
					.attr("fill-opacity",0.3)
					.attr("stroke",bikeColor);

			var taxiArea = d3.svg.area()
					.x(function(d) { return (timeXScaleOffset(d.x)+20) ; })
					.y0(timelineHeight+40)
					.y1(function(d) { return timeYScale(d.y)+40; });

			timeline.append("path")
					.datum(taxiBins)
					.attr("class", "area")
					.attr("d", taxiArea)
					.attr("fill",taxiColor)
					.attr("fill-opacity",0.3)
					.attr("stroke",taxiColor);


			//brush
			brush = d3.svg.brush()
					.x(timeXScale)
					.on("brush", updateTime);
			//draw brush
			timeline.append("g")
					.attr("class", "brush")
					.call(brush)
					.selectAll("rect")
					.attr("y", 1)
					.attr("height", timelineHeight - 1)
					.attr("transform", "translate(20,40)")
					.attr("fill","rgba(255,255,255,0.3)")
					.attr("stroke-width", 2)
					.attr("stroke", "#ff6666");


		}


		function updateTime() {
			timeline.select(".brush")
					.call(brush.extent([brush.extent()[0], brush.extent()[1]]));
			timeSelectBegin = brush.extent()[0];
			timeSelectEnd = brush.extent()[1];

			d3.select(".timeline-text").text(timeBegin.toLocaleDateString()+" "+timeSelectBegin.toLocaleTimeString()
			+" - "+timeSelectEnd.toLocaleTimeString());

			//update data
			updateMapData(taxiData, "taxi");
			updateMapData(bikeData, "bike");
			updateHistogram(taxiData,bikeData);

		}

		function updateMapData(data, type) {
//			updateHistogram(data);
			if(type=="taxi") {
				taxiCurves.selectAll("path")
						.data(data)
						.attr("opacity", function (d) {
							var pickUpTime = new Date(d.tpep_pickup_datetime);
							var distToStart = Math.sqrt(Math.pow((d.pickup_longitude - mouseSelectStartX), 2) + Math.pow((d.pickup_latitude - mouseSelectStartY), 2));
							var distToEnd = Math.sqrt(Math.pow((d.dropoff_longitude - mouseSelectEndX), 2) + Math.pow((d.dropoff_latitude - mouseSelectEndY), 2));
							if (pickUpTime < timeSelectEnd && pickUpTime > timeSelectBegin) {
								if (distToEnd < endROnMap && distToStart < startROnMap) {
									return 0.2;
								} else {
									return 0;
								}
							} else {
								return 0;
							}

						})
			}else{
				bikeCurves.selectAll("path")
						.data(data)
						.attr("opacity", function (d) {
							var pickUpTime = new Date(d.starttime);
							var distToStart = Math.sqrt(Math.pow((d["start station longitude"] - mouseSelectStartX), 2) + Math.pow((d["start station latitude"] - mouseSelectStartY), 2));
							var distToEnd = Math.sqrt(Math.pow((d["end station longitude"] - mouseSelectEndX), 2) + Math.pow((d["end station latitude"] - mouseSelectEndY), 2));
							if (pickUpTime < timeSelectEnd && pickUpTime > timeSelectBegin) {
								if (distToEnd < endROnMap && distToStart < startROnMap) {
									return 0.2;
								} else {
									return 0;
								}
							} else {
								return 0;
							}

						})
			}
		}



		function drawHistogram(taxiData, bikeData) {
			var taxiTimeData = [];
			var bikeTimeData = [];
			taxiData.forEach(function (entry) {
				var time = Math.abs(new Date(entry.tpep_pickup_datetime.replace(/\s/, 'T')) - new Date(entry.tpep_dropoff_datetime.replace(/\s/, 'T'))) / 60000;
				taxiTimeData.push(Math.round(time));
			});

			bikeData.forEach(function (entry) {
				var time = Math.abs(new Date(entry.starttime.replace(/\s/, 'T')) - new Date(entry.stoptime.replace(/\s/, 'T'))) / 60000;
				bikeTimeData.push(Math.round(time));
			});

			var taxiAverage = Math.round(d3.mean(taxiTimeData));
			var bikeAverage = Math.round(d3.mean(bikeTimeData));

			var formatCount = d3.format(",.0f");
			var histogramSvg = d3.select("#histogram"),
					histogramMargin = {top: 40, right: 40, bottom: 100, left: 40},
					histogramWidth = +histogramSvg.attr("width") - histogramMargin.left - histogramMargin.right,
					histogramHeight = +histogramSvg.attr("height") - histogramMargin.top - histogramMargin.bottom,
					histogramG = histogramSvg.append("g")
							.attr("id","histogram-g")
							.attr("transform", "translate(" + histogramMargin.left + "," + histogramMargin.top + ")");

			var histogramX = d3.scale.linear()
					.domain([0, 100])
					.range([0, histogramWidth]);
			var histogramY;

			var taxiBins, bikeBins;
			var taxiXmax = d3.max(taxiTimeData);
			var bikeXmax = d3.max(bikeTimeData);
			if(taxiXmax>100) taxiXmax = 100;
			if(bikeXmax>100) bikeXmax = 100;
			if(taxiXmax > bikeXmax){
				taxiBins = d3.layout.histogram()
						.bins(histogramX.ticks(taxiXmax/5))
						(taxiTimeData);
				bikeBins = d3.layout.histogram()
						.bins(histogramX.ticks(taxiXmax/5))
						(bikeTimeData);

			}else {
				taxiBins = d3.layout.histogram()
						.bins(histogramX.ticks(bikeXmax/5))
						(taxiTimeData);
				bikeBins = d3.layout.histogram()
						.bins(histogramX.ticks(bikeXmax/5))
						(bikeTimeData);
			}

			var taxiBinMax = d3.max(taxiBins, function (d) {
				return d.length
			});

			var bikeBinMax = d3.max(bikeBins, function (d) {
				return d.length
			});

			if(taxiBinMax > bikeBinMax){
				histogramY = d3.scale.linear()
						.domain([0, taxiBinMax])
						.range([histogramHeight, 0]);
			}else{
				histogramY = d3.scale.linear()
						.domain([0,bikeBinMax])
						.range([histogramHeight, 0]);
			}

			//bars
			var histogramTaxiBar = histogramSvg.selectAll(".taxi-bar")
					.data(taxiBins)
					.enter().append("g")
					.attr("class", "taxi-bar")
					.attr("transform", function(d) { return "translate(" + (histogramX(d.x)+histogramMargin.left) + "," + (histogramY(d.y)+histogramMargin.top) + ")"; });

			histogramTaxiBar.append("rect")
					.attr("x", 1)
					.attr("fill",taxiColor)
					.attr("fill-opacity",0.5)
					.attr("width", (histogramX(taxiBins[0].dx) - histogramX (0)) - 1)
					.attr("height", function(d) { return histogramHeight - histogramY(d.y); });


			var histogramBikeBar = histogramSvg.selectAll(".bike-bar")
					.data(bikeBins)
					.enter().append("g")
					.attr("class", "bike-bar")
					.attr("transform", function(d) { return "translate(" + (histogramX(d.x)+histogramMargin.left) + "," + (histogramY(d.y)+histogramMargin.top) + ")"; });

			histogramBikeBar.append("rect")
					.attr("x", 1)
					.attr("fill",bikeColor)
					.attr("fill-opacity",0.5)
					.attr("width", (histogramX(bikeBins[0].dx) - histogramX (0)) - 1)
					.attr("height", function(d) { return histogramHeight - histogramY(d.y); });

			histogramBikeBar.append("text")
					.attr("class", "number-blue")
					.attr("dy", ".1em")
					.attr("y", -10)
					.attr("x", ((histogramX(bikeBins[0].dx) - histogramX (0)) - 1) / 2)
					.attr("text-anchor", "middle")
					.attr("stroke", "none")
					.text(function (d) {
						if(d.length>0) {
							return formatCount(d.length);
						}else {
							return "";
						}
					});

			histogramTaxiBar.append("text")
					.attr("class", "number-yellow")
					.attr("dy", ".1em")
					.attr("y", -10)
					.attr("x", ((histogramX(taxiBins[0].dx) - histogramX (0)) - 1) / 2)
					.attr("text-anchor", "middle")
					.attr("stroke", "none")
					.text(function (d) {
						if(d.length>0) {
							return formatCount(d.length);
						}else {
							return "";
						}
					});


			//axis
			var histogramXAxis = d3.svg.axis()
					.scale(histogramX)
					.orient("bottom");
			histogramG.append("g")
					.attr("id", "histogram-x-axis")
					.attr("transform", "translate(0," + histogramHeight + ")")
					.call(histogramXAxis);

			var histogramYAxis = d3.svg.axis()
					.scale(histogramY)
					.orient("left");
			histogramG.append("g")
					.attr("id", "histogram-y-axis")
					.attr("transform", "translate(0,0)")
					.call(histogramYAxis);

			histogramG.append("text")
					.attr("class", "histogram text")
					.attr("transform", "translate(-20,-20)")
					.text("Number of Trips");

			histogramG.append("text")
					.attr("class", "histogram text")
					.attr("transform", "translate(" + (histogramWidth - 40) + "," + (histogramHeight - 20) + ")")
					.text("Travel Time");

			histogramG.append("text")
					.attr("class", "histogram text")
					.attr("transform", "translate(" + (histogramWidth - 40) + "," + (histogramHeight - 40) + ")")
					.text("(min)");

			//average
			histogramSvg.append("circle")
					.attr("fill", bikeColor)
					.attr("cx", histogramWidth-100)
					.attr("cy", histogramHeight+110)
					.attr("r", 5);

			histogramSvg.append("circle")
					.attr("fill", taxiColor)
					.attr("cx", histogramWidth-100)
					.attr("cy", histogramHeight+90)
					.attr("r", 5);

			histogramSvg.append("text")
					.attr("transform", "translate("+(histogramWidth-90)+","+( histogramHeight+113)+")")
					.text("Bike Average Travel Time");

			histogramSvg.append("text")
					.attr("transform", "translate("+(histogramWidth-90)+","+( histogramHeight+93)+")")
					.text("Taxi Average Travel Time");

			histogramSvg.append("rect")
					.attr("x", histogramWidth-120)
					.attr("y", histogramHeight+70)
					.attr("width", 180)
					.attr("height",60)
					.attr("fill","none")
					.attr("stroke","white")



			var taxiAveragePin = histogramSvg.append("g")
					.attr("id", "taxi-average-pin")
					.attr("transform", "translate(" + (histogramX(taxiAverage)+histogramMargin.left) + "," + histogramHeight + ")");

			taxiAveragePin.append("rect")
					.attr("fill", taxiColor)
					.attr("x", 0)
					.attr("y", 40)
					.attr("width", 1)
					.attr("height", 60);

			taxiAveragePin.append("circle")
					.attr("fill", taxiColor)
					.attr("cx", 0)
					.attr("cy", 100)
					.attr("r", 5);

			taxiAveragePin.append("text")
					.attr("class", "histogram text")
					.attr("transform", "translate(-20,100)")
					.text(taxiAverage + " min");

			var bikeAveragePin = histogramSvg.append("g")
					.attr("id", "bike-average-pin")
					.attr("transform", "translate(" + (histogramX(bikeAverage)+histogramMargin.left) + "," + histogramHeight + ")");

			bikeAveragePin.append("rect")
					.attr("fill", bikeColor)
					.attr("x", 0)
					.attr("y", 40)
					.attr("width", 1)
					.attr("height", 80);

			bikeAveragePin.append("circle")
					.attr("fill", bikeColor)
					.attr("cx", 0)
					.attr("cy", 120)
					.attr("r", 5);

			bikeAveragePin.append("text")
					.attr("class", "histogram text")
					.attr("transform", "translate(-20,120)")
					.text(bikeAverage + " min");

		}

		function updateHistogram(taxiData, bikeData) {
			var taxiTimeData = [];
			var bikeTimeData = [];
			taxiData.forEach(function (entry) {
				var pickUpTime = new Date(entry.tpep_pickup_datetime.replace(/\s/, 'T'));
				var distToStart = Math.sqrt(Math.pow((entry.pickup_longitude - mouseSelectStartX), 2) + Math.pow((entry.pickup_latitude - mouseSelectStartY), 2));
				var distToEnd = Math.sqrt(Math.pow((entry.dropoff_longitude - mouseSelectEndX), 2) + Math.pow((entry.dropoff_latitude - mouseSelectEndY), 2));
				if (pickUpTime < timeSelectEnd && pickUpTime > timeSelectBegin) {
					if (distToEnd < endROnMap && distToStart < startROnMap) {
						var time = Math.abs(new Date(entry.tpep_pickup_datetime.replace(/\s/, 'T')) - new Date(entry.tpep_dropoff_datetime.replace(/\s/, 'T'))) / 60000;
						taxiTimeData.push(Math.round(time));
					}
				}
			});

			bikeData.forEach(function (entry) {
				var pickUpTime = new Date(entry.starttime.replace(/\s/, 'T'));
				var distToStart = Math.sqrt(Math.pow((entry["start station longitude"] - mouseSelectStartX), 2) + Math.pow((entry["start station latitude"]  - mouseSelectStartY), 2));
				var distToEnd = Math.sqrt(Math.pow((entry["end station longitude"] - mouseSelectEndX), 2) + Math.pow((entry["end station latitude"]  - mouseSelectEndY), 2));
				if (pickUpTime < timeSelectEnd && pickUpTime > timeSelectBegin) {
					if (distToEnd < endROnMap && distToStart < startROnMap) {
						var time = Math.abs(new Date(entry.starttime.replace(/\s/, 'T')) - new Date(entry.stoptime.replace(/\s/, 'T'))) / 60000;
						bikeTimeData.push(Math.round(time));
					}
				}
			});


			var formatCount = d3.format(",.0f");

			var taxiAverage = Math.round(d3.mean(taxiTimeData));
			var bikeAverage = Math.round(d3.mean(bikeTimeData));

			var histogramSvg = d3.select("#histogram"),
					histogramMargin = {top: 40, right: 40, bottom: 100, left: 40},
					histogramWidth = +histogramSvg.attr("width") - histogramMargin.left - histogramMargin.right,
					histogramHeight = +histogramSvg.attr("height") - histogramMargin.top - histogramMargin.bottom,
					histogramG = histogramSvg.select("#histogram-g");

			d3.selectAll(".taxi-bar").remove();
			d3.selectAll(".bike-bar").remove();


			var histogramX;
			var histogramY;

			var taxiBins, bikeBins;
			var taxiXmax = d3.max(taxiTimeData);
			if(taxiXmax>100) taxiXmax = 100;

			var bikeXmax = d3.max(bikeTimeData);
			if(bikeXmax>100) bikeXmax = 100;

			if(taxiXmax > bikeXmax){
				histogramX = d3.scale.linear()
						.domain([0, taxiXmax])
						.range([0, histogramWidth]);
				taxiBins = d3.layout.histogram()
						.bins(histogramX.ticks(taxiXmax/5))
						(taxiTimeData);
				bikeBins = d3.layout.histogram()
						.bins(histogramX.ticks(taxiXmax/5))
						(bikeTimeData);

			}else {
				histogramX = d3.scale.linear()
						.domain([0, bikeXmax])
						.range([0, histogramWidth]);
				taxiBins = d3.layout.histogram()
						.bins(histogramX.ticks(bikeXmax/5))
						(taxiTimeData);
				bikeBins = d3.layout.histogram()
						.bins(histogramX.ticks(bikeXmax/5))
						(bikeTimeData);
			}

			var taxiBinMax = d3.max(taxiBins, function (d) {
				return d.length
			});

			var bikeBinMax = d3.max(bikeBins, function (d) {
				return d.length
			});


			if(taxiBinMax > bikeBinMax){
				histogramY = d3.scale.linear()
						.domain([0, taxiBinMax])
						.range([histogramHeight, 0]);
			}else{
				histogramY = d3.scale.linear()
						.domain([0,bikeBinMax])
						.range([histogramHeight, 0]);
			}


			var histogramXAxis = d3.svg.axis()
					.scale(histogramX)
					.orient("bottom");

			d3.select("#histogram-x-axis")
					.call(histogramXAxis);

			var histogramYAxis = d3.svg.axis()
					.scale(histogramY)
					.orient("left");
			d3.select( "#histogram-y-axis")
					.call(histogramYAxis);


			//bars
			var histogramTaxiBar = histogramSvg.selectAll(".taxi-bar")
					.data(taxiBins)
					.enter().append("g")
					.attr("class", "taxi-bar")
					.attr("transform", function(d) { return "translate(" + (histogramX(d.x)+histogramMargin.left) + "," + (histogramY(d.y)+histogramMargin.top) + ")"; });

			histogramTaxiBar.append("rect")
					.attr("x", 1)
					.attr("fill",taxiColor)
					.attr("fill-opacity",0.5)
					.attr("width", (histogramX(taxiBins[0].dx) - histogramX (0)) - 1)
					.attr("height", function(d) { return histogramHeight - histogramY(d.y); });


			var histogramBikeBar = histogramSvg.selectAll(".bike-bar")
					.data(bikeBins)
					.enter().append("g")
					.attr("class", "bike-bar")
					.attr("transform", function(d) { return "translate(" + (histogramX(d.x)+histogramMargin.left) + "," + (histogramY(d.y)+histogramMargin.top) + ")"; });

			histogramBikeBar.append("rect")
					.attr("x", 1)
					.attr("fill",bikeColor)
					.attr("fill-opacity",0.5)
					.attr("width", (histogramX(bikeBins[0].dx) - histogramX (0)) - 1)
					.attr("height", function(d) { return histogramHeight - histogramY(d.y); });

			histogramBikeBar.append("text")
				.attr("class", "number-blue")
					.attr("dy", ".1em")
					.attr("y", -10)
					.attr("x", ((histogramX(bikeBins[0].dx) - histogramX (0)) - 1) / 2)
					.attr("text-anchor", "middle")
					.attr("stroke", "none")
					.text(function (d) {
						if(d.length>0) {
							return formatCount(d.length);
						}else {
							return "";
						}
					});

			histogramTaxiBar.append("text")
					.attr("class", "number-yellow")
					.attr("dy", ".1em")
					.attr("y", -10)
					.attr("x", ((histogramX(taxiBins[0].dx) - histogramX (0)) - 1) / 2)
					.attr("text-anchor", "middle")
					.attr("stroke", "none")
					.text(function (d) {
						if(d.length>0) {
							return formatCount(d.length);
						}else {
							return "";
						}
					});

			//update average
			var taxiAveragePin = histogramSvg.select("#taxi-average-pin")
					.transition()
					.duration(1000)
					.attr("transform", "translate(" + (histogramX(taxiAverage)+histogramMargin.left) + "," + histogramHeight + ")");

			taxiAveragePin.select("text")
					.text(taxiAverage + " min");

			var bikeAveragePin = histogramSvg.select("#bike-average-pin")
					.transition()
					.duration(500)
					.attr("transform", "translate(" + (histogramX(bikeAverage)+histogramMargin.left) + "," + histogramHeight + ")");

			bikeAveragePin.select("text")
					.text(bikeAverage + " min");

		}


		loadScript();
		function makeCurve(startX,startY,endX,endY,control1X,control1Y,control2X,control2Y) {
			return "M" + startX + " " + startY + " C " + control1X + " " + control1Y + ", " + control2X + " " + control2Y + ", " + endX + " " + endY;
		}
        
	}
