var chartColors = {
    test_1: '#fba66c',
    test_2: '#86b9ce',
    test_3: '#4274fd'
  };

//   var canvas : any = document.getElementById("demo");
  var canvas = document.getElementById("demo");
  var ctx = canvas.getContext("2d");

  var test_1_data = [1, 0, 3, 0, 5, 6, 8];
  var test_2_data = [5, 1, 8, 0, 3, 6, 5];
  var test_3_data = [9, 8, 3, 4, 5, 6, 2];
  var lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu','Fri', 'Sat', 'Sun'],
  datasets: [{

     label: 'test_1',
     borderColor: chartColors.test_1,
     backgroundColor: chartColors.test_1,
     fill: false,
     data: test_1_data ,
     yAxisID: 'y-axis-1'
  },
  {
    label: 'test_2',
    borderColor: chartColors.test_2,
    backgroundColor: chartColors.test_2,
    fill: false,
    data: test_2_data ,
    yAxisID: 'y-axis-1'
 },
{
  label: 'test_3',
  borderColor: chartColors.test_3,
  backgroundColor: chartColors.test_3,
  fill: false,
  data: test_3_data ,
  yAxisID: 'y-axis-1'
 }
 ]
 };

  var demo= Chart.Line(ctx, {
    data: [1,2,3],
    options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Last updated at  : '+ new Date().toLocaleString()
        },
        scales: {
            yAxes: [{
              ticks:{
                  min: 0,
                  max:15,
                  stepSize:3
                },
                type: 'linear',
                position: 'left',
                id: 'y-axis-1'
              }],
        }
    }
});