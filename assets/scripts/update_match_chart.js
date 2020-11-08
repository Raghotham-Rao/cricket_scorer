var line = document.getElementById('line_chart_area');
var pie = document.getElementById('pie_chart_area');
var econ = document.getElementById('econ_chart_area');

$(".nav-item.nav-link.text-success").on('click', (event) => {
    $(".nav-item.nav-link.text-success").removeClass('active');
    $(event.target).addClass('active');
    // $(".chart-area").addClass('d-none');
    $(".containers").addClass('d-none');
});


$("#batting_tab").on('click', (event) => {
    $("#batting_scorecard_container").removeClass('d-none');
});

$("#bowling_tab").on('click', (event) => {
    $("#bowling_scorecard_container").removeClass('d-none');
});


$("#scores_tab").on('click', (event) => {
    $(".chart_container").removeClass("d-none");
    $(".chart-area").addClass("d-none");
    line.classList.remove('d-none');
    var linear_data = document.getElementById("innings1_runs").value.split(', ');
    var labels = [];

    for(let i=1; i <= linear_data.length; i++){
        try {
            parseInt(linear_data[i]);
            labels.push(i);
        } catch (error) {
            break;
        }
    }
    var myChart = new Chart(line, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Team - 1',
                data: document.getElementById("innings1_runs").value.split(', '),
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: '#327d5c',
                borderWidth: 1
            },
            {
                label: 'Team - 2',
                data: document.getElementById("innings2_runs").value.split(', '),
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: '#d5d5d5',
                borderWidth: 1
            }
        ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                labels:{
                    fontColor: '#cccccc'
                }
            }
        }
    });
});

$("#econ_tab").on('click', (event) => {
    $(".chart_container").removeClass("d-none");
    $(".chart-area").addClass("d-none");
    econ.classList.remove('d-none');
    var econ_data = document.getElementById("runs_per_over1").value.split(', ');
    var labels = [];

    for(let i=1; i <= econ_data.length; i++){
        try {
            parseInt(econ_data[i]);
            labels.push(i);
        } catch (error) {
            break;
        }
    }
    var myChart = new Chart(econ, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Team - 1',
                data: document.getElementById("runs_per_over1").value.split(', '),
                backgroundColor: '#327d5c',
                borderColor: '#327d5c',
                borderWidth: 1
            },
            {
                label: 'Team - 2',
                data: document.getElementById("runs_per_over2").value.split(', '),
                backgroundColor: '#d5d5d5',
                borderColor: '#d5d5d5',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                labels:{
                    fontColor: '#cccccc'
                }
            }
        }
    });
});

$("#run_dist_tab").on('click', (event) => {
    $(".chart_container").removeClass("d-none");
    $(".chart-area").addClass("d-none");
    pie.classList.remove('d-none');
    var myChart = new Chart(pie, {
        type: 'bar',
        data: {
            labels: [0, 1, 2, 3, 4, 5, 6],
            datasets: [{
                label: 'Team - 1',
                data: document.getElementById("run_dist1").value.split(', '),
                backgroundColor: '#327d5c',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 1
            },
            {
                label: 'Team - 2',
                data: document.getElementById("run_dist2").value.split(', '),
                backgroundColor: '#d5d5d5',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                labels:{
                    fontColor: '#cccccc'
                }
            }
        }
    });
});