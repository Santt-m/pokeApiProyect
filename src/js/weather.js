// URL base para la API Open-Meteo
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Coordenadas de DisneyWorld como ubicación por defecto
const DEFAULT_LOCATION = {
    city: 'DisneyWorld, Orlando',
    lat: 28.3852,
    lon: -81.5639
};

// Función para aplicar el efecto de carga a los componentes
function showComponentLoading() {
    const cityElement = document.getElementById('currentCity');
    const tempElement = document.getElementById('currentTemp');
    const conditionElement = document.getElementById('currentCondition');
    const forecastList = document.getElementById('forecastList');

    // Aplicar clase de carga (skeleton) a los componentes
    cityElement.classList.add('skeleton');
    tempElement.classList.add('skeleton');
    conditionElement.classList.add('skeleton');
    forecastList.classList.add('skeleton');
}

// Función para quitar el efecto de carga a los componentes
function hideComponentLoading() {
    const cityElement = document.getElementById('currentCity');
    const tempElement = document.getElementById('currentTemp');
    const conditionElement = document.getElementById('currentCondition');
    const forecastList = document.getElementById('forecastList');

    // Remover clase de carga (skeleton) de los componentes
    cityElement.classList.remove('skeleton');
    tempElement.classList.remove('skeleton');
    conditionElement.classList.remove('skeleton');
    forecastList.classList.remove('skeleton');
}

