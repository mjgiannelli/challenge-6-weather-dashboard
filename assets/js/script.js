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
var fiveDayEl = $('#five-day');
var searchHistoryEl = $('#search-history');
var currentDay = moment().format('M/DD/YYYY');
const weatherIconUrl = 'http://openweathermap.org/img/wn/';
var searchHistoryArray = [];

// END GLOBAL VARIABLES //

//funciton to create history buttons
function searchHistory(city) {
    var searchHistoryBtn = $('<button>')
        .addClass('btn')
        .text(city)
        .on('click', function () {
            $('#current-weather').empty();
            $('#five-day').empty();
            getWeather(city);
        })
        .attr({
            type: 'button',
            id: 'search-history-btn'
        });

    // append btn to search history div
    searchHistoryEl.append(searchHistoryBtn);
}

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

                                    // ** START CURRENT DAY DISPLAY ** //

                                    // get the weather icon from city
                                    var weatherIcon = weatherData.current.weather[0].icon;
                                    var cityCurrentWeatherIcon = weatherIconUrl + weatherIcon + '.png';

                                    // create h2 to display city + current day + current weather icon
                                    var currentWeatherHeadingEl = $('<h2>')
                                        .text(city + ' (' + currentDay + ')');
                                    // create img element to display icon
                                    var iconImgEl = $('<img>')
                                        .attr({
                                            id: 'current-weather-icon',
                                            src: cityCurrentWeatherIcon,
                                            alt: 'Weather Icon'
                                        })
                                    //create list of current weather details
                                    var currWeatherListEl = $('<ul>')

                                    var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]

                                    for (var i = 0; i < currWeatherDetails.length; i++) {
                                        //create an indiviual list item and append to ul


                                        if (currWeatherDetails[i] === 'UV Index: ' + weatherData.current.uvi) {

                                            var currWeatherListItem = $('<li>')
                                                .text('UV Index: ')

                                            currWeatherListEl.append(currWeatherListItem);

                                            var uviItem = $('<span>')
                                                .text(weatherData.current.uvi);

                                            if (uviItem.text() <= 2) {
                                                uviItem.addClass('favorable');
                                            } else if (uviItem.text() > 2 && uviItem.text() <= 7) {
                                                uviItem.addClass('moderate');
                                            } else {
                                                uviItem.addClass('severe');
                                            }

                                            currWeatherListItem.append(uviItem);

                                        } else {
                                            var currWeatherListItem = $('<li>')
                                                .text(currWeatherDetails[i])
                                            //append to ul
                                            currWeatherListEl.append(currWeatherListItem);
                                        }

                                    }

                                    //append current weather heading to current weather div
                                    currentWeatherEl.append(currentWeatherHeadingEl);
                                    //append icon to current weather header
                                    currentWeatherHeadingEl.append(iconImgEl);
                                    //append ul to current weather
                                    currentWeatherEl.append(currWeatherListEl);

                                    // ** END CURRENT DAY DISPLAY ** //

                                    // ** START 5-DAY FORECAST DISPLAY ** //

                                    // create array for the dates for the next 5 days

                                    var fiveDayArray = [];

                                    for (var i = 0; i < 5; i++) {
                                        let forecastDate = moment().add(i + 1, 'days').format('M/DD/YYYY');

                                        fiveDayArray.push(forecastDate);
                                    }

                                    // for each date in the array create a card displaying temp, wind and humidity
                                    for (var i = 0; i < fiveDayArray.length; i++) {
                                        // create a div for each card
                                        var cardDivEl = $('<div>')
                                            .addClass('col3');

                                        // create div for the card body
                                        var cardBodyDivEl = $('<div>')
                                            .addClass('card-body');

                                        // create the card-title
                                        var cardTitleEl = $('<h3>')
                                            .addClass('card-title')
                                            .text(fiveDayArray[i]);

                                        // create the icon for current day weather
                                        var forecastIcon = weatherData.daily[i].weather[0].icon;

                                        var forecastIconEl = $('<img>')
                                            .attr({
                                                src: weatherIconUrl + forecastIcon + '.png',
                                                alt: 'Weather Icon'
                                            });

                                        // create card text displaying weather details
                                        var currWeatherDetails = ['Temp: ' + weatherData.current.temp + ' °F', 'Wind: ' + weatherData.current.wind_speed + ' MPH', 'Humidity: ' + weatherData.current.humidity + '%', 'UV Index: ' + weatherData.current.uvi]
                                        //create temp
                                        var tempEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Temp: ' + weatherData.daily[i].temp.max)
                                        //create wind
                                        var windEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Wind: ' + weatherData.daily[i].wind_speed + ' MPH')
                                        // create humidity
                                        var humidityEL = $('<p>')
                                            .addClass('card-text')
                                            .text('Humidity: ' + weatherData.daily[i].humidity + '%')

                                        //append cardDivEl to the #five-day container
                                        fiveDayEl.append(cardDivEl);
                                        //append cardBodyDivEL to cardDivEl
                                        cardDivEl.append(cardBodyDivEl);
                                        //append card title to card body
                                        cardBodyDivEl.append(cardTitleEl);
                                        //append icon to card body
                                        cardBodyDivEl.append(forecastIconEl);
                                        //append temp details to card body
                                        cardBodyDivEl.append(tempEL);
                                        //append wind details to card body
                                        cardBodyDivEl.append(windEL);
                                        //append humidity details to card body
                                        cardBodyDivEl.append(humidityEL);
                                    }
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
    if (searchHistoryArray.includes(city)) {
        alert(city + ' is included in history below. Click the ' + city + ' button to get weather.')
    } else if (city) {
        getWeather(city);
        searchHistory(city);
        searchHistoryArray.push(city);
        console.log('Array: ' + searchHistoryArray);
        cityInputEl.val('');
    } else {
        alert('Please enter a city');
    }
}

// on submission of user data get user input for city and fetch api data
userFormEL.on('submit', submitCitySearch);

// on click of search button - empty the current weather and 5-day forecast info
$('#search-btn').on('click', function () {
    $('#current-weather').empty();
    $('#five-day').empty();
})