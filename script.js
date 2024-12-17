const apiKey = '821c86bd23ea4dac8a4135443241712';
const apiBaseUrl = 'http://api.weatherapi.com/v1/forecast.json';

// Function to dynamically change the background color based on the time of the day
const updateBackground = (hour) => {
    let backgroundColor = (hour >= 6 && hour < 18) ? '#ffecb3' : '#4a6e77'; // Day and night colors
    document.body.style.backgroundColor = backgroundColor;
};

// Fetch Weather Data
const fetchWeatherData = async (city) => {
    try {
        const response = await fetch(`${apiBaseUrl}?key=${apiKey}&q=${city}&days=7&aqi=no&alerts=no`);
        const data = await response.json();

        // Check if the city is found
        if (response.ok) {
            displayWeatherData(data);
        } else {
            document.getElementById('error-message').innerText = 'City not found. Please try again!';
        }
    } catch (error) {
        document.getElementById('error-message').innerText = 'Error fetching weather data. Please try again!';
    }
};

// Display Weather Data
const displayWeatherData = (data) => {
    const cityElement = document.getElementById('city');
    const temperatureElement = document.getElementById('temperature');
    const cloudsElement = document.getElementById('clouds');
    const imgElement = document.getElementById('img');
    const weekForecastElement = document.querySelector('.weekF');

    const city = `${data.location.name}, ${data.location.country}`;
    const temperature = `${Math.round(data.current.temp_c)}°C`;
    const clouds = data.current.condition.text;
    const iconUrl = `http:${data.current.condition.icon}`;

    cityElement.innerText = city;
    temperatureElement.innerText = temperature;
    cloudsElement.innerText = clouds;
    imgElement.src = iconUrl;

    // Update background color based on the time of day in the searched city
    updateBackground(new Date().getHours());

    // Display 7-day forecast
    weekForecastElement.innerHTML = '';
    data.forecast.forecastday.forEach((day) => {
        const date = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        const temp = `${Math.round(day.day.maxtemp_c)}° / ${Math.round(day.day.mintemp_c)}°`;
        const description = day.day.condition.text;
        const icon = `http:${day.day.condition.icon}`;

        weekForecastElement.innerHTML += `
            <div class="classF">
                <p class="date">${date}</p>
                <img src="${icon}" alt="${description}">
                <p>${temp}</p>
                <p class="desc">${description}</p>
            </div>
        `;
    });

    document.getElementById('error-message').innerText = '';
};

// Load Weather Data on Page Load
window.addEventListener('load', () => {
    fetchWeatherData('Delhi');
});

// Event listener for the search button to fetch weather details
const searchButton = document.getElementById('search');
const cityInput = document.getElementById('input');
const errorMessage = document.getElementById('error-message');

searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        errorMessage.innerText = 'Please enter a city name!';
    }
});

// Event listener for the Home link to reload the weather data
document.getElementById('home-link').addEventListener('click', (event) => {
    event.preventDefault();
    fetchWeatherData('Delhi');
});

// Back-to-Top Button
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
