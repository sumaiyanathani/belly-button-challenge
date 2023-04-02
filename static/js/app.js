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
    let sample_values = sample_data.map(value => value.sample_values.slice(0, 10));
    let otu_ids = sample_data.map(otu_id => otu_id.otu_ids.slice(0, 10));
    let otu_labels = sample_data.map(otu_label => otu_label.otu_labels.slice(0, 10));
    let id940_values = sample_data[0].sample_values.slice(0, 10);
    let id940_ids = sample_data[0].otu_ids.slice(0, 10).map(otu_id => {
        return 'OTU ' + otu_id});
        

    function init() {
        let plot_data = [{
            x: id940_values,
            y: id940_ids,
            type: "bar",
            orientation: "h",
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

    Plotly.newPlot("bar", plot_data, layout);
    console.log(plot_data)
    }

    const selectElement = document.getElementById("selDataset");
    for (let i = 0; i < ids.length; i++) {
      const optionElement = document.createElement("option");
      const optionText = document.createTextNode(ids[i]);
      optionElement.appendChild(optionText);
      selectElement.appendChild(optionElement);  
    }
    
d3.selectAll("#selDataset").on("change", getData);
    
function getData() {
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a letiable
    let dataset = dropdownMenu.property("value");
        // Initialize an empty array for the country's data
    console.log(dataset)
    console.log(ids)
    let plot_data = [];
    for (let i = 0; i < ids.length; i++) {
        if (dataset == ids[i]) {
            let plot_data = otu_ids[i].map(otu_id => {
                return 'OTU ' + otu_id});
                //console.log(plot_data)
         }};
         
         updatePlotly(plot_data);
         function updatePlotly(newdata) {
            Plotly.restyle("bar", "values", [newdata])};
    }

    init();
})
