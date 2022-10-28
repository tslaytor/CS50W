document.addEventListener('DOMContentLoaded', function() {
    // hide the other pages and show the home page
    document.querySelector('#profile').style.display = "none";
    document.querySelector('#home').style.display = "block";
    // make the new post form active
    document.querySelector('#new-post').onsubmit = createNewPost;
    // list all the posts
    // listPosts('all');
});

function createNewPost(){
    console.log('you clicked');
    // get the form input field then clear the field
    inputField = document.querySelector('#newpost-textarea')
    content = inputField.value;
    inputField.value = '';

    fetch('createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(content)
      })
    .then(function () {
        listPosts('all')
    })
    return false;
}

function listPosts(username){

    //  clear old posts to allow refresh
    document.querySelector('#all-posts'). innerHTML = '';
    fetch(`listposts/${username}`)
    .then(response => response.json())
    .then (posts => posts.forEach(function(n){
        newpost = document.createElement('div')
        newpost.classList.add('post')
        newpost.innerHTML = `<div><span class="post-username">${n.user}</span></div>
                            <div class="post-content">${n.content}</div>
                            <div class="post-created">${n.created}</div>
                            <div class="post-likes">Likes: ${n.likes}</div>`;
        if (username === 'all') {
            document.querySelector('#all-posts').append(newpost);
        }
        else {
            document.querySelector('#profile').append(newpost);
        }
    }))
    // then add the event listeners to the post username 
    .then(function(username) {
        document.querySelectorAll('.post-username').forEach((n) => n.onclick = showProfile);
    });


};

function showProfile(e) {
    // show the profile div and hide all others
    document.querySelector('#home').style.display = 'none';
    document.querySelector('#profile').style.display = 'block';
    // get the username clicked
    username = e.target.innerHTML;
    fetch(`get_followers/${username}`)
    .then(response => response.json())
    .then(function(data){
        console.log(data.followers + username)
        profileHeader = document.createElement('div');
        profileHeader.innerHTML = `<h2>${username}</h2>
                                    <div>followers: ${data.followers}</div>
                                    <div>following: ${data.following}</div>`;
        document.querySelector('#profile').append(profileHeader)
        listPosts(username);
    })
    
    

}
    // for each post, create a new post and append it to the containing div
