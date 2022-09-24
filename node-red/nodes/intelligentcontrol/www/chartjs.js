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
const chartType = 'scatter';
//const chartType = 'line';

function getPoint(plotData) {
    if (chartType === 'scatter') {
        return { x: plotData.time, y: plotData.value }
    } else {
        return plotData.value
    }
}

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
    }
    return listPlots[plotData.id].plot;
}

function addDataSet(plotData) {
    console.log(`Create DataSet: ${JSON.stringify(plotData)}`)
    const chart = getChart(plotData)

    chart.data.datasets.push({
        label: plotData.label,
        lineTension: 0.1,
        pointRadius: 1,
        fill: false,
        borderColor: getDataSetColor(plotData),
        borderWidth: 1,
        tension: 0,
        showLine: true,
        data: [getPoint(plotData)]
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
}

function RemoveOldData(plotData) {
    const chart = getChart(plotData)
    while (chart.data.labels.length > 0 && chart.data.labels[0] >= plotData.time) {
        chart.data.labels.shift();
    }
}

function resetPlot(plotData) {
    console.log(`Chama Reset Plot: ${JSON.stringify(plotData)}`)
    if (listPlots[plotData.id] !== undefined) {
        console.log(`Reset Plot: ${JSON.stringify(plotData)}`)
        let chart = getChart(plotData)
        chart.data.labels = [];
        chart.data.datasets = [];
        chart.update()
        listPlots[plotData.id].indexColors = -1;
    }
}

function addData(plotData) {
    //console.log(`addData: ${JSON.stringify(plotData)}`)

    if (plotData.event === 'reset') {
        resetPlot(plotData)
        return;
    }

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
        chart.data.datasets[dataSetIndex].data.push(getPoint(plotData))
        
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
            addData(listUpdates.shift())
        }
        updateChartUI();
    }, 300);

}

function createChart(ctx) {

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        showLines: true,
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
            }],
            x: {
                type: 'linear',
            }
        }
    };

    return new Chart(ctx, {
        type: chartType,
        data: {
            labels: [],
            datasets: [],
            options
        }
    });
}

function addPlot(plotData) {
    console.log(`Create Plot: ${JSON.stringify(plotData)}`)

    var tabs = document.querySelectorAll('.nav-tabs .nav-link');
    var isActive = false;

    tabs.forEach(function (tab) {
        if (tab.classList.contains('active')) {
            isActive = true;
            return; // To break the loop as soon as an active item is found
        }
    });

    let plotArea = document.getElementById('plotarea');

    let plotAreaContent = document.getElementById('plotarea-content');

    let plotId = `_${plotData.id}`

    let a = document.createElement('a');
    a.setAttribute('href', '#' + plotId);
    a.className = 'nav-link';
    if (!isActive) {
        a.className = 'nav-link active';
    } else {
        a.className = 'nav-link';
    }
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
    if (!isActive) {
        div.className = "tab-pane fade show active";
    } else {
        div.className = "tab-pane fade";
    }
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