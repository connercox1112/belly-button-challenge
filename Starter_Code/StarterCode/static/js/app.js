function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      let result = metadata.filter(sampleObj => sampleObj.id == sample)[0];
      
      // Use d3 to select the panel with id of `#sample-metadata`
      let PANEL = d3.select("#sample-metadata");
  
      // Use `.html("")` to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key-value pair to the panel
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
      });
    });
  }
  
  function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let samples = data.samples;
      let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      let result = resultArray[0];
  
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;
  
      // Build a Bubble Chart
      let bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        margin: { t: 30 }
      };
      
      let bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }];
  
      Plotly.newPlot("bubble-chart", bubbleData, bubbleLayout);
  
      // Build a Bar Chart
      let barData = [{
        y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
      }];
  
      let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };
  
      Plotly.newPlot("bar-chart", barData, barLayout);
    });
  }
  
  function init() {
    // Grab a reference to the dropdown select element
    let selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      let sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();