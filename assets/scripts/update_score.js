var batsmen = [];
var strike = 0;
var bowler = null;
var ball = 0;
var over = 0;
var score = 0;
var wickets = 0;
var new_batsman_at = null;
var inning = 1

function getValueOfHidden(name){
    return document.querySelector(`input[name="${name}"]`).value;
}

if(is_old){
    batsmen[0] = getValueOfHidden("batsman_at_0");
    batsmen[1] = getValueOfHidden("batsman_at_1");
    bowler = getValueOfHidden("bowler_now");
    ball = parseInt(getValueOfHidden("balls_done"));
    over = parseInt(getValueOfHidden("overs_done"));
    inning = parseInt(getValueOfHidden("inning"));
    if(inning == 1){
        score = parseInt(getValueOfHidden("team1_score"));
        wickets = parseInt(getValueOfHidden("team1_wickets"));
    }
    else{
        score = parseInt(getValueOfHidden("team2_score"));
        wickets = parseInt(getValueOfHidden("team2_wickets"));
    }

}

var reset_forms = () => {
    document.querySelectorAll("form").forEach((form) => {
        form.reset();
    });
};

reset_forms();

var is_wicket = document.getElementById("is_wicket");

is_wicket.addEventListener('change', (event) => {
    var divs = document.querySelectorAll(".wicket_event");
    if (event.target.checked) {
        divs.forEach((elem) => {
            elem.classList.remove(["d-none"]);
        });
    } else {
        divs.forEach((elem) => {
            elem.classList.add(['d-none']);
            document.querySelector('.fielder_involved').classList.add('d-none');
            reset_forms();
        });
    }
});

var dismissal_kind = document.getElementById("dismissal_kind");

dismissal_kind.addEventListener('change', (event) => {
    var divs = document.querySelectorAll(".fielder_involved");
    if (["Caught", "Runout"].includes(event.target.value)) {
        divs.forEach((elem) => {
            elem.classList.remove('d-none');
        });
    } else {
        divs.forEach((elem) => {
            elem.classList.add('d-none');
            reset_forms();
        });
    }
});

var loadModal = (id) => {
    $(id).modal('show');
}

document.getElementById("batsmen-form").addEventListener("submit", (event) => {
    event.preventDefault();
    innings = 1;
    batsmen[0] = event.target["strike_batsman"].value;
    batsmen[1] = event.target["non_strike_batsman"].value;
    // document.getElementById("strike_" + innings).innerHTML = batsmen[0];
    // document.getElementById("non_strike_" + innings).innerHTML = batsmen[1];
    $('#batsmen-modal').modal('hide');
    loadModal("#bowler-modal")
});

document.getElementById('bowler-form').addEventListener("submit", (event) => {
    event.preventDefault();
    bowler = event.target['bowler'].value;
    // document.getElementById("bowler_2").innerHTML = bowler;
    // document.getElementById("current_bowler_team1").classList.add("d-none");
    // document.getElementById("current_batsmen_team2").classList.add("d-none");
    $('#bowler-modal').modal('hide');
    console.log(bowler);
})