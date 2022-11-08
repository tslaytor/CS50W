document.addEventListener('DOMContentLoaded', function() {

    // listener for creating new post
    const ele_exists = document.getElementsByClassName('new-post').length > 0
    if (ele_exists){
        document.querySelector('.new-post').onsubmit = createNewPost;
    }
    // listener for editing posts
    const edit_button = document.getElementsByClassName('edit')
    if (edit_button.length > 0) {
        
        Array.from(edit_button).forEach(item => item.onclick = edit)
    }
    // listener for profile pages
    document.querySelectorAll('.post-username').forEach((n) => 
        n.onclick = function(e) { 
            window.location.href = `profile/${e.target.innerHTML}`
        }
    )
    // listener for likes
    document.querySelectorAll('.like-button').forEach((n) =>
        n.onclick = like
    );
})

// create post function - called when new post form is submitted
function createNewPost(){
    inputField = document.querySelector('#newpost-textarea')
    content = {
        'content': inputField.value,
        // post_id false to show this is new post, not editing an existing post
        'post_id': false
    };
    // reset the inputField to blank after submitting
    inputField.value = '';
    // post data to the "createpost" function in views.py
    fetch('createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin',
        body: JSON.stringify(content)
      })
    .then(response => response.json())
    .then(function (data) {
        console.log(data)
        if (data.not_logged_in){
            console.log('got here')
            window.location.href = '/login'
        }
        else {
            //refresh the page
            console.log(data)
            window.location.href = ''
        }
        
    })
    return false;
}

// function to follow/unfollow another user
function follow(profile){
    fetch('../follow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin',
        body: JSON.stringify({'profile': profile})
    })
    .then(response => response.json())
    .then(function(data) {
        if (data.not_logged_in){
            window.location.href = '/login'
        }
        else {
            document.querySelector('#followers').innerHTML = data.total_followers
            document.querySelector('.follow-button').innerHTML = data.set_button_to_unfollow ? "Unfollow" : "Follow";
        }
        
    })
}

function edit(){
    // get the content area of post, and make a new textarea for editing
    var contentarea = this.parentElement.querySelector('.post-content')
    var textarea = document.createElement('textarea')
    // set the content of textarea to the same as the post
    textarea.value = contentarea.innerHTML.trim();
    // replace the content area with textarea 
    this.parentElement.replaceChild(textarea, contentarea)
    // add class to textarea
    textarea.classList.add('post-content')    
    // set the autofocus
    const l = textarea.value.length
    textarea.focus()
    textarea.setSelectionRange(l,l);

    // make a save button and replace the edit button with it
    const save_edit = document.createElement('div');
    save_edit.innerHTML = 'save'
    save_edit.classList.add('save_edit');
    const edit = this.parentElement.querySelector('.edit')
    this.parentElement.replaceChild(save_edit, edit)

    // when you click the save button, save the edited post
    save_edit.onclick = function(){
        // get the post id
        const post_id = this.parentElement.querySelector('.post-id').innerHTML
        console.log(post_id)
        updated_post_content = this.parentElement.querySelector('.post-content').value;
        // post data to the "createpost" function in views.py
        fetch('/createpost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                'content': updated_post_content,
                'post_id': post_id
            })
          })
        .then(function () {
            console.log(post_id)
            console.log("yeah")
            window.location.href = ''
            
        })
        return false;
    }
}

function like(){
    const post_id = this.parentElement.parentElement.querySelector('.post-id').innerHTML
    const this_element = this
    fetch(`/liked/${post_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin'
      })
    .then(response => response.json())
    .then(function (data) {
        if (data.not_logged_in){
            window.location.href = '/login'
        }
        else if (data.liked){
            // change innterHTML to red heart and add 1 to likes count
            var counter = parseInt(this_element.parentElement.querySelector('.likes-counter').innerHTML)
            this_element.parentElement.innerHTML = `<i class="fas fa-heart like-button" style="color: red;"></i> <span class="likes-counter">${counter + 1}</span>`
        }
        else {
            // change innterHTML to empty heart and subtract 1 from likes count
            var counter = parseInt(this_element.parentElement.querySelector('.likes-counter').innerHTML)
            this_element.parentElement.innerHTML = `<i class="fa-regular fa-heart like-button"></i> <span class="likes-counter">${counter - 1}</span>`
        }
    })
    .then(function () {
        document.querySelectorAll('.like-button').forEach(function (n){
            n.onclick = like
        })
    })
}