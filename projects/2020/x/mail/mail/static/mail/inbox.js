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
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // add event listener to send button
  document.querySelector('form').onsubmit = send_mail;
  


  // when you click send, send the recepients, subject and body in a post request to the /emails route
  function send_mail() {
    var recipients = document.querySelector('#compose-recipients').value
    var subject = document.querySelector('#compose-subject').value
    var body = document.querySelector('#compose-body').value

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
      console.log(data)
    })
    .catch((error) => {
      console.log('error', error)
    })
    load_mailbox('sent')

    return false;
  }
}

function load_mailbox(mailbox) {

   // make a request to get sent emails
   fetch(`emails/${mailbox}`)
   .then(response => response.json())
   .then(function(data) {
     for(let i = 0; i < data.length; i++){
       console.log('yo')
       let email = document.createElement('div');
       email.className = 'email'
       email.innerHTML = `<h6>Sender: ${data[i].sender}</h6>
                           <h6>Subject: ${data[i].subject}</h6>
                           <h6>Time: ${data[i].timestamp}</h6>`
       document.querySelector('#emails-view').append(email)
       
     }
   })
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

 
}
  

