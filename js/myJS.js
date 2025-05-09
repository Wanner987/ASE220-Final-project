var clientUSername;

$(document).ready( function() {
    clickableButtons();
    loadCards(1);
});

function clickableButtons() {
    $("#login-button").click(function() {
        let username = $('#login-username').val();
        let password = $('#login-password').val();
        let userObject = loginUserFromDatabase(username, password);
        $('#display-username').text(username);
        clientUSername = username;
    });

    $('#post-button').click(function() {
        let content = $('#post-content').val();
        if(clientUSername) {
            postToCollection('posts', {
                "user" : `${clientUSername}`,
                "content" : `${content}`
            })
        }

    })
}

function loadCards(page) {

    getCardsFromDatabase(1, function(cards) {
        cards.forEach(card => {
            let content = card.content || "...";
            let user = card.user || "Unknown";

            let cardHTML = `
                <div class="col-12 col-lg-4">
                    <div class="card" style="width: 100%;">
                        <div class="card-body">
                            <h5 class="card-title">${user}</h5>
                            <p class="card-text">${content}</p>
                            <a href="#" class="btn btn-primary">Comment</a>
                        </div>
                    </div>
                </div>
            `;

            $('#my-card-row').append(cardHTML);
        });
    });
    
}

function getCardsFromDatabase(page, callback) {
    $.ajax({
        url: `http://127.0.0.1:3001/api/posts/${page}`,
        type: 'GET',
        contentType: 'application/json',
        success: function(response) {
            callback(response);
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
        }
    });
}

function postToCollection(collection, body) {
    $.ajax({
        url: `http://127.0.0.1:3001/api/${collection}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: function(response) {
            alert(JSON.stringify(response));
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
        }
    });
}

function loginUserFromDatabase(username, password) {
    $.ajax({
        url: `http://127.0.0.1:3001/api/users/login`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            "username" : `${username}`,
            "password" : `${password}`
        }),
        success: function(response) {
            console.log(JSON.stringify(response));
            let token = response['token'];
            localStorage.setItem('token', token);
            return(JSON.stringify(response));
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
        }
    });
}


function commentOnPost() {

}
