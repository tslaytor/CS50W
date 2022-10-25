document.addEventListener('DOMContentLoaded', function() {
    listAllPosts();
    document.querySelector('#new-post').onsubmit = createNewPost;
    username = document.querySelectorAll('.post')
    username.forEach(function(username){
        username.addEventListener('click', function(){
            showProfile()
        })
        // n.onclick = showProfile
    } 
        
    )
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
        listAllPosts()
    })
    return false;
}

function listAllPosts(){
    //  get all posts
    document.querySelector('#all-posts'). innerHTML = '';
    fetch('listposts')
    .then(response => response.json())
    .then (posts => posts.forEach(function(n){
        newpost = document.createElement('div')
        newpost.classList.add('post')
        newpost.innerHTML = `<div class="post-username">${n.user}</div>
                            <div class="post-content">${n.content}</div>
                            <div class="post-created">${n.created}</div>
                            <div class="post-likes">Likes: ${n.likes}</div>`
        document.querySelector('#all-posts').append(newpost)
    }))


};

function showProfile() {
    console.log('hello')
}
    // for each post, create a new post and append it to the containing div
