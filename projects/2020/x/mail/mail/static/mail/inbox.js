
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

  // Add event listener to send button to run the send_email function when the form is submitted
  document.querySelector('form').onsubmit = send_mail;
}

function send_mail() {
  // Get the info from the compose form
  var recipients = document.querySelector('#compose-recipients').value;
  var subject = document.querySelector('#compose-subject').value;
  var body = document.querySelector('#compose-body').value;
// Make into an object
  var data = {
    'recipients': recipients,
    'subject': subject,
    'body': body
  }
// Send to emails API
  fetch('emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .catch((error) => {
    console.log('error', error);
  })
  load_mailbox('sent');
// Stops the form from sending automatically
  return false;
}

function load_mailbox(mailbox) {
   // Make a request to get sent emails
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(data => data.forEach(function(data){
    // Create a div for each email
      let email = document.createElement('div')
      email.className = 'email';
      // If read make background gray
      if (data.read) {
        email.classList.add('read');
      }
      // Fill email div with data
      email.innerHTML = `<h6>Sender: ${data.sender}</h6>
                          <h6>Subject: ${data.subject}</h6>
                          <h6>Time: ${data.timestamp}</h6>`
        // Create an archive button for emails in either inbox or archived mailbox
        if (mailbox === 'inbox' || mailbox === 'archive') {
          let button = document.createElement('button');
          button.className = 'button';
          mailbox === 'inbox' ? button.textContent = 'Archive' : button.textContent = 'Unarchive';
          button.onclick = function(e){
            e.stopPropagation(); 
            archive(data.id)
          };
          email.append(button);
        }
      // If an email is clicked, show email
      email.onclick = function(){showEmail(data.id)};
      // Add email to the list
      document.querySelector('#emails-view').append(email);
     
   }))

   // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
}

// The function called when the user clicks the archive buttons
function archive(id) {
  // Get the email to be archived
  fetch(`emails/${id}`)
  .then(data => data.json())
  .then(function (response) {
    // If archived, unarchive
    if (response.archived === true) {
      fetch('emails/' + id, {
        method: 'PUT',
        body: JSON.stringify({
          archived: false
        })
      })
      .then(function() {load_mailbox('inbox')})
    }
    // If not archived, archive
    else {
      fetch('emails/' + id, {
        method: 'PUT',
        body: JSON.stringify({
          archived: true
        })
      })
      .then(function() {load_mailbox('inbox')})
    }
    
  })
}

// The function called when the user clicks an email
function showEmail(id){
  // Get the email
  fetch('emails/' + id)
  .then(response => response.json())
  .then(function(data){
    // Clear the div of any previous content
    document.querySelector('#email-view').innerHTML = '';
    // Create a new div and fill it with the email data
    let email = document.createElement('div');
    email.className = 'email';
    email.innerHTML = `<div class='email_header'>
                        <h6>Sender: ${data.sender}</h6>
                        <h6>Recipient: ${data.recipients}</h6>
                        <h6>Subject: ${data.subject}</h6>
                        <h6>Time: ${data.timestamp}</h6>
                      </div>
                      <div class='email_body'>
                        <p> ${data.body}</p>
                      </div>`;
    // Add the reply button
    var reply_button = document.createElement('button');
    reply_button.className = 'button';
    reply_button.textContent = 'Reply';
    reply_button.onclick = () => reply(data.id);
    email.append(reply_button);
    // Mark the email as read
    fetch('emails/' + id, {
      method: 'PUT',
      body: JSON.stringify({
        read: true
      })
    })
    // Append the email, show the email view and hide other views
    .then(function(){
      document.querySelector('#email-view').append(email)
      document.querySelector('#email-view').style.display = 'block';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
    })
    
  })
};

// The function called  when the user clicks reply button
function reply(id){
  // Get the email
  fetch('emails/' + id)
  .then(response => response.json())
  .then(function(data){
    // Check if you need to add Re: to the beginning of the subject
    if (data.subject.slice(0, 3) !== 'Re:'){
      data.subject = 'Re: '+ data.subject;
    }
    // Set composition fields for recipients and subject
    document.querySelector('#compose-recipients').value = data.sender;
    document.querySelector('#compose-subject').value = data.subject;
    document.querySelector('#compose-body').value = `\nOn ${data.timestamp} ${data.sender} wrote:\n` + data.body;
    
    // Add event listener to send button to run the send_email function when the form is submitted
    document.querySelector('form').onsubmit = send_mail;

    // Show the compose view
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
  })
};
