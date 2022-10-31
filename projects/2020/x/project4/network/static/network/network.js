document.addEventListener('DOMContentLoaded', function() {
    console.log("it loaded")
    document.querySelector('#new-post').onsubmit = createNewPost;
    document.querySelectorAll('.post-username').forEach((n) => 
        n.onclick = (e) => 
        window.location.href = `profile/${e.target.innerHTML}`)
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

function follow(user, profile, following){
    console.log('hi')
    // e.preventDefault();
    // const csrftoken = getCookie('csrftoken');
    console.log('bye ' + csrftoken)
    // if (following) {
        // unfollow the profile
        data = {'user': user, 'profile': profile, 'following': following}
        fetch('../follow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'HTTP_X_CSRFTOKEN': csrftoken
            },
            credentials: 'same-origin',
            body: JSON.stringify(data)
        })
        .then(function () {
            console.log('you are here')
            window.location.href = ''
            
        })
    // }
    // else {
    //     // follow the profile
    // }
}

