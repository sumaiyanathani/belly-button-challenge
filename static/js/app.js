// Defining URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

// Creating empty arrays that will be filled with the appropriate data
let sample_data, sample_values, otu_ids, otu_labels, ids = [];

// Fetching the JSON data and console logging it
d3.json(url).then(data => {
    console.log(data);
    
    //Extracting sample data and ids
    sample_data = data.samples;
    ids = data.names;

    // Mapping out data into arrays
    sample_values = sample_data.map(sample => sample.sample_values);
    otu_ids = sample_data.map(otu_id => otu_id.otu_ids);
    otu_labels = sample_data.map(otu_label => otu_label.otu_labels);
    let id940_values = sample_data[0].sample_values;
    let id940_ids = sample_data[0].otu_ids;
    let id940_hover = sample_data[0].otu_labels;

    // Creating function that will display the default bar graph
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

    // Creating function that will display the default bubble plot
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

    // Creating function that will display the default meta data
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

    // Creating each option for the dropdown menu
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

// // On change to the DOM, calling the optionChanged() function
d3.selectAll("onchange").on("change", optionChanged);

// Defining the optionChanged() function
function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let dataset = dropdownMenu.property("value");
    // Initialize an empty array for the country's data
    
    for (let i = 0; i < ids.length; i++) {
        if (dataset == ids[i]) {
            let y_data = [];
            y_data = otu_ids[i].slice(0,10).map(otu_id => {
                return 'OTU ' + otu_id});
            let x_data = sample_values[i].slice(0, 10);
            let barplot_data = [];
            barplot_data = [{
                x: x_data,
                y: y_data,
                type: "bar",
                orientation: "h",
                text: otu_labels[i].slice(0,10),
                transforms: [{
                    type: 'sort',
                    target: 'y',
                    order: 'descending'
                  }]
                }];

                // Calling function to update the chart
                updatePlotly(barplot_data);

                bubbleplot_data = [{
                    x: otu_ids[i],
                    y: sample_values[i],
                    mode: 'markers',
                    text: otu_labels[i],
                    marker: {
                        color: otu_ids[i],
                        size: sample_values[i]
                }
                    }];

                // Calling function to update the chart
                updatePlotly(bubbleplot_data);
                
                
                if (dataset == ids[i]) { 
                    let row = document.querySelector("tr");
                    row.innerHTML = " ";
                    updateMetadata(row);
                    }}
            }
            
        };

// Defining the updatePlotly function to update the plots everytime a different sample is selected
function updatePlotly(newdata) {
    for (let i = 0; i < ids.length; i++) {
        let dropdownMenu = d3.select("#selDataset");
        let dataset = dropdownMenu.property("value");
        if (dataset == ids[i]) {

            // This part updates the bar plot
            let y_data = [];
            y_data = otu_ids[i].slice(0,10).map(otu_id => {
                return 'OTU ' + otu_id});
            let new_plot = [{
                x: sample_values[i].slice(0,10),
                y: y_data,
        type: "bar",
        orientation: "h",
        text: otu_labels[i].slice(0,10),
        transforms: [{
            type: 'sort',
            target: 'y',
            order: 'descending'
          }]
    }];
    let layout_bar = {
        height: 600,
        width: 800
    };
    Plotly.newPlot("bar", new_plot, layout_bar);

    // This part updates the bubble plot
    let bubble_plot = [{
        x: otu_ids[i],
        y: sample_values[i],
        mode: 'markers',
        text: otu_labels[i],
        marker: {
            color: otu_ids[i],
            size: sample_values[i]
    }}];

    let layout_bubble = {
        height: 600,
        width: 1000
};

Plotly.newPlot("bubble", bubble_plot, layout_bubble);
        }

        }}

// Creating function to update the metadata when a new sample is selected from the dropdown menu
function updateMetadata(meta) {
    let entries = []
    for (let i = 0; i < ids.length; i++) {
        let dropdownMenu = d3.select("#selDataset");
        let dataset = dropdownMenu.property("value");
        if (dataset == ids[i]) {
            d3.json(url).then(data => {
                let row = d3.select('tr');
    let sample_metadata = data.metadata;
    entries = Object.entries(sample_metadata[i]);
    for ([key, value] of entries) {
        row.append('tr').text(`${key}: ${value}\n`);
     };
    })}}
}
