const createMessageFormHandler = async (event) => {
    event.preventDefault();
    console.log(`createMessageFormHandler FIRED`)
  
    const message = document.querySelector('#message').value.trim();
    const receiver_id = window.location.pathname.split('/').at(-1);
    
    let messageData = {
      message,
      receiver_id
    };
  
    if (message && receiver_id) {
      const response = await fetch('/api/messages/create', {
        method: 'POST',
        body: JSON.stringify(messageData),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log(`REQUEST OKAY`);
        location.reload();
      } else {
        alert(response.statusText);
      }
    }
  };
  
  
  document.querySelector('#create-message')
    .addEventListener('submit', createMessageFormHandler);