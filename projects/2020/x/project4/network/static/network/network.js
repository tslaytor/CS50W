document.addEventListener('DOMContentLoaded', function() {
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