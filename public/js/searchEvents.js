var searchInput = 'search_input';
var options = {
  types: ['(cities)'],
};

$(document).ready(function () {
  var autocomplete = new google.maps.places.Autocomplete((document.getElementById(searchInput)), options);

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
        console.log(results);
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


const searchEventsFormHandler = async (event) => {
  event.preventDefault();
  console.log(`searchEventsFormHandler FIRED`)
  // Added this try catch block because if the response has a length of 0 and nothing is returned, then it throws an exception and goes to the catch block which will render the no results found on the page and allow continued responsiveness of the app.
  try {
    const city = document.querySelector('#city').value.trim();
    const country = $('#country').val();

    const interests = [];
    let checkBoxes = document.querySelectorAll(`.interest`)
    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        interests.push(checkBoxes[i].value)
      }
      continue;
    }

    console.log(city, country);
    console.log(interests);

    api_url = "/api/events/search?"

    if (interests.length) {
      for (i = 0; i < interests.length; i++) {
        api_url += "&interests=" + interests[i];
      }
    }

    if (country) {
      api_url += "&country=" + country;
    }

    if (city) {
      api_url += "&city=" + city;
    }

    const response = await fetch(api_url, {
      method: 'GET'
    });
    const results = await response.json();
    console.log(`\n********RESULTS********\n`)
    console.log(results)
    console.log(`LENGTH OF RESULTS IS: ${results.length}`)

    var source = $("#events-template").html();
    var template = Handlebars.compile(source);
    var resultsdiv = $("#results");
    resultsdiv.empty();
    $.each(results, function (idx, val) {
      event = template(val);
      resultsdiv.append(event);
    });

    if (!results.length) {
      source = $("#noevents-template").html();
      template = Handlebars.compile(source);

      resultsdiv.append(template({}))
    }
  } catch (err) {
    var resultsdiv = $("#results");
    resultsdiv.empty();
    source = $("#noevents-template").html();
    template = Handlebars.compile(source);

    resultsdiv.append(template({}))
  }
};


document.querySelector('#search-events')
  .addEventListener('submit', searchEventsFormHandler);