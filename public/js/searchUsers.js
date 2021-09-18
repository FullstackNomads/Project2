const searchUsersFormHandler = async (event) => {
    event.preventDefault();
    console.log(`searchUsersFormHandler FIRED`)
  
    const city = document.querySelector('#city').value.trim();
    const country = $('#country').val();
    const interests = $('#interests').val();
    const gender = $("#gender").val();

    console.log(city, country, gender, interests);

    api_url = "/api/users/search?"


    if (gender) {
      api_url += "gender=" + gender;
    }

    if (city){
      api_url += "&city=" + city;
    }

    if(country){
      api_url += "&country=" + country;
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

    var source = $("#users-template").html();
    var template = Handlebars.compile(source);
    var resultsdiv = $("#results");
    resultsdiv.empty();
    $.each(results, function(idx, val){
        event = template(val);
        resultsdiv.append(event);
    });   

  };
  
  
  document.querySelector('#search-profile')
    .addEventListener('submit', searchUsersFormHandler);