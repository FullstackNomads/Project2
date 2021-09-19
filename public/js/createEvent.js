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
        results.forEach(function(element){
          element.address_components.forEach(function(element2){
            element2.types.forEach(function(element3){
              switch(element3){
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



const createEventFormHandler = async (event) => {
  event.preventDefault();
  console.log(`createEventFormHandler FIRED`)

  const event_name = document.querySelector('#event-name').value.trim();
  const date_time = document.querySelector('#date').value.trim(); // going to need to format this to fit the DB... OR change db so that it fits this.
  const city = document.querySelector('#city').value.trim();
  const country = document.querySelector('#country').value.trim();
  const location = document.querySelector('#search_input').value.trim();
  const interest_id = document.querySelector('#interest').value.trim();

  const description = document.querySelector('#description').value.trim();

  // It appears that the user.id for the logged in user is saved in the req.session at the /login route. So we should be able to pull that in from the server side at the route

  let eventData = {
    event_name,
    date_time,
    location,
    city,
    country,
    interest_id,
    description
  };

  if (event_name && date_time && location && city && country && interest_id && description) {
    const response = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
      headers: { 'Content-Type': 'application/json' },
    });

    
    if (response.ok) {
      console.log(`REQUEST OKAY`);
      const results = await response.json();
      document.location.replace('/events/'+ results.id); 
    } else {
      alert(response.statusText);
    }
  } else {
    alert(`Please fill out all forms`)
  }
};


document.querySelector('#create-event')
  .addEventListener('submit', createEventFormHandler);