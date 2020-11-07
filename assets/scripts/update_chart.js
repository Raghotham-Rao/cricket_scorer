var line = document.getElementById('line_chart_area');
var pie = document.getElementById('pie_chart_area');
var econ = document.getElementById('econ_chart_area');

$(".nav-item.nav-link.text-success").on('click', (event) => {
    $(".nav-item.nav-link.text-success").removeClass('active');
    $(event.target).addClass('active');
    $(".chart-area").addClass('d-none');
});

$("#scores_tab").on('click', (event) => {
    $(".chart_container").removeClass("d-none");
    line.classList.remove('d-none');
    var linear_data = document.getElementById("runs_scored_per_match").value.split(', ');
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
                label: 'Data - 1',
                data: document.getElementById("runs_scored_per_match").value.split(', '),
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: '#339966',
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

$("#econ_tab").on('click', (event) => {
    $(".chart_container").removeClass("d-none");
    line.classList.remove('d-none');
    var econ_data = document.getElementById("economy_per_match").value.split(', ');
    var labels = [];

    for(let i=1; i <= econ_data.length; i++){
        try {
            parseInt(econ_data[i]);
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
                label: 'Data - 1',
                data: document.getElementById("economy_per_match").value.split(', '),
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderColor: '#339966',
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
    pie.classList.remove('d-none');
    var myChart = new Chart(pie, {
        type: 'doughnut',
        data: {
            labels: [0, 1, 2, 3, 4, 5, 6],
            datasets: [{
                label: 'Run Distribution',
                data: document.getElementById("run_distribution").value.split(', '),
                backgroundColor: ['#3F729B', 'orange', '#4caf50', 'rgba(205, 220, 57, 0.7)', 'rgba(3, 169, 244, 0.7)', 'rgba(156, 39, 176, 0.7)', 'crimson'],
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