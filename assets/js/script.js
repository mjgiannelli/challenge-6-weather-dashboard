// ** START PSEUDO CODE (subject to change) ** //

// when user searches for a city (clicks search button):
//  - store the user input in a variable
//  - use a fetch api to get the current & future conditions for that city
//  - store that city into local storage
// use the data from fetch to populate in the current-weather container:
//  - name and today's date as M/DD/YYY
//  - temp
//  - wind
//  - humidity
//  - UV index (color coded for favorable(green), moderate(yellow), or severe(red))
// use the data from fetch to populate in the five-day container:
//  - date
//  - an icon reprsentation of weather conditions
//  - the temp
//  - wind speed
//  - humidity
// use data in local.storage to create a button under the <hr> in search area for city history
//  - when you click the button it displays the current and future conditions for that city

// ** END PSEUDO CODE (subject to change) ** //

// START GLOBAL VARIABLES //
var openWeatherApiKey = '26ba3a7e283acb9cd1e8665c6c3b319a';
var openWeatherCoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var userFormEL = $('#city-search');
var cityInputEl = $('#city');

// END GLOBAL VARIABLES //

//function to get weather data from apiUrl
function getCoordinates(city) {
    var apiUrl = openWeatherCoordinatesUrl + city + '&appid=' + openWeatherApiKey;

    fetch(apiUrl)
        .then(function (coordinateResponse) {
            if (coordinateResponse.ok) {
                coordinateResponse.json().then(function (data) {
                    var cityLatitude = data.coord.lat;
                    var cityLongitude = data.coord.lon;

                    console.log(cityLatitude + ', ' + cityLongitude);
                });
            } else {
                alert('Error: Open Weather could not find city')
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Open Weather');
        });
}

function submitCitySearch(event) {
    event.preventDefault();

    //get value from user input
    var city = cityInputEl.val().trim();

    if (city) {
        getCoordinates(city);
        cityInputEl.val = '';
    } else {
        alert('Please enter a city');
    }
}

// on click of search button get user input for city and fetch api data
userFormEL.on('submit', submitCitySearch);