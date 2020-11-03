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
    data['ball'] = ball + (ips['is_wide'].checked || ips['is_no_ball'].checked)?0:1;
    data['over'] = over + Math.floor(data['ball'] / 6);
    data['ball'] %= 6;
    data['strike'] = batsmen[strike];
    data['non_strike'] = batsmen[(strike + 1) % 2];
    data['bowler'] = bowler;
    data['player_dismissed'] = (is_wicket)?batsmen[document.getElementById("player_dismissed").value]:null;
    if(is_wicket && ["Caught", "Runout", "Stumped"].includes(data['dismissal_kind'])){
        data['fielder'] = document.getElementById("fielder");
    }
    else{
        data['fielder'] = null;
    }
    data['total_runs'] = parseInt(data['batsman_runs']) + ((data['is_wide'] || data['is_no_ball'])?1:0);
    console.log(data);
    $.post('http://localhost:8000/user/update_score/', data,
        (resp_data) => {
            ball += (ips['is_wide'].checked || ips['is_no_ball'].checked)?0:1;
            over = over + Math.floor(ball / 6);
            ball %= 6;
            score += data['total_runs'];
            wickets += (ips['is_wicket'].checked)?1:0;
            $('#tscore_' + inning).html(score + '/' + wickets);
            $("#overs_" + inning).html(over + '.' + ball);

            if(ball == 0 && !(ips['is_wide'].checked || ips['is_no_ball'].checked)){
                $('#bowler-modal').modal('show');
            }

            if(ips['is_wicket'].checked){
                new_batsman_at = document.getElementById("player_dismissed").value;
                $('#new-batsman-modal').modal('show');
            }

            if(over == match_length || wickets == players_per_team){
                inning = 2;
                $('#batsmen-modal').modal('show');
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
});