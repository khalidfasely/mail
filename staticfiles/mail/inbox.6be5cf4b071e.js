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
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  //By me
  // Get all emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    //console.log(emails);
    
    // display each email
    var i;
    const div_glo = document.querySelector('#emails-view');
    for (i = 0; i < emails.length; i++) {
      //console.log(emails[i]);
      const div = document.createElement('div');

      if (!emails[i].read){
        div.innerHTML = `<div class="unread-email" onclick=view_email(${emails[i].id})>
          <div>
            <b>${emails[i].sender}</b> 
            <span class="col">${emails[i].subject}</span> 
          </div>
          <span class="timestamp col">${emails[i].timestamp}</span
          </div>`;
      } else {
        div.innerHTML = `<div class="read-email" onclick=view_email(${emails[i].id})>
          <div>
            <b>${emails[i].sender}</b> 
            <span class="col">${emails[i].subject}</span>
          </div>
          <span class="timestamp col">${emails[i].timestamp}</span>
          </div>`;
      }
      
      //onclick=view_email(${emails[i].id})
      // Do a function that listen to the click on emails in place of put it in the html direct
      div_glo.append(div);
    }

    // ... do something else with emails ...
  })
  .catch(error => {
    console.log('Error:', error);
  });
  
}


function view_email(id){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  //Set the email-view content to empty
  document.querySelector('#email-view').innerHTML = '';


  // Get the details about an email
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    // Display email content
    const email_content = document.createElement('div');
    email_content.innerHTML = `
    <div class="email">
      <nav id="nav_info" class="email-infos">
        <nav><b>From:</b> <span class="font">${email.sender}</span></nav>
        <nav><b>To:</b> <span class="font">${email.recipients}</span></nav>
        <nav><b>Subject:</b> <span class="font">${email.subject}</span></nav>
        <nav><b>At:</b> <span class="font">${email.timestamp}</span></nav>
      </nav>
      <nav class="pad_t">
        <span class="font email-body">${email.body}</span>
      </nav>
    </div>
    `;

    
    document.querySelector('#email-view').append(email_content);
    // ... do something else with email ...
    
    // Use the user information that sends from the html
    const user_email = JSON.parse(document.getElementById('user_id').textContent);

    //Check if the email is the send mailbox(if not display a button that provide to archive or unarchove the email)
    if (user_email !== email.sender) {
      const parent = document.querySelector('.pad_t');
      const child = document.createElement('div');
      
      // Check if the email is archive or not
      if (!email.archived){
        child.innerHTML = `<nav class="pad_t">
          <button type="button" class="archive-btn" onclick=archive(${email.id})>Archive</button>
          </nav>`;
      } else {
        child.innerHTML = `<nav class="pad_t">
          <button type="button" class="unarchive-btn" onclick=archive(${email.id})>Unarchive</button>
          </nav>`;
      }

      const parent_re = document.querySelector('#nav_info');
      const child_re = document.createElement('div');

      child_re.innerHTML = `<nav class="pad_t">
        <button type="button" class="replay-btn" onclick=replay(${email.id})>Replay</button>
        </nav>`;

      parent.append(child);
      parent_re.append(child_re);
    }
    
    
    // Turn the email(read) to true
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })
  });
}

function archive(id){

  // Turn the email(archive) to true or false depandent on the email
  if (event.target.textContent === 'Archive') {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: true
      })
    })
  } else {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: false
      })
    })
  }
  
  // Load the inbox
  //load_mailbox('inbox');
  setTimeout(function(){ load_mailbox('inbox'); }, 100)
};

function replay(id) {
  
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  
  const recipients_re = document.querySelector('#compose-recipients');
  const subject_re = document.querySelector('#compose-subject');
  const body_re = document.querySelector('#compose-body');

  //Take information from the email using fetch
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {

    recipients_re.value = email.sender;
    //recipients_re.disabled = true;

    // Check if the subject already has the Re: 
    if (email.subject.substring(0, 4) === 'Re: ') {
      subject_re.value = email.subject;
    } else {
      subject_re.value = `Re: ${email.subject}`;
    }
    //subject_re.disabled = true;

    if (email.body.substring(0, 2) === 'On') {
      body_re.value = stripHtml(`${email.body}\n\n<br>=> : `);
    } else {
      body_re.value = stripHtml(`On ${email.timestamp} ${email.sender} wrote: \n${email.body}\n\n <br>=> : `);
    }
  });

  //
  return false;
}

function stripHtml(html){
  // Create a new div element
  var temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

//Send email
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#compose-form').addEventListener('submit', function(e){

    
    const recipientstest = document.querySelector('#compose-recipients').value;
    const recipients = recipientstest.replace(/\n\r?/g, '<br />');
    const subjecttest = document.querySelector('#compose-subject').value;
    const subject = subjecttest.replace(/\n\r?/g, '<br />');
    const bodytest = document.querySelector('#compose-body').value;
    const body = bodytest.replace(/\n\r?/g, '<br />');
    
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: `${recipients}`,
          subject: `${subject}`,
          body: `${body}`
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        //console.log(result);
    })
    // Catch any errors and log them to the console
    .catch(error => {
        console.log('Error:', error);
    });
    //location.reload();
    //load_mailbox('sent');
    setTimeout(function(){ load_mailbox('sent'); }, 100)

    //To stop the form from submitting
    e.preventDefault();
    
  })

  return false;
  
});