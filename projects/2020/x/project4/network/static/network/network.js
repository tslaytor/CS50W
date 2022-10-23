document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new-post').onsubmit = createNewPost;
    listAllPosts();
     
});

function createNewPost(){
    console.log('you clicked');
    // get the form input field
    content = document.querySelector('#newpost-textarea').value;
    fetch('post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(content)
      })
   return false;
    
}

function listAllPosts(){
    //  get all posts

    // for each post, create a new post and append it to the containing div
}
