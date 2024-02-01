
const dataContainer = document.getElementById('data-container');
let weatherInfo = document.getElementById('weatherinfo');

function givePermission() {
    navigator.geolocation.getCurrentPosition(
        (posistion) => {
            const { latitude, longitude } = posistion.coords;
            getDataByCode(latitude, longitude)

            console.log(latitude);
            console.log(longitude);
            console.log(posistion);
        },
        (error) => {
            weatherInfo.innerHTML = `<h1 style="color:red";>Please allow location </h1>`;
        },
    );
}


async function weatherInfoByNames(e) {
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;


    const url = `http://localhost:3001/weather/by-names?city=${city}&country=${country}`;

    const data = await fetch(url);
    const result = await data.json();


    weatherInfo.innerHTML = ""
    dataContainer.innerHTML = '';

    if (result.isError) {
        return (weatherInfo.innerHTML = `<h1 style="color:red";>${result.message}</h1>`);
    }
    setWeatherData(result.data.list);
}

function setWeatherData(weatherInfo) {
    weatherInfo.map((city) => {
        let weatherDetails = {
            name: city.name,
            country: city.sys.country,
            description: city.weather[0].description,
            image: city.weather[0].icon,
            temprature: city.main.temp,
            humidity: city.main.humidity,
            latitude: city.coord.lat,
            longitude: city.coord.lon,
            windspeed: city.wind.speed,
            wndDegree: city.wind.deg,
        };
        setHtmlData(weatherDetails);
    });

}

function setHtmlData(weatherDetails) {
    const cityDiv = document.createElement('div');
    cityDiv.innerHTML = `
              <h2>Weather Details Of ${weatherDetails.name}</h2>
              <p>Name: ${weatherDetails.name}</p>
              <p>Country: ${weatherDetails.country}</p>
              <image src=' https://openweathermap.org/img/wn/${weatherDetails.image}@2x.png'></image>
              <p>Description: ${weatherDetails.description}</p>
              <p>Temprature: ${weatherDetails.temprature}</p>
              <p>Humidity: ${weatherDetails.humidity}%</p>
              <p>Latitude: ${weatherDetails.latitude}</p>
              <p>Longitude: ${weatherDetails.longitude} kph</p>
              <p>WindSpeed ${weatherDetails.windspeed}</p>
              `;
    let x = weatherInfo.appendChild(cityDiv);

}
/////////////////


async function forecast() {
    const lat = document.getElementById('latitude').value;
    const long = document.getElementById('longitude').value;
    const date = document.getElementById('date').value;

    getDataByCode(lat, long, date)
    console.log("u", lat, long, date);
}

async function getDataByCode(lat, long, date) {
    const url = `http://localhost:3001/weather/forecast?latitude=${lat}&longitude=${long}&date=${date}`;

    const data = await fetch(url);
    const result = await data.json();


    weatherInfo.innerHTML = ""
    dataContainer.innerHTML = '';

    if (result.isError) {
        return (dataContainer.innerHTML = `<h1 style="color:red";>${result.message} </h1>`);
    }

    setData(result, date)
    console.log("main", result);
}



function setData(result, date) {
    if (!date) {
        console.log("i am urva");
    }
    console.log('p', date);
    if (!date) {
        dataContainer.innerHTML = `
            <h2>Weather Details Of ${result.data.location.name}</h2>
            <p>Name: ${result.data.location.name}</p>
            <p>Country: ${result.data.location.country}</p>
            <p>Region: ${result.data.location.region}</p>
            <p>Condition: ${result.data.current.condition.text}</p>
            <image src='${result.data.current.condition.icon}'></image>
            <p>Time: ${result.data.location.localtime}</p>
            <p>Temprature in C: ${result.data.current.temp_c}</p>
            <p>Temprature in F: ${result.data.current.temp_f}</p>
            <p>WindSpeed ${result.data.current.wind_kph}KPH</p>
            <p>Humidity: ${result.data.current.humidity}%</p>
            <p>Visibility: ${result.data.current.vis_km}%Km</p>
            <p>Last updated: ${result.data.current.last_updated}</p>
            <p>Latitude: ${result.data.location.lat}</p>
            <p>Longitude: ${result.data.location.lon} kph</p>
            `;;

    } else {
        if (result.data.forecast.forecastday.length <= 0) {
            return (dataContainer.innerHTML = `<h1 style="color:red";>Forecast data available of only next 14 Days</h1>`);
        }

        result.data.forecast.forecastday.map((singleDay) => {
            dataContainer.innerHTML = `
                <h2>Weather Details Of ${result.data.location.name} at Date:${singleDay.date}</h2>
                <p>Name: ${result.data.location.name}</p>
                <p>Country: ${result.data.location.country}</p>
                <p>Region: ${result.data.location.region}</p>
                <p>Condition: ${singleDay.day.condition.text}</p>
                <image src='${singleDay.day.condition.icon}'></image>
                <p>Average Temprature in F: ${singleDay.day.avgtemp_f}</p>
                <p>Average Temprature in C: ${singleDay.day.avgtemp_c}</p>
                <p>WindSpeed ${singleDay.day.maxwind_kph}KPH</p>
                <p>Visibility: ${singleDay.day.avgvis_km}%Km</p>
                <p>Humidity: ${singleDay.day.avghumidity}%</p>
                <p>Chance of rain: ${singleDay.day.daily_chance_of_rain}</p>
                <p>Chance of snow: ${singleDay.day.daily_chance_of_snow}</p>
                <p>Sunrise: ${singleDay.astro.sunrise}</p>
                <p>Sunset: ${singleDay.astro.sunset}%</p>
                <p>Moonrise: ${singleDay.astro.moonrise}</p>
                <p>Moonset: ${singleDay.astro.moonset}%</p>
            `;
        })

    }
}