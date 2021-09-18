const createEventFormHandler = async (event) => {
  event.preventDefault();
  console.log(`createEventFormHandler FIRED`)

  const event_name = document.querySelector('#event-name').value.trim();
  const date_time = document.querySelector('#date').value.trim(); // going to need to format this to fit the DB... OR change db so that it fits this.
  const point_of_interest = document.querySelector('#point-of-interest').value.trim();
  const city = document.querySelector('#city').value.trim();
  const country = document.querySelector('#country').value.trim();
  // const interest_id = document.querySelector('#interest').value.trim(); // need to establish if we are doing a single interest or multiple
  const country_name = document.querySelector('#country').value.trim();
  const description = document.querySelector('#description').value.trim();

  // It appears that the user.id for the logged in user is saved in the req.session at the /login route. So we should be able to pull that in from the server side at the route

  //commenting this out for now as the current event model has only one interest so the loop is not needed unless we want to change that.

  // const interests = [];
  // let checkBoxes = document.querySelectorAll(`.interest`)
  // for (let i = 0; i < checkBoxes.length; i++) {
  //   if (checkBoxes[i].checked) {
  //     interests.push(checkBoxes[i].value)
  //   }
  //   continue;
  // }

  if (event_name && date_time && point_of_interest && city && country && /*interest_id &&*/ country_name && description) {
    const response = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ event_name, date_time, point_of_interest, city, country, /*interest_id: interest_id,*/ country_name, description }),
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