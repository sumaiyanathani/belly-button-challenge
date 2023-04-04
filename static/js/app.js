
// 
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

let sample_data, sample_values, otu_ids, otu_labels, ids = [];
// Fetch the JSON data and console log it
d3.json(url).then(data => {
    console.log(data);
    sample_data = data.samples;
    ids = data.names;
    sample_values = sample_data.map(value => value.sample_values.slice(0, 10));
    otu_ids = sample_data.map(otu_id => otu_id.otu_ids.slice(0, 10));
    otu_labels = sample_data.map(otu_label => otu_label.otu_labels.slice(0, 10));
    let id940_values = sample_data[0].sample_values;
    let id940_ids = sample_data[0].otu_ids;
    let id940_hover = sample_data[0].otu_labels;

    function init() {
        let barplot_data = [{
            x: id940_values.slice(0, 10),
            y: id940_ids.slice(0, 10).map(otu_id => {
                return 'OTU ' + otu_id}),
            type: "bar",
            orientation: "h",
            text: id940_hover.slice(0,10),
            transforms: [{
                type: 'sort',
                target: 'y',
                order: 'descending'
              }]
        }];

    let layout = {
        height: 600,
        width: 800
    };

    Plotly.newPlot("bar", barplot_data, layout);

    };

    function init2() {
        let bubble_plot = [{
            x: id940_ids,
            y: id940_values,
            mode: 'markers',
            text: id940_hover,
            marker: {
                color: id940_ids,
                size: id940_values
        }}];

    let layout = {
        height: 600,
        width: 1000
    };
    
    Plotly.newPlot("bubble", bubble_plot, layout);

    };

    function init3() {
    let metadata = d3.select('#sample-metadata');
    let panel_body = metadata.append('panel-body');
    let row = panel_body.append('tr');
    let sample_metadata = data.metadata;
    let entries = Object.entries(sample_metadata[0]); 

    for ([key, value] of entries) {
         row.append('tr').text(`${key}: ${value}\n`);
     };
    };

    const selectElement = document.getElementById("selDataset");
    for (let i = 0; i < ids.length; i++) {
      const optionElement = document.createElement("option");
      const optionText = document.createTextNode(ids[i]);
      optionElement.appendChild(optionText);
      selectElement.appendChild(optionElement);  
    };
    init();
    init2();
    init3();
});

d3.selectAll("onchange").on("change", optionChanged);

function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a letiable
    let dataset = dropdownMenu.property("value");
    // Initialize an empty array for the country's data
    
    for (let i = 0; i < ids.length; i++) {
        if (dataset == ids[i]) {
            let y_data = [];
            y_data = otu_ids[i].map(otu_id => {
                return 'OTU ' + otu_id});
            let x_data = sample_values[i]
            let barplot_data = [];
            barplot_data = [{
                x: x_data,
                y: y_data,
                type: "bar",
                orientation: "h",
                text: otu_labels[i],
                transforms: [{
                    type: 'sort',
                    target: 'y',
                    order: 'descending'
                  }]
                }];
                updatePlotly(barplot_data);
            }
                //console.log(barplot_data)
        };
         };

function updatePlotly(newdata) {
    Plotly.restyle("bar", "x_data", [newdata])
    Plotly.restyle("bar", "y_data", [newdata])
}
