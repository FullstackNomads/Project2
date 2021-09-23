var searchInput = 'search_input';

$(document).ready(function () {
  var autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), {});

  google.maps.event.addListener(autocomplete, 'place_changed', function () {
    var near_place = autocomplete.getPlace();
    var latitude = near_place.geometry.location.lat();
    var longitude = near_place.geometry.location.lng();
    var latlng = new google.maps.LatLng(latitude, longitude);
    var geocoder = geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        var country = null;
        var city = null;
        results.forEach(function (element) {
          element.address_components.forEach(function (element2) {
            element2.types.forEach(function (element3) {
              switch (element3) {
                case 'country':
                  country = element2.long_name;
                  break;
                case 'locality':
                  city = element2.long_name;
                  break;
                case 'city':
                  city = element2.long_name;
                  break;
              }
            })
          });
        });

        document.getElementById('city').value = city;
        document.getElementById('country').value = country;
      }
    });
  });
});


const signupFormHandler = async (event) => {
  // event.preventDefault();
  console.log(`signupFormHandler FIRED`)

  const profilePictureUpload = document.querySelector(`#profilePicture`).files[0];

  // This sets it up so it uses the same MIME a form would use if the encoding type were set to "multipart/form-data".
  const profilePicture = new FormData();
  profilePicture.append("profilePicture", profilePictureUpload)

  console.log(profilePicture);



  // Added temporarily to prevent creating a ton of new users while testing profile picture functionality
  return;

  const first_name = document.querySelector('#firstName-signup').value.trim();
  const last_name = document.querySelector('#lastName-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const age = document.querySelector('#age').value.trim();
  const gender = document.querySelector('#gender').value.trim();
  const country_name = document.querySelector('#country').value.trim();
  const bio = document.querySelector('#bio').value.trim();
  const city_name = document.querySelector('#city').value.trim();

  const interests = [];
  let checkBoxes = document.querySelectorAll(`.interest`)
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      interests.push(checkBoxes[i].value)
    }
    continue;
  }


  if (first_name && last_name && email && password && age && gender && country_name && city_name) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({ first_name, last_name, email, password, age, gender, country_name, city_name, bio, interests: interests }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      document.location.replace('/userDashboard'); // WANTING TO RENDER THIS ON THE ROUTE SIDE.
      console.log(`REQUEST OKAY`);
    } else {
      alert(response.statusText);
    }
  } else {
    alert(`Please fill out all forms`)
  }
};


// document.querySelector('#create-profile')
//   .addEventListener('submit', signupFormHandler);