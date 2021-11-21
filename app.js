// Created funciton to run on page load, populating drop down and initial charts
function initLoad() {  
  d3.json("samples.json").then((data) => {
    // console.log(data);

    // Select dropdown and create variable
    var dropdown = d3.select("#selDataset");

    // Create variable of names from dataset
    var names =  data.names;

    // Populate dropdown menu
    dropdown.selectAll('options')
      .data(names)
      .enter()
      .append('option')
      .attr('value', data => data)
      .text(data => data);
  
      // Store first name in dataset as variable for initial load
      var initial = names[0];

  // Initiate plots and metadata panel for first id upon page load
  plots(initial);
  metadata(initial);
  });
};

// Create functions to change data based on slected id
function optionChanged(selectedID) {
  plots(selectedID);
  metadata(selectedID);
};

// Create funciton to generate bar and bubble plots
function plots(id) {
  // Read in dataset
  d3.json("samples.json").then(function(data) {

    // Created variavbles to run plots until worked out optionChanged function
    // var names =  data.names;
    // var id = names[0];

  // Filter for the selected id in dropdown
  var selected = data.samples.filter(sample => sample.id == id);
  // console.log(selected)

  var selectedID = selected[0];
  // console.log(result);
  
  // create variable for required data
  data = []
  for (i=0; i<selectedID.otu_ids.length; i++){
    data.push({
      id: `OTU ${selectedID.otu_ids[i]}`,
      value: selectedID.sample_values[i],
      label: selectedID.otu_labels[i]
    });

  // select for top 10 otu_ids based on sample values
  var ordered = data.sort((first, second) => second.value - first.value);
  var top10 = ordered.slice(0,10).reverse();
  
  // Create trace for bar chart
  var trace1 = {
    x: top10.map(row => row.value),
    y: top10.map(row => row.id),  
    text: top10.map(row => row.label),
    type: "bar",
    orientation: "h",
    marker: {
      color: 'purple',
    },
  }

  var barLayout = {
    color: "green",
    xaxis: {
      title: "Count of Samples"
    },
    yaxis: {
      title: "OTU ID"
    },        
    title: {
      text:`Top 10 OTU's for individual ID ${id}`,
      font: {
        size: 25,
        color: '#000066'
      }
    }
  }

  // Create the data array for bar chart
  var barData = [trace1];

  // Create plot
  Plotly.newPlot("bar", barData, barLayout);

  }

  // Create trace for bubble chart
  var trace2 = {
    x: selectedID.otu_ids,
    y: selectedID.sample_values,
    mode: 'markers', 
    marker: {
      size: selectedID.sample_values,
      color: selectedID.otu_ids,
      colorscale: 'Electric',
    },
    text: selectedID.otu_labels
  }

  var bubbleLayout = {
    title: {
      text:`Sample Values for Each OTU ID for Sample ID ${id}`,
      font: {
        size: 25,
        color: '#000066'
      }
    }
  }


  // Create data array for bubble chart
  var bubbleData = [trace2];

  // Create bubble chart
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });
}

// Create function to ppulate demographics panel and create gauge plot
function metadata(id) {

  d3.json("samples.json").then(function(data) {
    
    // Create variable for demographics data
    // var names =  data.names;
    // var id = names[0];
    
    var metadata = data.metadata.filter(sample => sample.id == id);

    // console.log(metadata);

    // Select id for metadata section in html
    var demographics = d3.select('#sample-metadata');

    // Clear any data
    demographics.html('');

    // Obtain data for each key and value and print to demographics panel
    Object.entries(metadata[0]).forEach(([key, value]) => {
      demographics.append("p").text(`${key}: ${value}`);
    });

  // Gauge chart
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: metadata[0].wfreq,
      title: {
        text: "Belly Button Washing Frequency",            
        font: {
          size: 30,
          color: '#000066'
        }
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { 
          range: [null, 9],
          dtick: 1,
        },
        steps: [
          { range: [0, 1], color: "lightskyblue" },
          { range: [1, 2], color: "lightgray" },
          { range: [2, 3], color: "lightskyblue" },
          { range: [3, 4], color: "lightgray" },
          { range: [4, 5], color: "lightskyblue"},
          { range: [5, 6], color: "lightgray" },
          { range: [6, 7], color: "lightskyblue" },
          { range: [7, 8], color: "lightgray" },
          { range: [8, 9], color: "lightskyblue" },
        ],
        bar: {
          color: "#0080ff"
        },
      }
    }
  ];
  
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);

  });
}

// Run initLoad function on page load
initLoad();


