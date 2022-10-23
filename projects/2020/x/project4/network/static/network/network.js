document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new-post').onsubmit = createNewPost;
    listAllPosts();
     
});

function createNewPost(){
    console.log('you clicked');
    // get the form input field
    content = document.querySelector('#newpost-textarea').value;
    fetch('createpost', {
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
    fetch('listposts')
    .then(response => response.json())
    .then(function(data) {
        console.log("data: " + data)
        data = JSON.parse(data); 
        console.log("data after parsing: " + data)
        data.forEach(function(n){
            console.log(n.fields.content)
            newpost = document.createElement('div')
            newpost.innerHTML = `<h3>${n.fields.user}</h3>
                                <p>${n.fields.content}`
            document.querySelector('#all-posts').append(newpost)
        })
    });
};
    // for each post, create a new post and append it to the containing div
