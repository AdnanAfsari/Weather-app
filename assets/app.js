window.addEventListener('load', () => {
  let lat;
  let long;
  let key = '8b9fb0f997204e2487c49916e25f3c18';
  let city;
  const cityRegEx = /(?<city>\w+)/;

  const loc = document.querySelector('#location');
  const container = document.getElementById('container');
  const weatherDescription = document.querySelector('.weather-description');
  const tempType = document.querySelector('.temp-type');
  const weatherLocation = document.querySelector('.weather-location');
  const weatherType = document.querySelector('.temp');
  const tempSection = document.querySelector('.temp-section');
  const tempSectionSpan = document.querySelector('.temp-section span');

  container.classList.remove("rainyday", "cloudyday", "clearday")

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

      lat = position.coords.latitude;
      long = position.coords.longitude;

      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}`;

      fetch(api, {mode: 'cors'})
          .then(response => {
            return response.json();
          })
          .then(data => {
            const {temp, humidity} = data.main;
            const {main, description} = data.weather[0];
            const name = data.name;

            updateUI(description, temp, name, main);
          });

    });


  };


  document.querySelector('#search-form').addEventListener('submit', function(e)
    {
      e.preventDefault();
      container.classList.remove("rainyday", "cloudyday", "clearday")
      const location = document.querySelector('#location').value;
      loc.textContent = `${location}`

      // Extracting city and country out of string
      if (location.length > 0) {
        city = location.match(cityRegEx).groups.city;

        // Clearing the input field after submit
        document.querySelector('#location').value = '';


        // Generate api url with city and country name
        const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`

        // Fetching data via the api
        fetch(api, {mode: 'cors'})
          .then(response => {
            return response.json();
          })
          .then(data => {
            console.log(data);
            const {temp, humidity} = data.main;
            const {main, description} = data.weather[0];
            const name = data.name;

            updateUI(description, temp, name, main);

          })
          .catch(e => {
            console.log(e);
          })

      } else {
        alert("Please input city, country");
      }

    });


  function updateUI(description, temp, name, main) {
    const celsius = Math.round(temp - 273.15);
    const fahrenheit = Math.round((temp - 273.15) * 9/5 + 32);

    weatherDescription.textContent = description;
    weatherLocation.textContent = name;
    weatherType.textContent = main;
    tempType.textContent = `${celsius}`;


    tempSection.addEventListener('click', () => {
      if (tempSectionSpan.textContent === "°C"){
        tempSectionSpan.textContent = "°F"
        tempType.textContent = `${fahrenheit}`
      }else {
        tempSectionSpan.textContent = "°C"
        tempType.textContent = `${celsius}`;
      }
    });

    //Changing the background gif based on the weather conditions
    if (description.includes("rain")) {
      container.classList.add("rainyday")
    } else if (description.includes("cloud")) {
      container.classList.add("cloudyday")
    } else {
      container.classList.add("clearday");
    }

  }

});
