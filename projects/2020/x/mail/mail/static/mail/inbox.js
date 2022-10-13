
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // add event listener to send button to run the send_email function when the form is submitted
  document.querySelector('form').onsubmit = send_mail;
}

function send_mail() {
  var recipients = document.querySelector('#compose-recipients').value;
  var subject = document.querySelector('#compose-subject').value;
  var body = document.querySelector('#compose-body').value;

  var data = {
    'recipients': recipients,
    'subject': subject,
    'body': body
  }

  fetch('emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch((error) => {
    console.log('error', error);
  })
  load_mailbox('sent');

  return false;
}

function load_mailbox(mailbox) {
   // make a request to get sent emails
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(data => data.forEach(function(data){
    console.log('you are here' + data);
    console.log(data);
      let email = document.createElement('div')
      email.className = 'email';
      if (data.read) {
        email.classList.add('read');
      }
      email.onclick = function(){showEmail(data.id)};

      email.innerHTML = `<h6>Sender: ${data.sender}</h6>
                          <h6>Subject: ${data.subject}</h6>
                          <h6>Time: ${data.timestamp}</h6>`
        // create a button for emails in either inbox or archived
        if (mailbox === 'inbox' || mailbox === 'archive') {
          let button = document.createElement('button');
          mailbox === 'inbox' ? button.textContent = 'Archive' : button.textContent = 'Unarchive';
          button.onclick = function(e){
            console.log(e);
            e.stopPropagation(); 
            archive(data.id)
          };
          email.append(button);
        }
      document.querySelector('#emails-view').append(email);
     
   }))

   // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
}

function archive(id) {
  fetch(`emails/${id}`)
  .then(data => data.json())
  .then(function (response) {
    if (response.archived === true) {
      console.log('setting to false')
      fetch('emails/' + id, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false
        })
      })
      .then(function() {load_mailbox('inbox')})
    }

    else {
      console.log('setting to true')
      fetch('emails/' + id, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
        })
      })
      .then(function() {load_mailbox('inbox')})
    }
    
  })
  console.log('are we here yet?');
}

function showEmail(id){
  fetch('emails/' + id)
  .then(response => response.json())
  .then(function(data){
    // clear the div of any previous content
    document.querySelector('#email-view').innerHTML = '';
    // create a new div and fill it with the email data
    let email = document.createElement('div');
    email.innerHTML = `<h6>Sender: ${data.sender}</h6>
                        <h6>Recipient: ${data.recipient}</h6>
                        <h6>Subject: ${data.subject}</h6>
                        <h6>Time: ${data.timestamp}</h6>
                        <p> ${data.body}</p>`;
    var reply_button = document.createElement('button');
    reply_button.textContent = 'Reply';
    console.log(data.id);
    reply_button.onclick = () => reply(data.id);
    email.append(reply_button);
    // mark the email as read
    fetch('emails/' + id, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })
    .then(function(){
      document.querySelector('#email-view').append(email)
      document.querySelector('#email-view').style.display = 'block';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
    })
    
  })
}
  
function reply(id){
  console.log("hello hello hello " + id);
  fetch('emails/' + id)
  .then(response => response.json())
  .then(function(data){
    console.log(data.sender);
    if (data.subject.slice(0, 3) !== 'Re:'){
      data.subject = 'Re: '+ data.subject;
    }
  
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
  
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = data.sender;
    document.querySelector('#compose-subject').value = data.subject;
    document.querySelector('#compose-body').value = `On ${data.timestamp} ${data.sender} wrote:\n` + data.body;
  
    // add event listener to send button to run the send_email function when the form is submitted
    document.querySelector('form').onsubmit = send_mail;
  
  })


  
}
