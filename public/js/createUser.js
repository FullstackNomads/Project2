const signupFormHandler = async (event) => {
  event.preventDefault();
  console.log(`signupFormHandler FIRED`)

  const first_name = document.querySelector('#firstName-signup').value.trim();
  const last_name = document.querySelector('#lastName-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const age = document.querySelector('#age').value.trim();
  const gender = document.querySelector('#gender').value.trim();



  const country_name = document.querySelector('#country').value.trim();



  const bio = document.querySelector('#bio').value.trim();
  const city_name = document.querySelector('#city').value.trim();

  let checkBoxes = document.querySelectorAll(`.form-check-input`)
  const interests = [];
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      interests.push(checkBoxes[i].value)
    }
    continue;
  }

  console.log(`\n\n`);
  console.log(country_name);
  console.log(`\n\n`);

  if (first_name && last_name && email && password && age && gender && country_name && city_name) {
    const response = await fetch('/createProfile', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, email, password, age, gender, country_name, city_name, bio, interests: interests }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // document.location.replace('/createProfile'); // WANTING TO RENDER THIS ON THE ROUTE SIDE.
      console.log(`REQUEST OKAY`);
    } else {
      alert(response.statusText);
    }
  } else {
    alert(`Please fill out all forms`)
  }
};


document.querySelector('#create-profile')
  .addEventListener('submit', signupFormHandler);