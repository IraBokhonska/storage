"use strict";

const weatherBlock = document.querySelector("#weather");

async function loadWeather(e) {
  if (!shouldFetchWeather()) {
    const weatherData = JSON.parse(localStorage.getItem("weatherData"));

    getWeather(weatherData);

    return;
  }

  weatherBlock.innerHTML = `
    <div class="weather__loading">
      <img src="https://i.gifer.com/ZKZx.gif"  alt="loading"/>
    </div>`;

  const appId = "0781c26b9439dc52e5209de26ef15c55";
  const city = "Kyiv";

  const server = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${appId}`;

  const response = await fetch(server, {
    method: "GET",
  });

  const responseResult = await response.json();

  if (response.ok) {
    getWeather(responseResult);
    localStorage.setItem("weatherData", JSON.stringify(responseResult));
    localStorage.setItem("lastFetchTime", new Date().getTime());
  } else {
    weatherBlock.innerHTML = responseResult.message;
  }
}

if (weatherBlock) {
  loadWeather();
}

// Погода з'являється через кожні 2 години

function shouldFetchWeather() {
  const lastFetchTime = localStorage.getItem("lastFetchTime");
  if (!lastFetchTime) {
    return true;
  }
  const currentTime = new Date().getTime();
  const twoHours = 2 * 60 * 60 * 1000; // 2 години у мілісекундах
  // console.log(currentTime - lastFetchTime);
  return currentTime - lastFetchTime > twoHours;
}

function getWeather(data) {
  const location = data.name;
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const weatherStatus = data.weather[0].main;
  const weatherIcon = data.weather[0].icon;

  const template = `
  <div class="weather__header">
    <div class="weather__city">${location}</div>
  </div>
  <div class="weahter__main">
    <div class="weather__block">
      <div class="weather__status">${weatherStatus}</div>
      <div class="weather__icon">
        <img src="https://openweathermap.org/img/w/${weatherIcon}.png" alt="img" />
      </div>
    </div>
    <div class="weather__temp">${temp}</div>
    <div class="weather__feel-like">Feels like: ${feelsLike}</div>
  </div>`;

  weatherBlock.innerHTML = template;
}