// Función para obtener el clima actual y la previsión
async function getWeatherData(lat, lon) {
    try {
        const weatherUrl = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America/New_York`;
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        const data = await response.json();
        return data;
    } catch (error) {
        Modal.showError('Error al obtener los datos del clima: ' + error.message);
    }
}

// Función para obtener el nombre de la ciudad a partir de coordenadas
async function getCityName(lat, lon) {
    try {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        const response = await fetch(geoUrl);
        if (!response.ok) throw new Error('Error al obtener la ciudad');
        const data = await response.json();

        const city = data.address.city || data.address.town || data.address.village || 'Ubicación desconocida';
        const country = data.address.country || 'Desconocido';

        return `${city}, ${country}`;
    } catch (error) {
        Modal.showError('Error al obtener el nombre de la ciudad: ' + error.message);
        return 'Ubicación desconocida';
    }
}

// Función para renderizar el clima en la UI
function renderWeather(data, cityName) {
    const cityElement = document.getElementById('currentCity');
    const tempElement = document.getElementById('currentTemp');
    const conditionElement = document.getElementById('currentCondition');
    const weatherIcon = document.getElementById('weatherIcon');
    const currentWeather = data.current_weather;

    // Rellenar los datos del clima
    cityElement.innerHTML = `<a href="https://www.google.com/maps/@?api=1&map_action=map&center=${currentWeather.latitude},${currentWeather.longitude}&zoom=10" target="_blank">Ubicación: ${cityName}</a>`;
    tempElement.textContent = `Temperatura: ${currentWeather.temperature}°C`;
    conditionElement.textContent = `Viento: ${currentWeather.windspeed} km/h`;

    weatherIcon.style.display = 'block';
    weatherIcon.src = getWeatherIcon(currentWeather.weathercode);

    const forecastList = document.getElementById('forecastList');
    forecastList.innerHTML = '';

    if (data.daily) {
        data.daily.time.forEach((dateString, index) => {
            const date = new Date(dateString);
            const options = { weekday: 'long' };
            const dayName = date.toLocaleDateString('es-ES', options);

            const li = document.createElement('li');
            const maxTemp = data.daily.temperature_2m_max[index];
            const minTemp = data.daily.temperature_2m_min[index];
            const weatherCode = data.daily.weathercode[index];

            const icon = document.createElement('img');
            icon.src = getWeatherIcon(weatherCode);
            icon.alt = 'Weather Icon';
            icon.classList.add('weather-icon');

            li.appendChild(icon);
            li.innerHTML += `
                <p>${dayName}</p>
                <p>Max: ${maxTemp}°C</p>
                <p>Min: ${minTemp}°C</p>
            `;

            li.classList.add(getWeatherClass(weatherCode));
            forecastList.appendChild(li);
        });
    }
}

// Función para obtener la clase de clima basado en el código
function getWeatherClass(weatherCode) {
    const classMap = {
        0: 'weather-clear',
        1: 'weather-few-clouds',
        2: 'weather-partly-cloudy',
        3: 'weather-overcast',
        45: 'weather-fog',
        48: 'weather-fog',
        51: 'weather-rain',
        53: 'weather-rain',
        55: 'weather-rain',
        61: 'weather-rain',
        63: 'weather-rain',
        65: 'weather-rain',
        80: 'weather-rain',
        81: 'weather-rain',
        82: 'weather-rain',
        95: 'weather-thunderstorm',
        96: 'weather-thunderstorm',
        99: 'weather-thunderstorm',
    };
    return classMap[weatherCode] || 'weather-unknown';
}

// Función para obtener la ubicación actual del usuario
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                loadWeatherByCoords(latitude, longitude);
            },
            () => {
                Modal.showError('No se pudo obtener la ubicación, usando ubicación por defecto');
                loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.city);
            }
        );
    } else {
        Modal.showError('Geolocalización no soportada, usando ubicación por defecto');
        loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.city);
    }
}

// Función para cargar el clima basado en coordenadas
async function loadWeatherByCoords(lat, lon) {
    try {
        // Mostrar efecto de carga en los componentes
        showComponentLoading();

        const cityName = await getCityName(lat, lon);
        const weatherData = await getWeatherData(lat, lon);

        // Ocultar el efecto de carga después de cargar los datos
        hideComponentLoading();

        if (weatherData) {
            renderWeather(weatherData, cityName);
        } else {
            Modal.showError('No se pudo obtener los datos del clima.');
        }
    } catch (error) {
        // Ocultar el efecto de carga incluso si ocurre un error
        hideComponentLoading();
        Modal.showError('Error al cargar el clima: ' + error.message);
    }
}

// Función para manejar el autocompletado de ciudades utilizando la API de OpenStreetMap (sin API keys)
const cityInput = document.getElementById('cityInput');

cityInput.addEventListener('input', async function () {
    const value = this.value;

    // Usar datalist en vez de una lista externa
    const dataList = document.getElementById('autocomplete-list');
    dataList.innerHTML = '';  // Limpiar el datalist de autocompletado

    if (!value) return;

    try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${value}&format=json&limit=5`;
        const response = await fetch(geoUrl);
        const cities = await response.json();

        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.display_name;  // Mostrar el nombre completo de la ciudad
            option.addEventListener('click', function () {
                cityInput.value = city.display_name;
                loadWeather(city.lat, city.lon, city.display_name); // Cargar el clima para la ciudad seleccionada
            });
            dataList.appendChild(option);
        });
    } catch (error) {
        Modal.showError('Error al autocompletar ciudades: ' + error.message);
    }
});

// Función de inicialización del clima
export function initWeather() {
    getUserLocation();
    cityInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            handleSearchCity();
        }
    });
}

// Función para obtener los íconos del clima
function getWeatherIcon(weatherCode) {
    const iconMap = {
        0: 'clear_sky.png',
        1: 'few_clouds.png',
        2: 'partly_cloudy.png',
        3: 'overcast.png',
        45: 'light_fog.png',
        48: 'dense_fog.png',
        51: 'light_drizzle.png',
        53: 'moderate_drizzle.png',
        55: 'heavy_drizzle.png',
        61: 'light_rain.png',
        63: 'moderate_rain.png',
        65: 'heavy_rain.png',
        80: 'light_rain_showers.png',
        81: 'moderate_rain_showers.png',
        82: 'heavy_rain_showers.png',
        95: 'light_thunderstorm.png',
        96: 'thunderstorm.png',
        99: 'severe_thunderstorm.png'
    };
    return `./src/icons/${iconMap[weatherCode] || 'weatherUnknown.png'}`;
}
