document.addEventListener('DOMContentLoaded', function() {

    const ele_exists = document.getElementsByClassName('new-post').length > 0
    if (ele_exists == null){
        document.querySelector('.new-post').onsubmit = createNewPost;
    }

    const edit_button = document.getElementsByClassName('edit')
    if (edit_button.length > 0) {
        
        Array.from(edit_button).forEach(item => item.onclick = edit)
    }
    
    document.querySelectorAll('.post-username').forEach((n) => 
        n.onclick = function(e) { 
            console.log("clicked the username")
            window.location.href = `profile/${e.target.innerHTML}`
        }
    )
});

function createNewPost(){
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
    // console.log('you are in the edit function')
    // const parent = this.parentElement
    var contentarea = this.parentElement.querySelector('.post-content')
    var textarea = document.createElement('textarea')
    textarea.value = contentarea.innerHTML.trim();

    this.parentElement.replaceChild(textarea, contentarea)

    textarea.classList.add('post-content')
    // this.parentElement.classList.add('being_edited')
    
    // set the autofocus
    const l = textarea.value.length
    textarea.focus()
    textarea.setSelectionRange(l,l);

    const save_edit = document.createElement('div');
    save_edit.innerHTML = 'save'
    save_edit.classList.add('save_edit');
    const edit = this.parentElement.querySelector('.edit')
    this.parentElement.replaceChild(save_edit, edit)

    save_edit.onclick = function(){
        // get the post id
        const post_id = this.parentElement.querySelector('.post-id').innerHTML
        console.log(post_id)
        textarea.value = this.parentElement.querySelector('.post-content').value.trim();
        fetch('createpost', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrftoken
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                'content': textarea.value,
                'post_id': post_id
            })
          })
        .then(function () {
            // window.location.href = ''
            
        })
        return false;
    }

}
