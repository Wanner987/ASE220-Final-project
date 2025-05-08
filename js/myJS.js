$(document).ready( function() {
    clickableButtons();
    loadCards();
    getFromDatabase({"test" : true});
});

function clickableButtons() {
    $("#login-button").click(function() {
        let uername = $('#login-username').val();
        let password = $('#login-password').val();
        
    });
}

function loadCards() {

    let image = "https://cdna.artstation.com/p/assets/images/images/032/448/536/large/mitchell-netes-ahem.jpg?1606471608";
    let content = "...";
    let user = "some guy";

    let cardHTML = `<div class="col-12 col-lg-4">
                        <div class="card" style="width: 100%;">
                            <img src="${image}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${user}</h5>
                                <p class="card-text">${content}</p>
                                <a href="#" class="btn btn-primary">Comment</a>
                            </div>
                        </div>
                    </div>`;
    
    $('#my-card-row').append(cardHTML)
    
}

function getFromDatabase(criteria) {
    console.log(JSON.stringify(criteria));
    $.ajax({
        url: 'http://127.0.0.1:3001/api',
        type: 'GET',
        contentType: 'application/json',
        success: function(response) {
            alert(JSON.stringify(response));
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
        }
    })
}

function addPost() {

}

function commentOnPost() {

}

function login() {

}

function signUp() {

}

