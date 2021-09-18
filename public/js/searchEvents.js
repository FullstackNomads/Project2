
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