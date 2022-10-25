document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new-post').onsubmit = createNewPost;
    listAllPosts();
     
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
        newpost.innerHTML = `<h3>${n.user}</h3>
                            <p>${n.content}</p>
                            <p>${n.created}</p>
                            <p>Likes: ${n.likes}</p>`
        document.querySelector('#all-posts').append(newpost)
    }))


};
    // for each post, create a new post and append it to the containing div
