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
  event.preventDefault();
  console.log(`signupFormHandler FIRED`)

  try {
    // This sets it up so it uses the same MIME a form would use if the encoding type were set to "multipart/form-data".
    const fd = new FormData();

    // console.log(profilePicture);

    const profile_picture = document.querySelector(`#profilePicture`).files[0];
    fd.append("profile_picture", profile_picture)


    // Added temporarily to prevent creating a ton of new users while testing profile picture functionality
    // return;

    const first_name = document.querySelector('#firstName-signup').value.trim();
    fd.append('first_name', first_name)
    const last_name = document.querySelector('#lastName-signup').value.trim();
    fd.append('last_name', last_name)
    const email = document.querySelector('#email-signup').value.trim();
    fd.append('email', email)
    const password = document.querySelector('#password-signup').value.trim();
    fd.append('password', password)
    const age = document.querySelector('#age').value.trim();
    fd.append('age', age)
    const gender = document.querySelector('#gender').value.trim();
    fd.append('gender', gender)

    const location = document.querySelector('#search_input').value.trim();
    fd.append('location', location)
    const country_name = document.querySelector('#country').value.trim();
    fd.append('country_name', country_name)
    const city_name = document.querySelector('#city').value.trim();
    fd.append('city_name', city_name)

    // const interest = document.querySelector('#interest').value.trim();
    // console.log(interest)
    // fd.append('interest', interest)
    const bio = document.querySelector('#bio').value.trim();
    fd.append('bio', bio)

    let interests = document.getElementById(`interest`)
    for (let option of interests) {
      if (option.selected) {
        fd.append('interests', option.value)
      }
      continue;
    }

    // const interests = [];
    // let interests = document.querySelectorAll(`.interest`)
    // console.log(interests)
    // for (let i = 0; i < interests.length; i++) {
    //   console.log(interests[i])
    //   if (interests[i].selected) {
    //     // interests.push(checkBoxes[i].value)
    //     fd.append('interests', interests[i].value)
    //   }
    //   continue;
    // }

    // fd.append('interests', interests)

    // console.log(fd.getAll())
    console.log(fd.getAll(`first_name`))
    console.log(fd.getAll(`last_name`))
    console.log(fd.getAll(`email`))
    console.log(fd.getAll(`password`))
    console.log(fd.getAll(`age`))
    console.log(fd.getAll(`gender`))
    console.log(fd.getAll(`location`))
    console.log(fd.getAll(`country_name`))
    console.log(fd.getAll(`city_name`))
    console.log(fd.getAll(`bio`))
    console.log(fd.getAll(`interests`))
    console.log(fd.getAll(`profile_picture`))


    // if (first_name && last_name && email && password && age && gender && country_name && city_name) {
    const response = await fetch('/api/users', {
      method: 'POST',
      body: fd,
      // headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.ok) {
      document.location.replace('/userDashboard'); // WANTING TO RENDER THIS ON THE ROUTE SIDE.
      console.log(`REQUEST OKAY`);
    } else {
      alert(response.statusText);
    }
    // } else {
    //   alert(`Please fill out all forms`)
    // }
  } catch (err) {
    console.log(err);
  }
};


document.querySelector('#create-profile')
  .addEventListener('submit', signupFormHandler);