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


const searchEventsFormHandler = async (event) => {
    event.preventDefault();
    console.log(`searchEventsFormHandler FIRED`)
  
    const city = document.querySelector('#city').value.trim();
    const pointofinterest =  $('#pointofinterest').val();
    const country = $('#country').val();
    const interests = $('#interests').val();

    console.log(city, country, pointofinterest, interests);

    api_url = "/api/events/search?"


    if (country) {
      api_url += "country=" + country;
    }

    if (city){
      api_url += "&city=" + city;
    }

    if(pointofinterest){
      api_url += "&pointofinterest=" + pointofinterest;
    }

    if(interests){
      for(i = 0; i < interests.length; i++){
        api_url += "&interests=" + interests[i];
      }
    }

    const response = await fetch(api_url, {
      method: 'GET'
    });
    const results = await response.json();

    var source = $("#events-template").html();
    var template = Handlebars.compile(source);
    var resultsdiv = $("#results");
    resultsdiv.empty();
    $.each(results, function(idx, val){
        event = template(val);
        resultsdiv.append(event);
    });   
  };

  
document.querySelector('#search-events')
  .addEventListener('submit', searchEventsFormHandler);