document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new-post').onsubmit = createNewPost;
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

