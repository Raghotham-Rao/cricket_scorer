var batsmen = [];
var strike = 0;
var bowler = null;
var ball = 0;
var over = 0;
var score = 0;
var wickets = 0;
var new_batsman_at = null;
var inning = 1;
var match_length = parseInt(getValueOfHidden("match_length"));
var players_per_team = parseInt(getValueOfHidden("players_per_team"));
var target = null;
var match_completed = false;
var runs_remaining = null;
var balls_remaining = null;

function getValueOfHidden(name){
    return document.querySelector(`input[name="${name}"]`).value;
}

if(is_old){
    batsmen[0] = getValueOfHidden("batsman_at_0");
    batsmen[1] = getValueOfHidden("batsman_at_1");
    bowler = getValueOfHidden("bowler_now");
    inning = parseInt(getValueOfHidden("inning"));
    if(inning == 1){
        score = parseInt(getValueOfHidden("team1_score"));
        wickets = parseInt(getValueOfHidden("team1_wickets"));
        ball = parseInt(getValueOfHidden("balls_done1"));
        over = parseInt(getValueOfHidden("overs_done1"));
    }
    else{
        ball = parseInt(getValueOfHidden("balls_done2"));
        over = parseInt(getValueOfHidden("overs_done2"));
        score = parseInt(getValueOfHidden("team2_score"));
        wickets = parseInt(getValueOfHidden("team2_wickets"));
        target = parseInt(getValueOfHidden("team1_score")) + 1;
        runs_remaining = target - score;
        balls_remaining = (match_length * 6) - (over * 6 + ball);
        $("#equation").html("Need " + runs_remaining + " runs off " + balls_remaining + " balls.");
    }
    if((parseInt(getValueOfHidden("overs_done1")) == match_length || getValueOfHidden("team1_wickets") == players_per_team) && (parseInt(getValueOfHidden("overs_done2")) == 0 && parseInt(getValueOfHidden("balls_done2")) == 0)){
        inning = 2;
        target = score + 1;
        over = 0;
        ball = 0;
        wickets = 0;
        score = 0;
        runs_remaining = target;
        balls_remaining = match_length * 6;
        strike = 0;
        $('#batsmen-modal').modal('show');
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
    $("#strike_batsman").html(batsmen[0]);
    loadModal("#bowler-modal")
});

document.getElementById('bowler-form').addEventListener("submit", (event) => {
    event.preventDefault();
    bowler = event.target['bowler'].value;
    // document.getElementById("bowler_2").innerHTML = bowler;
    // document.getElementById("current_bowler_team1").classList.add("d-none");
    // document.getElementById("current_batsmen_team2").classList.add("d-none");
    $('#bowler-modal').modal('hide');
    $("#current_bowler").html(bowler);
    console.log(bowler);
})