document.addEventListener('DOMContentLoaded', function() {

    const ele_exists = document.getElementsByClassName('new-post').length > 0
    if (ele_exists){
        document.querySelector('.new-post').onsubmit = createNewPost;
    }

    const edit_button = document.getElementsByClassName('edit')
    if (edit_button.length > 0) {
        
        Array.from(edit_button).forEach(item => item.onclick = edit)
    }
    
    document.querySelectorAll('.post-username').forEach((n) => 
        n.onclick = function(e) { 
            window.location.href = `profile/${e.target.innerHTML}`
        }
    )
});

function createNewPost(){
    inputField = document.querySelector('#newpost-textarea')
    content = {
        'content': inputField.value,
        'post_id': false
    };
    inputField.value = '';

    fetch('createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin',
        body: JSON.stringify(content)
      })
    .then(function () {
        window.location.href = ''
    })
    return false;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function follow(profile){
    // data = {'profile': profile}
    fetch('../follow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        credentials: 'same-origin',
        body: JSON.stringify({'profile': profile})
    })
    .then(data => data.json())
    
    .then(function(response) {
        document.querySelector('#followers').innerHTML = response.total_followers
        document.querySelector('.follow-button').innerHTML = response.set_button_to_unfollow ? "Unfollow" : "Follow";
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
