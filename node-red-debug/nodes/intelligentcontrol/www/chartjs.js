let listPlots = [];
let listUpdates = [];
let plotColors = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'black',
    'white',
    'gray',
    'brown',
    'violet',
    'cyan',
    'turquoise',
    'gold',
    'silver',
    'indigo',
    'lime',
    'salmon',
    'lavender'
];
let plotColorIndex = -1;


function addDataSet(chart) {
}

async function updateUI() {

    setInterval(function () {
        while (listUpdates.length > 0) {

            var plotValue = listUpdates.shift();

            if (listPlots[plotValue.name] === undefined) {
                plotItem = {
                    'name': plotValue.name
                }
                plotItem.chart = addPlot(plotItem);
                listPlots[plotValue.name] = plotItem;
            }

            var chart = listPlots[plotValue.name].chart
            var label = plotValue.label
            var time = plotValue.time
            var value = plotValue.value            

            var datasetPlot = -1;

            chart.data.datasets.forEach((value, index) => {
                if (value.label === label) {
                    datasetPlot = index;
                }
            });

            if (datasetPlot === -1) {
                if (plotColorIndex < plotColors.length) {
                    plotColorIndex++;
                    color = plotColors[plotColorIndex]
                } else {
                    color = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
                }

                chart.data.labels.push(time);

                datasetPlot = chart.data.datasets.push({
                    label: label,
                    lineTension: 0.1,
                    pointRadius: 0,
                    fill: false,
                    borderColor: color,
                    borderWidth: 1,
                    data: [value]
                });

                chart.update();
            } else {

                while (chart.data.labels.length > 0 && chart.data.labels[0] >= time) {
                    chart.data.labels.shift();
                    chart.data.datasets[datasetPlot].data.shift();
                }

                if (chart.data !== undefined) {                    
                    chart.data.datasets[datasetPlot].data.push(value);
                    chart.data.labels.push(time);

                    chart.update();
                }

            }

        }
    }, 100);

}

function addDataPlant(chart, label, time, value) {
    var datasetPlot = -1;

    chart.data.datasets.forEach((value, index) => {
        if (value.label === label) {
            datasetPlot = index;
        }
    });

    if (datasetPlot === -1) {
        datasetPlot = chart.data.datasets.push({
            label: label,
            lineTension: 0.1,
            pointRadius: 0,
            fill: false,
            borderColor: "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0"),
            data: []
        });
        console.log("****criou chat****")
    }

    // if (chart.data.labels.indexOf(time) == -1){
    //     console.log(time);
    //     chart.data.labels.push(time);
    // }

    while (chart.data.labels.length > 0 && chart.data.labels[0] >= time) {
        chart.data.labels.shift();
        chart.data.datasets[datasetPlot].data.shift();
    }

    if (chart.data !== undefined) {
        chart.data.labels.push(time);
        chart.data.datasets[datasetPlot].data.push(value);

        chart.update();

        //console.log(`data: ${chart.data.datasets[datasetPlot].data.length} - label: ${chart.data.labels.length}`)        
    }
}

function addData(chart, dataset, data) {
    chart.data.datasets[dataset].data.push(data);
    while (chart.data.datasets[dataset].data.length > 60) {
        chart.data.datasets[dataset].data.shift();
    }
    chart.update();
}

function removeData(chart) {
    chart.data.labels = [0];
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [0];
    });
    chart.update();
}

function createChart(ctx) {

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        hover: {
            animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [],
            options
        }
    });
}

function addPlots() {
    listPlots.forEach(function (plotItem) {
        addPlot(plotItem)
    });
}

function addPlot(plotItem) {
    let plotArea = document.getElementById('plotarea');

    let plotAreaContent = document.getElementById('plotarea-content');

    let a = document.createElement('a');
    a.setAttribute('href', '#' + plotItem.name);
    a.className = 'nav-link';
    a.setAttribute('data-bs-toggle', 'tab')
    a.appendChild(document.createTextNode(plotItem.name));

    let li = document.createElement('li');
    li.className = 'nav-item';
    li.appendChild(a);

    let canvas = document.createElement('canvas');
    canvas.id = plotItem.name + "-canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;

    let div = document.createElement('div');
    div.className = "tab-pane fade show active";
    div.id = plotItem.name;
    div.appendChild(canvas);

    plotArea.appendChild(li);
    plotAreaContent.appendChild(div);

    return createChart(canvas.getContext('2d'))
}

function plotValue(message) {
    //let plotValue = JSON.parse(message)

    listUpdates.push(message)

    // let plotValue = message;

    // if (listPlots[plotValue.name] === undefined) {
    //     plotItem = {
    //         'name': plotValue.name
    //     }
    //     plotItem.chart = addPlot(plotItem);
    //     listPlots[plotValue.name] = plotItem;
    // }

    // addDataPlant(listPlots[plotValue.name].chart, plotValue.label, plotValue.time, plotValue.value)
}

//addPlots()

updateUI();