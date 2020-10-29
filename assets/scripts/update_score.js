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

document.querySelector("#match-form").addEventListener("submit", (event) => {
    event.preventDefault();
    form_data = {};
    for(elem of event.target.elements){
        if(elem.name == "" || elem.name.includes('csrfmidd')){
            continue;
        }
        form_data[elem.name] = elem.value;
    }
    $.post('http://localhost:8000/user/match_details/',
        Object.assign(form_data, {
            'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val()
        }),
        (data) => {
            console.log(data);
            $('#matchModal').modal('hide');
            loadModal("#batsmen-modal");
        },
    )
    .fail((response) => {
        alert(response.responseText);
    });
});