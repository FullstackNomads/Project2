const createEventHandler = async (event) => {
    event.preventDefault();
    console.log(`createEventHandler FIRED`)
  
    const event_name = document.querySelector('#event-name').value.trim();
    const date_time = document.querySelector('#date').value
    const description = document.querySelector('#description').value.trim();
    const point_of_interest = document.querySelector('#point-of-interest').value.trim();
    const country = document.querySelector('#country').value.trim();
    const city = document.querySelector('#city').value.trim();
  
    const interests = [];
    let checkBoxes = document.querySelectorAll(`.interest`)
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        interests.push(checkBoxes[i].value)
      }
      continue;
    }
  
    if (event_name && date_time && description && point_of_interest && country && city) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ event_name, date_time, description, point_of_interest, country, city, interests: interests }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        console.log(`REQUEST OKAY`);
      } else {
        alert(response.statusText);
      }
    } else {
      alert(`Please fill out all forms`)
    }
  };
  
  
  document.querySelector('#create-event')
    .addEventListener('submit', createEventHandler);