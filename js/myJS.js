var clientUSername;
var currentPage = 1;
var currentPostID;
var isLoggedIn = false;

$(document).ready( function() {
    clickableButtons();
    loadCards(currentPage);
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
        if(isLoggedIn) {
            let content = $('#post-content').val();
            if(clientUSername) {
                postToCollection('posts', {
                    "user" : `${clientUSername}`,
                    "content" : `${content}`
                })
            }
        }
    });

    $('#load-more-button').click(function() {
        currentPage += 1;
        loadCards(currentPage);
    });

    $('#my-card-row').on('click', '#go-to-edit-post', function() {
        currentPostID = $(this).data('id');
        console.log(currentPostID);
    });
    
    $('#edited-content-button').click(function() {
        if(isLoggedIn) {
            let content = $('#edited-content').val();
            updatePost(currentPostID, {
                "user" : `${clientUSername}`,
                "content" : `${content}`
            });
        }
    });

    $('#my-card-row').on('click', '#delete-post', function() {
        console.log(isLoggedIn);
        if(isLoggedIn) {
            deletePost($(this).data('id'));
        }
    })
}

function loadCards(page) {

    getCardsFromDatabase(page, function(cards) {
        cards.forEach(card => {
            let content = card.content || "...";
            let user = card.user || "Unknown";
            let cardID = card._id;

            let cardHTML = `
                <div class="col-12 col-lg-4">
                    <div class="card" style="width: 100%;">
                        <div class="card-body">
                            <h5 class="card-title">${user}</h5>
                            <p class="card-text">${content}</p>
                            <a href="#" class="btn btn-primary">Comment</a>
                            <a href="#" class="btn btn-secondary edit-post" data-id="${cardID}" data-bs-toggle="modal" data-bs-target="#editPostModal" id="go-to-edit-post">Edit Post</a>
                            <a href="#" class="btn btn-primary" data-id="${cardID}" id="delete-post">Delete Post</a>
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
            isLoggedIn = true;
            return(JSON.stringify(response));
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
        }
    });
}

function updatePost(id, newContent) {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('JWT token is missing');
        return;
    }



    $.ajax({
        url: `http://127.0.0.1:3001/api/posts/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(newContent),
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(response) {
            console.log(JSON.stringify(response));
            return(JSON.stringify(response));
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
        }
    });
}

function deletePost(id) {
    const token = localStorage.getItem('token');

    
    $.ajax({
        url: `http://127.0.0.1:3001/api/posts/${id}`,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function(response) {
            return response;
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
        }
    });
}

function commentOnPost() {

}
