var listPlots = [];
var listUpdates = [];
const plotColors = [
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

function getDataSetColor(plotData) {
    if (listPlots[plotData.id].indexColors < plotColors.length) {
        listPlots[plotData.id].indexColors++;
        color = plotColors[listPlots[plotData.id].indexColors]
    } else {
        color = "#" + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")
    }
    return color;
}

function getChart(plotData) {
    if (listPlots[plotData.id] === undefined) {
        listPlots[plotData.id] = {
            plot: addPlot(plotData),
            indexColors: -1
        }
        //addPlot(plotData);
        //indexColors[plotData.id] = -1
    }
    return listPlots[plotData.id].plot;
}

function addDataSet(plotData) {
    console.log(`Create DataSet: ${JSON.stringify(plotData)}`)
    const chart = getChart(plotData)

    chart.data.datasets.push({
        label: plotData.label,
        lineTension: 0.1,
        pointRadius: 0,
        fill: false,
        borderColor: getDataSetColor(plotData),
        borderWidth: 1,
        data: [plotData.value]
    });

    addLabel(plotData)

    chart.update()
}

function addLabel(plotData) {
    const chart = getChart(plotData)
    const labels = chart.data.labels;
    const lastTime = labels.slice(-1);
    if (!labels.includes(plotData.time)) {
        chart.data.labels.push(plotData.time);
    }

    if (plotData.time < lastTime) {
        chart.data.labels.sort(function (a, b) {
            return a - b;
        });
    }


    return;

    if (!labels.includes(plotData.time)) {

        let index = labels.findIndex(function (element) {
            return plotData.time < element;
        });

        if (index === -1) {
            index = labels.length;
        }

        chart.data.labels.splice(index, 0, plotData.time);
    }
}

function RemoveOldData(plotData) {
    const chart = getChart(plotData)
    while (chart.data.labels.length > 0 && chart.data.labels[0] >= plotData.time) {
        chart.data.labels.shift();
        //chart.data.datasets[datasetPlot].data.shift();
    }
}

function addData(plotData) {
    //console.log(`addData: ${JSON.stringify(plotData)}`)
    let chart = getChart(plotData)
    let dataSetIndex = -1;

    chart.data.datasets.forEach((value, index) => {
        if (value.label === plotData.label) {
            dataSetIndex = index;
        }
    });

    if (dataSetIndex === -1) {

        addDataSet(plotData);

    } else {

        addLabel(plotData)
        chart.data.datasets[dataSetIndex].data.push(plotData.value)

    }

    //RemoveOldData(plotData)
}

function updateChartUI() {
    for (var id in listPlots) {
        listPlots[id].plot.update()
    }
}

async function updateUI() {

    setInterval(function () {
        while (listUpdates.length > 0) {

            let plotData = listUpdates.shift();
            addData(plotData)
        }
        updateChartUI();
    }, 300);

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
            // ,
            // x: {
            //     type: 'linear',
            // }
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

function addPlot(plotData) {
    console.log(`Create Plot: ${JSON.stringify(plotData)}`)

    let plotArea = document.getElementById('plotarea');

    let plotAreaContent = document.getElementById('plotarea-content');

    let plotId = `_${plotData.id}`

    let a = document.createElement('a');
    a.setAttribute('href', '#' + plotId);
    a.className = 'nav-link';
    a.setAttribute('data-bs-toggle', 'tab')
    a.appendChild(document.createTextNode(plotData.name));

    let li = document.createElement('li');
    li.className = 'nav-item';
    li.appendChild(a);

    let canvas = document.createElement('canvas');
    canvas.id = plotId + "-canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 100;

    let div = document.createElement('div');
    div.className = "tab-pane fade show active";
    div.id = plotId;
    div.appendChild(canvas);

    plotArea.appendChild(li);
    plotAreaContent.appendChild(div);

    return createChart(canvas.getContext('2d'))
}

function plotValue(message) {

    if (Array.isArray(message)) {
        message.forEach((value) => {
            listUpdates.push(value)
        });
    } else {
        listUpdates.push(message)
    }



}

updateUI();