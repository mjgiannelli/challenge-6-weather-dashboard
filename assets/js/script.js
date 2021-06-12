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

// ** END PSEUDO CODE ** //

// START GLOBAL VARIABLES //
var openWeatherApiKey = '26ba3a7e283acb9cd1e8665c6c3b319a';
var openWeatherCoordinatesUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='
var userFormEL = $('#city-search');
var cityInputEl = $('#city');
var currentWeatherEl = $('#current-weather');
var currentDay = moment().format('M/DD/YYYY');


// END GLOBAL VARIABLES //

//function to get weather data from apiUrl
function getWeather(city) {
    // apiUrl for coordinates
    var apiCoordinatesUrl = openWeatherCoordinatesUrl + city + '&appid=' + openWeatherApiKey;
    // fetch the coordinates for parameter city
    fetch(apiCoordinatesUrl)
        .then(function (coordinateResponse) {
            if (coordinateResponse.ok) {
                coordinateResponse.json().then(function (data) {
                    var cityLatitude = data.coord.lat;
                    var cityLongitude = data.coord.lon;
                    // fetch weather information
                    var apiOneCallUrl = oneCallUrl + cityLatitude + '&lon=' + cityLongitude + '&appid=' + openWeatherApiKey + '&units=imperial';

                    fetch(apiOneCallUrl)
                        .then(function (weatherResponse) {
                            if (weatherResponse.ok) {
                                weatherResponse.json().then(function (weatherData) {
                                    console.log(weatherData);
                                    console.log(weatherData.current.weather[0].icon)
                                    // store the city that was searched in local storage
                                    localStorage.setItem(city, city);

                                    // create current day weather display
                                    // create h2 to display city + current day + current weather icon
                                    var currentWeatherHeadingEl = $('<h2>')
                                        .text(city + ' (' + currentDay + ') ' + weatherData.current.weather[0].icon);

                                    //append current weather heading to current weather div
                                    currentWeatherEl.append(currentWeatherHeadingEl);


                                })
                            }
                        })
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
        getWeather(city);
        cityInputEl.text = '';
    } else {
        alert('Please enter a city');
    }
}

// on click of search button get user input for city and fetch api data
userFormEL.on('submit', submitCitySearch);