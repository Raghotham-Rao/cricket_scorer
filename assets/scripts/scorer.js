function updateEquation(){
    $("#equation").html("Need " + runs_remaining + " runs off " + balls_remaining + " balls.");
}

function changeStrike(){
    strike = (strike + 1) % 2;
    $("#strike_batsman").html(batsmen[strike]);
}

document.querySelector("#scorer_form").addEventListener('submit', (event) => {
    event.preventDefault();
    ips = event.target.elements;
    data = {}
    is_wicket = document.getElementById("is_wicket").checked
    for(ip of ips){
        if(["", "is_wicket"].includes(ip.name)){
            continue;
        }
        if(ip.type == 'checkbox'){
            data[ip.name] = ip.checked;
            continue;
        }
        data[ip.name] = ip.value;
    }
    data['inning'] = inning;
    data['ball'] = ball + ((ips['is_wide'].checked || ips['is_no_ball'].checked)?0:1);
    data['over'] = over + Math.floor(data['ball'] / 6);
    data['ball'] %= 6;
    data['strike'] = batsmen[strike];
    data['non_strike'] = batsmen[(strike + 1) % 2];
    data['bowler'] = bowler;
    data['player_dismissed'] = (is_wicket)?batsmen[document.getElementById("player_dismissed").value]:null;
    if(is_wicket && ["Caught", "Runout", "Stumped"].includes(data['dismissal_kind'])){
        data['fielder'] = document.getElementById("fielder").value;
    }
    else{
        data['fielder'] = null;
    }
    // data['fielder'] = null;
    data['total_runs'] = parseInt(data['batsman_runs']) + ((data['is_wide'] || data['is_no_ball'])?1:0);
    // console.log(data);
    $.post('http://localhost:8000/user/update_score/', data,
        (resp_data) => {
            ball += (ips['is_wide'].checked || ips['is_no_ball'].checked)?0:1;
            over = over + Math.floor(ball / 6);
            ball %= 6;
            score += data['total_runs'];
            wickets += (ips['is_wicket'].checked)?1:0;
            $('#tscore_' + inning).html(score + '/' + wickets);
            $("#overs_" + inning).html(over + '.' + ball);
            if(data['batsman_runs'] % 2 == 1){
                changeStrike();
            }

            // over change
            if(ball == 0 && !(ips['is_wide'].checked || ips['is_no_ball'].checked) && !(over == match_length || wickets == players_per_team)){
                changeStrike();
                $('#bowler-modal').modal('show');
            }

            // wicket
            if(ips['is_wicket'].checked && wickets < players_per_team){
                new_batsman_at = parseInt(document.getElementById("player_dismissed").value);
                $('#new-batsman-modal').modal('show');
            }

            if(inning == 2 && score >= target){
                match_completed = true;
                $("#equation").html("Team 2 Wins");
            }

            // match end
            if(inning == 2 && (over == match_length || wickets == players_per_team)){
                match_completed = true;
                $("#equation").html((score >= target)?"Team 2 Wins by " + (players_per_team - wickets) + " Wickets": "Team 1 Wins by " + (runs_remaining - 1) + " runs");
            }

            // innings end
            if(!match_completed && (over == match_length || wickets == players_per_team)){
                inning = 2;
                target = score + 1;
                over = 0;
                ball = 0;
                wickets = 0;
                score = 0;
                runs_remaining = target;
                balls_remaining = match_length * 6;
                $('#batsmen-modal').modal('show');
                updateEquation();
            }

            if(!match_completed && inning == 2){
                runs_remaining = target - score;
                balls_remaining = match_length * 6 - (over * 6 + ball);
                updateEquation();
            }

            if(match_completed){
                document.getElementById("remote_container").classList.add("d-none");
            }

            document.querySelectorAll(".wicket_event").forEach((elem) => {
                elem.classList.add(['d-none']);
                document.querySelector('.fielder_involved').classList.add('d-none');
                reset_forms();
            });
            reset_forms();
        }
    )
});

document.querySelector("#new-batsman-form").addEventListener('submit', (event) => {
    event.preventDefault();
    batsmen[new_batsman_at] = event.target["new_batsman"].value;
    $("#new-batsman-modal").modal('hide');
    changeStrike();
});


document.getElementById("changeStrikeBtn").addEventListener('click', (event) => {
    event.preventDefault();
    changeStrike();
});


document.getElementById("change_bowler_btn").addEventListener("click", (event) => {
    event.preventDefault();
    $('#bowler-modal').modal('show');
});