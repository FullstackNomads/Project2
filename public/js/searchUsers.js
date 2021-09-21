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

const searchUsersFormHandler = async (event) => {
  event.preventDefault();
  console.log(`searchUsersFormHandler FIRED`)

  const city = document.querySelector('#city').value.trim();
  const country = $('#country').val();
  const gender = $("#gender").val();

  const interests = [];
  let checkBoxes = document.querySelectorAll(`.interest`)
  for (let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      interests.push(checkBoxes[i].value)
    }
    continue;
  }

  console.log(city, country, gender);
  console.log(interests);

  api_url = "/api/users/search?"

  if (interests.length) {
    for (i = 0; i < interests.length; i++) {
      api_url += "&interests=" + interests[i];
    }
  }

  if (gender) {
    api_url += "&gender=" + gender;
  }

  if (city) {
    api_url += "&city=" + city;
  }

  if (country) {
    api_url += "&country=" + country;
  }


  console.log(`\n\n${api_url}\n\n`);

  const response = await fetch(api_url, {
    method: 'GET'
  });
  const results = await response.json();

  var source = $("#users-template").html();
  var template = Handlebars.compile(source);
  var resultsdiv = $("#results");
  resultsdiv.empty();
  console.log(results);
  $.each(results, function (idx, val) {
    event = template(val);
    resultsdiv.append(event);
  });

  document.querySelector(`hr`).scrollIntoView({ behavior: "smooth" })

  if (results.length == 0) {
    source = $("#nousers-template").html();
    template = Handlebars.compile(source);

    resultsdiv.append(template({}))
  }

};


document.querySelector('#search-profile')
  .addEventListener('submit', searchUsersFormHandler);