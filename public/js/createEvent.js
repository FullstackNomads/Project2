const createEventFormHandler = async (event) => {
  event.preventDefault();
  console.log(`createEventFormHandler FIRED`)

  const event_name = document.querySelector('#event-name').value.trim();
  const date_time = document.querySelector('#date').value.trim(); // going to need to format this to fit the DB... OR change db so that it fits this.
  const point_of_interest = document.querySelector('#point-of-interest').value.trim();

  const street_number = document.querySelector('#street_number').value.trim();
  const unit_number = document.querySelector('#unit_number').value.trim();
  const street_name = document.querySelector('#street_name').value.trim();
  const city = document.querySelector('#city').value.trim();
  const state_province = document.querySelector('#state_province').value.trim();
  const postal_code = document.querySelector('#postal_code').value.trim();
  const country = document.querySelector('#country').value.trim();

  const interest_id = document.querySelector('#interest').value.trim();

  const description = document.querySelector('#description').value.trim();

  // It appears that the user.id for the logged in user is saved in the req.session at the /login route. So we should be able to pull that in from the server side at the route

  let eventData = {
    event_name,
    date_time,
    point_of_interest,
    street_number,
    unit_number,
    street_name,
    city,
    state_province,
    postal_code,
    country,
    interest_id,
    description
  };

  if (event_name && date_time && point_of_interest && city && country && interest_id && description) {
    const response = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/userDashboard'); // WANTING TO RENDER THIS ON THE ROUTE SIDE?
      console.log(`REQUEST OKAY`);
    } else {
      alert(response.statusText);
    }
  } else {
    alert(`Please fill out all forms`)
  }
};


document.querySelector('#create-event')
  .addEventListener('submit', createEventFormHandler);