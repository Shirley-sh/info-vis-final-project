var jsonFile = d3.json('data/taxi_10000.json');
jsonFile.get(bundling);
var public_data;

var margin = 0.05;
maxLat = 40.8 + margin - 0.025;
maxLon = -73.9 + margin;
minLat = 40.75 - margin - 0.025;
minLon = -74.0 - margin;

scaleX = d3.scale.linear().domain([minLon, maxLon]).rangeRound([0, 600]);
scaleY = d3.scale.linear().domain([minLat, maxLat]).rangeRound([600, 0]);

function bundling(err, data) {
    // console.log(data.length);
    var nodes = {};
    var edges = [];


    for (let i = 0; i < data.length; i++) {
        nodes[i * 2] = {
            'x': scaleX(parseFloat(data[i]["pickup_longitude"])),
            'y': scaleY(parseFloat(data[i]["pickup_latitude"]))
            // 'x': scaleX(parseFloat(data[i]["start station longitude"])),
            // 'y': scaleY(parseFloat(data[i]["start station latitude"]))
        };
        nodes[i * 2 + 1] = {
            'x': scaleX(parseFloat(data[i]["dropoff_longitude"])),
            'y': scaleY(parseFloat(data[i]["dropoff_latitude"]))
            // 'x': scaleX(parseFloat(data[i]["end station longitude"])),
            // 'y': scaleY(parseFloat(data[i]["end station latitude"]))
        };
        edges.push({
            "source": i * 2,
            "target": i * 2 + 1
        });
    }
    console.log(data.length, Object.keys(nodes).length, edges.length);
    var bundleFunction = d3.ForceEdgeBundling().nodes(nodes).edges(edges);
    // var bundleFunction = d3.ForceEdgeBundling().nodes(node_data).edges(edge_data);
    var bundled = bundleFunction();
    public_data = data;
    for (let i = 0; i < data.length; i++) {
        public_data[i].path = bundled[i];
    }

    var jsonString = JSON.stringify(public_data);
    var jsonBlob = new Blob([jsonString], { type: "application/json" });
    var jsonUrl = URL.createObjectURL(jsonBlob);

    var jsonLink = document.createElement('a');
    jsonLink.download = "bundled.json";
    jsonLink.href = jsonUrl;
    jsonLink.textContent = "Download bundled data";
    document.body.appendChild(jsonLink);
}