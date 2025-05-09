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
        if(isLoggedIn) {
            deletePost($(this).data('id'));
        }
    });

    $('#my-card-row').on('click', '#comment-on-post-button', function() {
        currentPostID = $(this).data('id');
    });
    
    $('#comment-content-button').click(function() {
        if(isLoggedIn) {
            let content = $('#comment-content').val();
            console.log(currentPostID);
            commentOnPost(currentPostID, clientUSername, content);
        }
    });

    $('#my-card-row').on('click', '.delete-comment-button', function() {
        if(isLoggedIn) {
            deleteComment($(this).data('id'));
        }
    });
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
                            <a href="#" class="btn btn-primary" id="comment-on-post-button" data-bs-toggle="modal" data-bs-target="#commentModal" data-id="${cardID}">Comment</a>
                            <a href="#" class="btn btn-secondary edit-post" data-id="${cardID}" data-bs-toggle="modal" data-bs-target="#editPostModal" id="go-to-edit-post">Edit Post</a>
                            <a href="#" class="btn btn-primary" data-id="${cardID}" id="delete-post">Delete Post</a>
                            <label>Comments</label>
                            <ul class="comment-section-card" data-id="${cardID}">

                            </ul>
                        </div>
                        </div>
                    </div>
                </div>
            `;

            let commentsLoad = getCommentsOnPost(cardID, function(comments) {
                console.log(comments)
                if(comments.length > 0) {
                    comments.forEach(comment => {
                        let commenter = comment.user || "Unknown";
                        let commentContent = comment.content || "...";
                        let commentID = comment._id;
                        
                        let commentHTML = `<li>${commenter}: ${commentContent}<button class="delete-comment-button" data-id="${commentID}" >Delete</button></li>`;

                        $(`.comment-section-card[data-id="${cardID}"]`).append(commentHTML);
                    })
                }
            });


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
    const token = localStorage.getItem('token');
    
    $.ajax({
        url: `http://127.0.0.1:3001/api/${collection}`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(body),
        headers: {
            'Authorization': `Bearer ${token}`
        },
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

function commentOnPost(postID, commenter, content) {
    const token = localStorage.getItem('token');

    $.ajax({
        url: `http://127.0.0.1:3001/api/comments`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            "postID": postID,
            "user": `${commenter}`,
            "content": `${content}`
        }),
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

function getCommentsOnPost(postID, callback) {
    $.ajax({
        url: `http://127.0.0.1:3001/api/comments/${postID}`,
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

function deleteComment(id) {
    const token = localStorage.getItem('token');
    
    $.ajax({
        url: `http://127.0.0.1:3001/api/comments/${id}`,
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