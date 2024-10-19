// URL base para la API Open-Meteo
const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

// Coordenadas de DisneyWorld como ubicación por defecto
const DEFAULT_LOCATION = {
    city: 'DisneyWorld, Orlando',
    lat: 28.3852,
    lon: -81.5639
};

// Función para obtener el clima actual y la previsión
async function getWeatherData(lat, lon) {
    try {
        const weatherUrl = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=America/New_York`;
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error('Error en la respuesta de la API');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del clima:', error);
        alert('No se pudo obtener el clima, por favor intenta nuevamente.');
    }
}

// Función para obtener el nombre de la ciudad a partir de coordenadas
async function getCityName(lat, lon) {
    try {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
        const response = await fetch(geoUrl);
        if (!response.ok) throw new Error('Error al obtener la ciudad');
        const data = await response.json();
        
        // Extraer solo la ciudad y el país
        const city = data.address.city || data.address.town || data.address.village || 'Ubicación desconocida';
        const country = data.address.country || 'Desconocido';

        return `${city}, ${country}`; // Devuelve solo la ciudad y el país
    } catch (error) {
        console.error('Error al obtener el nombre de la ciudad:', error);
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

    // Mostrar clima actual
    cityElement.innerHTML = `<a href="https://www.google.com/maps/@?api=1&map_action=map&center=${currentWeather.latitude},${currentWeather.longitude}&zoom=10" target="_blank">Ubicación: ${cityName}</a>`;
    tempElement.textContent = `Temperatura: ${currentWeather.temperature}°C`;
    conditionElement.textContent = `Viento: ${currentWeather.windspeed} km/h`;

    // Mostrar icono del clima actual
    weatherIcon.style.display = 'block';
    weatherIcon.src = getWeatherIcon(currentWeather.weathercode);

    // Limpiar previsiones anteriores
    const forecastList = document.getElementById('forecastList');
    forecastList.innerHTML = '';

    // Mostrar previsión de los próximos días
    if (data.daily) {
        data.daily.time.forEach((dateString, index) => {
            const date = new Date(dateString); // Convierte la cadena de fecha en un objeto Date
            const options = { weekday: 'long' }; // Opciones para mostrar el día de la semana
            const dayName = date.toLocaleDateString('es-ES', options); // Obtiene el nombre del día en español

            const li = document.createElement('li');
            const maxTemp = data.daily.temperature_2m_max[index];
            const minTemp = data.daily.temperature_2m_min[index];
            const weatherCode = data.daily.weathercode[index];

            // Crear el elemento de imagen para el ícono del clima
            const icon = document.createElement('img');
            icon.src = getWeatherIcon(weatherCode);
            icon.alt = 'Weather Icon';
            icon.classList.add('weather-icon');

            // Agregar el ícono al <li>
            li.appendChild(icon);

            // Agregar la información del día, max y min como párrafos
            li.innerHTML += `
                <p>${dayName}</p> <!-- Muestra solo el día -->
                <p>Max: ${maxTemp}°C</p>
                <p>Min: ${minTemp}°C</p>
            `;

            // Asignar la clase correspondiente según el código del clima
            li.classList.add(getWeatherClass(weatherCode));

            // Agregar el <li> a la lista de pronóstico
            forecastList.appendChild(li);
        });
    }
}

// Función para obtener la clase de clima basado en el código
function getWeatherClass(weatherCode) {
    const classMap = {
        0: 'weather-clear',             // Despejado
        1: 'weather-few-clouds',        // Algunas nubes
        2: 'weather-partly-cloudy',     // Parcialmente nublado
        3: 'weather-overcast',          // Nublado total
        45: 'weather-fog',              // Niebla ligera
        48: 'weather-fog',              // Niebla densa
        51: 'weather-rain',             // Llovizna ligera
        53: 'weather-rain',             // Llovizna moderada
        55: 'weather-rain',             // Llovizna fuerte
        61: 'weather-rain',             // Lluvia ligera
        63: 'weather-rain',             // Lluvia moderada
        65: 'weather-rain',             // Lluvia fuerte
        80: 'weather-rain',             // Chubascos ligeros
        81: 'weather-rain',             // Chubascos moderados
        82: 'weather-rain',             // Chubascos fuertes
        95: 'weather-thunderstorm',     // Tormenta ligera
        96: 'weather-thunderstorm',     // Tormenta
        99: 'weather-thunderstorm',     // Tormenta severa
    };
    return classMap[weatherCode] || 'weather-unknown'; // Devuelve 'weather-unknown' si no hay coincidencia
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
                console.log('No se pudo obtener la ubicación, usando ubicación por defecto');
                loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.city);
            }
        );
    } else {
        console.log('Geolocalización no soportada, usando ubicación por defecto');
        loadWeather(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon, DEFAULT_LOCATION.city);
    }
}

// Función para cargar el clima basado en coordenadas
async function loadWeatherByCoords(lat, lon) {
    try {
        const cityName = await getCityName(lat, lon);
        const weatherData = await getWeatherData(lat, lon);
        if (weatherData) {
            renderWeather(weatherData, cityName);
        } else {
            alert('No se pudo obtener los datos del clima.');
        }
    } catch (error) {
        console.error('Error al cargar el clima:', error);
        alert('No se pudo obtener el clima para la ubicación actual.');
    }
}

// Función para cargar el clima por ciudad con coordenadas predeterminadas
async function loadWeather(lat, lon, city) {
    try {
        const weatherData = await getWeatherData(lat, lon);
        if (weatherData) {
            renderWeather(weatherData, city);
        } else {
            alert('No se pudo obtener los datos del clima.');
        }
    } catch (error) {
        console.error('Error al cargar el clima por ciudad:', error);
        alert('No se pudo obtener el clima para la ciudad ingresada.');
    }
}

// Función para manejar la búsqueda de ciudades
async function handleSearchCity() {
    const cityInput = document.getElementById('cityInput').value.trim();

    if (!cityInput) {
        alert('Por favor, ingresa una ciudad válida.');
        return;
    }

    try {
        const geoData = await getCityCoordinates(cityInput);
        if (geoData) {
            loadWeather(geoData.lat, geoData.lon, geoData.city);
        } else {
            alert('Ciudad no encontrada');
        }
    } catch (error) {
        console.error('Error al buscar la ciudad:', error);
        alert('No se pudo obtener el clima para la ciudad ingresada.');
    }
}

// Función para manejar el autocompletado de ciudades
const cityInput = document.getElementById('cityInput');
const autocompleteList = document.getElementById('autocomplete-list');

// Lista de ciudades para autocompletar (puedes cambiarla o cargarla desde una API)
const cities = [
    "Buenos Aires", "Córdoba", "La Plata", "Mendoza", "Rosario",
    "Salta", "San Juan", "Tucumán", "Neuquén", "Río Cuarto",
    "Bahía Blanca", "San Miguel de Tucumán"
];

// Escuchar el evento input
cityInput.addEventListener('input', function() {
    const value = this.value;

    // Limpiar la lista de autocompletado
    autocompleteList.innerHTML = '';

    if (!value) {
        return; // Si no hay valor, no mostrar nada
    }

    // Filtrar las ciudades que coinciden con el valor ingresado
    const filteredCities = cities.filter(city => city.toLowerCase().includes(value.toLowerCase()));

    // Crear elementos de autocompletado
    filteredCities.forEach(city => {
        const div = document.createElement('div');
        div.textContent = city;
        div.addEventListener('click', function() {
            cityInput.value = city; // Completar el input con la ciudad seleccionada
            autocompleteList.innerHTML = ''; // Limpiar la lista
        });
        autocompleteList.appendChild(div); // Agregar la ciudad a la lista
    });
});

// Función de inicialización del clima
export function initWeather() {
    getUserLocation();
    const searchButton = document.getElementById('searchWeatherBtn');
    searchButton.addEventListener('click', handleSearchCity);
    cityInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            handleSearchCity();
        }
    });
}


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