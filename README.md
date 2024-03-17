<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Bellybutton Biodiversity</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  <style>
    /* CSS styles for the demographic info */
    #sample-metadata {
      font-size: 14px; /* Adjust the font size */
    }

    #sample-metadata p {
      margin: 5px 0; /* Add some margin between paragraphs */
    }

    .card-title {
      font-size: 18px; /* Adjust the font size of the card title */
      font-weight: bold; /* Make the card title bold */
    }
  </style>
</head>

<body>

  <div class="container">
    <div class="row">
      <div class="col-md-12 p-5 text-center bg-light">
        <h1>Belly Button Biodiversity Dashboard</h1>
        <p>Use the interactive charts below to explore the dataset</p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-2">
        <div class="card card-body bg-light">
          <h6>Test Subject ID No.:</h6>
          <select id="selDataset" onchange="updateDashboard(this.value)"></select>
        </div>
        <div class="card card-primary">
          <div class="card-header">
            <h4 class="card-title">Demographic Info</h4> <!-- Apply styles to this element -->
          </div>
          <div id="sample-metadata" class="card-body"></div>
        </div>
      </div>
      <div class="col-md-5">
        <div id="bar-chart"></div>
      </div>
      <div class="col-md-5">
        <div id="bubble-chart"></div>
      </div>
    </div>
  </div>

  <script src="https://d3js.org/d3.v7.min.js"></script>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <script>
    function updateDashboard(selectedID) {
      d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
        var sample = data.samples.find(sample => sample.id === selectedID);
        var metadata = data.metadata.find(metadata => metadata.id === parseInt(selectedID));

        // Update bar chart
        var barChart = document.getElementById('bar-chart');
        var top10Samples = sample.sample_values.slice(0, 10);
        var top10OtuIds = sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
        var top10OtuLabels = sample.otu_labels.slice(0, 10);

        Plotly.newPlot(barChart, [{
          x: top10Samples,
          y: top10OtuIds,
          text: top10OtuLabels,
          type: 'bar',
          orientation: 'h'
        }]);

        // Update bubble chart
        var bubbleChart = document.getElementById('bubble-chart');
        Plotly.newPlot(bubbleChart, [{
          x: sample.otu_ids,
          y: sample.sample_values,
          text: sample.otu_labels,
          mode: 'markers',
          marker: {
            size: sample.sample_values,
            color: sample.otu_ids,
            colorscale: 'Earth'
          }
        }]);

        // Update sample metadata
        var metadataDiv = d3.select("#sample-metadata");
        metadataDiv.selectAll("*").remove(); // Clear previous metadata
        Object.entries(metadata).forEach(([key, value]) => {
          metadataDiv.append("p").text(`${key}: ${value}`);
        });
      }).catch(function (error) {
        console.log(error);
      });
    }

    function populateDropdown(data) {
      var dropdown = document.getElementById('selDataset');
      dropdown.innerHTML = ''; // Clear existing options

      // Populate dropdown with options
      data.names.forEach(function (name) {
        var option = document.createElement('option');
        option.text = name;
        option.value = name;
        dropdown.appendChild(option);
      });
    }

    // Load initial data
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(function (data) {
      populateDropdown(data);
      updateDashboard(data.names[0]); // Load initial data
    }).catch(function (error) {
      console.log(error);
    });
  </script>

</body>

</html>


