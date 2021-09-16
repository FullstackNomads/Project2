const loginFormHandler = async (event) => {
  event.preventDefault();
  console.log(`loginFormHandler FIRED`);


  // Collect values from the login form
  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      // document.location.replace('/profile');
    } else {
      alert(response.statusText);
    }
  }
};

const signupFormHandler = async (event) => {
  event.preventDefault();
  console.log(`signupFormHandler FIRED`)

  const first_name = document.querySelector('#firstName-signup').value.trim();
  const last_name = document.querySelector('#lastName-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const age = document.querySelector('#age').value.trim();
  const gender = document.querySelector('#gender').value.trim();
  const country = document.querySelector('#country').value.trim();
  const bio = document.querySelector('#bio').value.trim();
  const city = document.querySelector('#city').value.trim();

  let checkBoxes = document.querySelectorAll(`.form-check-input`)
  const interests = [];
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      interests.push(checkBoxes[i].value)
    }
    continue;
  }

  console.log(interest);

  if (first_name && last_name && email && password && age && gender && country && city) {
    const response = await fetch('/createProfile', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, email, password, age, gender, country, city, bio }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // document.location.replace('/createProfile'); // WANTING TO RENDER THIS ON THE ROUTE SIDE.
      console.log(`REQUEST OKAY`);
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector('.login-form')
  .addEventListener('submit', loginFormHandler);

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
