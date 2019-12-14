$(document).ready(function () {
    var submit = document.querySelector("#submit");
    var search = document.querySelector("#search");
    var city = document.querySelector("#city");
    var currentDateDetail = document.querySelector("#details");

    var APIKey = "07b88f52d33ee902474646f18278e539";

    var savedCityString = localStorage.getItem('savedCity');
    savedCityJSON = JSON.parse(savedCityString) || [];

    if (savedCityJSON !== null) {
        for (var j = 0; j < savedCityJSON.length; j++) {
            var newBtn = $("<button>");
            newBtn.addClass("btn btn-light border city");
            newBtn.attr("id", savedCityJSON[j].cityName)
            newBtn.text(savedCityJSON[j].cityName);
            $(".citytab").append(newBtn);
        }
    }

    $(submit).click(citySearch);

    function citySearch(event) {
        event.preventDefault();
        var cityName = $(search).val().trim();

        var newBtn = $("<button>");
        newBtn.addClass("btn btn-light border city");
        newBtn.attr("id", cityName);
        newBtn.text(cityName);

        console.log(newBtn);

        $(".citytab").append(newBtn);

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var temp = $("#temp");
            var humi = $("#humi");
            var wind = $("#wind");
            var uv = $("#uv");
            var currentTime = response.dt

            var displayCurrentTime = moment.unix(currentTime).utc()

            $(city).text(cityName + " " + displayCurrentTime.format('DD/MM/YYYY'));

            currentDateDetail.style.display = "block";
            $(temp).text("Tempreture: " + response.main.temp + "°C");
            $(humi).text("Humidity: " + response.main.humidity + "%");
            $(wind).text("Wind Speed: " + response.wind.speed + " MPH");

            // add current date UV Index
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (responseText) {

                var uvIndex = responseText.value;

                var newDiv = $("<button>");
                $(uv).empty();

                if (uvIndex <= 2) {
                    $(newDiv).addClass("green")
                }
                else if (uvIndex <= 5) {
                    $(newDiv).addClass("yellow")
                }
                else if (uvIndex <= 7) {
                    $(newDiv).addClass("orange")
                }
                else if (uvIndex <= 10) {
                    $(newDiv).addClass("red")
                }
                else {
                    $(newDiv).addClass("purple")
                }
                $(uv).text("UV Index: ");
                $(newDiv).text(+ uvIndex);
                $(uv).append(newDiv);

            })


            console.log(response.weather[0].main);
            weather(response);
            var cityId = response.sys.country;

            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "," + cityId + "&units=metric&appid=" + APIKey;

            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (responseJSON) {
                $(".futureW").empty();
                for (var i = 0; i < 5; i++) {
                    var futureDate = responseJSON.list[i * 8].dt;

                    var date = moment.unix(futureDate).utc()

                    var tempFuture = responseJSON.list[i * 8].main.temp;
                    var humFuture = responseJSON.list[i * 8].main.humidity;
                    var icon = responseJSON.list[i * 8].weather[0].main;

                    //create 5 cards to show the forecast
                    var cardTxt = $("<p>");
                    $(cardTxt).addClass("card-text p-1");

                    var cardBody = $("<div>");
                    $(cardBody).addClass("card-body p-0");

                    var card = $("<div>");
                    $(card).addClass("card mt-3 days");

                    var col = $("<div>");
                    $(col).addClass("col-md-2 pr-0");

                    //add forecast into cards
                    var dateDisplay = $("<p>")
                    $(dateDisplay).text(date.format('DD/MM/YYYY'));
                    $(cardTxt).append(dateDisplay);

                    // weatherFuture(responseJSON);
                    var iconDisplay = $("<i>");
                    if (icon == "Clouds") {
                        $(iconDisplay).addClass("fas fa-cloud");
                    }
                    else if (icon == "Drizzle") {
                        $(iconDisplay).addClass("fas fa-cloud-rain")
                    }
                    else if (icon == "Snow") {
                        $(iconDisplay).addClass("fas fa-snowflake")
                    }
                    else if (icon == "Thunderstorm") {
                        $(iconDisplay).addClass("fas fa-bolt")
                    }
                    else if (icon == "Atmosphere") {
                        $(iconDisplay).addClass("fas fa-smog")
                    }
                    else if (icon == "Clear") {
                        $(iconDisplay).addClass("fas fa-sun")
                    }
                    else {
                        $(iconDisplay).addClass("fas fa-cloud-showers-heavy")
                    }
                    $(cardTxt).append(iconDisplay);

                    var tempDisplay = $("<p>");
                    $(tempDisplay).text("Temp: " + tempFuture + "°C");
                    $(cardTxt).append(tempDisplay);

                    var humDisplay = $("<p>");
                    $(humDisplay).text("Humidity: " + humFuture + "%");
                    $(cardTxt).append(humDisplay);


                    $(cardBody).append(cardTxt);
                    $(card).append(cardBody);
                    $(col).append(card);

                    $(".futureW").append(col);

                }
            })

            saveToLocal(cityName);
        })
    }


    // saved city button clicked
    $(".citytab").on("click", function savedCity() {
        event.preventDefault();

        var citySelect = event.target.id;

        if (event.target.matches("button")) {
            console.log(citySelect);
        }

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + citySelect + "&units=metric&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var temp = $("#temp");
            var humi = $("#humi");
            var wind = $("#wind");
            var uv = $("#uv");
            var currentTime = response.dt

            var displayCurrentTime = moment.unix(currentTime).utc()

            $(city).text(citySelect + " " + displayCurrentTime.format('DD/MM/YYYY'));

            currentDateDetail.style.display = "block";
            $(temp).text("Tempreture: " + response.main.temp + "°C");
            $(humi).text("Humidity: " + response.main.humidity + "%");
            $(wind).text("Wind Speed: " + response.wind.speed + " MPH");

            // add current date UV Index
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon;

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (responseText) {

                var uvIndex = responseText.value;

                var newDiv = $("<button>");
                $(uv).empty();

                if (uvIndex <= 2) {
                    $(newDiv).addClass("green")
                }
                else if (uvIndex <= 5) {
                    $(newDiv).addClass("yellow")
                }
                else if (uvIndex <= 7) {
                    $(newDiv).addClass("orange")
                }
                else if (uvIndex <= 10) {
                    $(newDiv).addClass("red")
                }
                else {
                    $(newDiv).addClass("purple")
                }
                $(uv).text("UV Index: ");
                $(newDiv).text(+ uvIndex);
                $(uv).append(newDiv);

            })

            console.log(response.weather[0].main);
            weather(response);
            var cityId = response.sys.country;

            var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + citySelect + "," + cityId + "&units=metric&appid=" + APIKey;

            $.ajax({
                url: forecastURL,
                method: "GET"
            }).then(function (responseJSON) {
                $(".futureW").empty();
                for (var i = 0; i < 5; i++) {
                    var futureDate = responseJSON.list[i * 8].dt;

                    var date = moment.unix(futureDate).utc()

                    var tempFuture = responseJSON.list[i * 8].main.temp;
                    var humFuture = responseJSON.list[i * 8].main.humidity;
                    var icon = responseJSON.list[i * 8].weather[0].main;

                    //create 5 cards to show the forecast
                    var cardTxt = $("<p>");
                    $(cardTxt).addClass("card-text p-1");

                    var cardBody = $("<div>");
                    $(cardBody).addClass("card-body p-0");

                    var card = $("<div>");
                    $(card).addClass("card mt-3 days");

                    var col = $("<div>");
                    $(col).addClass("col-md-2 pr-0");

                    //add forecast into cards
                    var dateDisplay = $("<p>")
                    $(dateDisplay).text(date.format('DD/MM/YYYY'));
                    $(cardTxt).append(dateDisplay);

                    // weatherFuture(responseJSON);
                    var iconDisplay = $("<i>");
                    if (icon == "Clouds") {
                        $(iconDisplay).addClass("fas fa-cloud");
                    }
                    else if (icon == "Drizzle") {
                        $(iconDisplay).addClass("fas fa-cloud-rain")
                    }
                    else if (icon == "Snow") {
                        $(iconDisplay).addClass("fas fa-snowflake")
                    }
                    else if (icon == "Thunderstorm") {
                        $(iconDisplay).addClass("fas fa-bolt")
                    }
                    else if (icon == "Atmosphere") {
                        $(iconDisplay).addClass("fas fa-smog")
                    }
                    else if (icon == "Clear") {
                        $(iconDisplay).addClass("fas fa-sun")
                    }
                    else {
                        $(iconDisplay).addClass("fas fa-cloud-showers-heavy")
                    }
                    $(cardTxt).append(iconDisplay);

                    var tempDisplay = $("<p>");
                    $(tempDisplay).text("Temp: " + tempFuture + "°C");
                    $(cardTxt).append(tempDisplay);

                    var humDisplay = $("<p>");
                    $(humDisplay).text("Humidity: " + humFuture + "%");
                    $(cardTxt).append(humDisplay);


                    $(cardBody).append(cardTxt);
                    $(card).append(cardBody);
                    $(col).append(card);

                    $(".futureW").append(col);
                }
            })
        })
    })

    function saveToLocal(a) {
        console.log(a);

        var savedCityString = localStorage.getItem('savedCity');
        savedCityJSON = JSON.parse(savedCityString) || [];

        var cities = {
            'cityName': a
        }

        savedCityJSON.push(cities);
        localStorage.setItem('savedCity', JSON.stringify(savedCityJSON));
    }

    //icon in current date
    function weather(response) {
        var weatherType = response.weather[0].main;
        var newIcon = $("<i>");
        if (weatherType == "Clouds") {
            $(newIcon).addClass("fas fa-cloud");
        }
        else if (weatherType == "Drizzle") {
            $(newIcon).addClass("fas fa-cloud-rain")
        }
        else if (weatherType == "Snow") {
            $(newIcon).addClass("fas fa-snowflake")
        }
        else if (weatherType == "Thunderstorm") {
            $(newIcon).addClass("fas fa-bolt")
        }
        else if (weatherType == "Atmosphere") {
            $(newIcon).addClass("fas fa-smog")
        }
        else if (weatherType == "Clear") {
            $(newIcon).addClass("fas fa-sun")
        }
        else {
            $(newIcon).addClass("fas fa-cloud-showers-heavy")
        } $(city).append(newIcon);

    }
})
