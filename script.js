// Set a random Background image using the Unsplash API

fetch(
  "https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=mountains"
)
  .then((response) => response.json())
  .then((data) => {
    document.body.style.backgroundImage = `url('${data.urls.full}')`;
    document.getElementById("img-author").innerText = `By: ${
      data.user.name
    } \n Location: ${
      data.location.title != null ? data.location.title : "Unknown"
    } `;
  })

  // Fallback default image

  .catch((err) => {
    console.log(err, "Fetch error, default background image set");
    document.body.style.backgroundImage =
      "url(https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8)";
    document.getElementById("img-author").innerText = `By: Benjamin Voros `;
  });

// Get Ethereum Market data from the Coingecko API

fetch(
  "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&community_data=false"
)
  .then((res) => {
    if (!res.ok) {
      throw Error("Something went wrong");
    }
    return res.json();
  })

  .then((data) => {
    const cryptoDataEl = document.getElementById("crypto-data");
    cryptoDataEl.innerHTML = `
                            <div class="data">  
                            <h2>${data.name}</h2>
                            <h3>$${data.tickers[2].last}</h3>
                            <p>Last 24h: 
                            ${data.market_data.price_change_percentage_24h.toFixed(
                              0
                            )} % 
                            / 
                            $${data.market_data.price_change_24h_in_currency.usd.toFixed(
                              0
                            )}</p>
                            <p>24h H/L: $${data.market_data.high_24h.usd.toFixed(
                              0
                            )} / $${data.market_data.low_24h.usd.toFixed(0)}</p>
                            </div>
                            `;
    const newImg = document.createElement("img");
    newImg.src = `${data.image.small}`;
    newImg.classList.add("crypto-img");
    cryptoDataEl.prepend(newImg);
  })

  .catch((err) => {
    console.error(err);
    document.getElementById(
      "crypto-data"
    ).children[0].innerText = `Cannot access data at the moment. Check again later!`;
  });

// Get and display current date and time
function displayTime() {
  const today = new Date();
  const date = today.toLocaleDateString("de-de");
  const time = today.toLocaleTimeString("de-de", { timeStyle: "medium" });

  document.getElementById("time-container").innerHTML = `
    <h2 class="time">${time}</h2>      
    `;
  document.getElementById("date-el").innerText = `${date}`;
}

setInterval(displayTime, 1000);

// Get local weather data
navigator.geolocation.getCurrentPosition((position) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&&appid=e309d4a48634b7bc307c35e41fb7cf30`
  )
    .then((res) => {
      if (!res.ok) {
        throw Error("Weather data could not be found");
      }
      return res.json();
    })

    .then((data) => {
      const sunriseSeconds = data.sys.sunrise;
      const localSunrise = new Date(sunriseSeconds * 1000);
      const sunriseStr = localSunrise.toLocaleTimeString([], {
        timeStyle: "short",
      });

      const sunsetSeconds = data.sys.sunset;
      const localSunset = new Date(sunsetSeconds * 1000);
      const sunsetStr = localSunset.toLocaleTimeString([], {
        timeStyle: "short",
      });
      const weatherEl = document.getElementById("weather");

      weatherEl.innerHTML = `
        <img class="weather-img"src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
        }@2x.png">
        <div class="data">
        <h2>${data.name}</h2>
        <h3>${data.main.temp.toFixed(1)}°C / ${
        data.weather[0].description
      }</h3> 
        <p>Min ${data.main.temp_min.toFixed(
          1
        )}°C/ Max ${data.main.temp_max.toFixed(1)}°C</p>
        <p>&uarr; ${sunriseStr}  / &darr; ${sunsetStr}</p>
        </div>
        `;
    })

    .catch((err) => {
      document.getElementById("weather").innerHTML =
        "Current weather data could not be found";
      console.log(err);
    });
});
