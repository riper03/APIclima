const inputContenido = document.querySelector('.ciudad-texto');
const btnBuscar = document.querySelector('.btn-buscar');
const noEncontrado = document.querySelector('.not-found');
const ciudadEncontrada = document.querySelector('.buscar-ciudad-mensaje');
const climaInfo = document.querySelector('.info-clima');
const textoPais = document.querySelector('.texto-pais');
const textoTemperatura = document.querySelector('.temperatura-text');
const textoCondicion = document.querySelector('.condicion-text');
const textoHumedad = document.querySelector('.humedad-valor');
const textoViento = document.querySelector('.viento-valor');
const imgClimas = document.querySelector('.resumen-clima-img');
const fechaTexto = document.querySelector('.fecha-texto');
const tiempoItems = document.querySelector('.tiempo-items-contenedor');
const apikey = 'e0ceda4e10427d9f579c5e8562e70f4b';

btnBuscar.addEventListener('click', () => {
    if (inputContenido.value.trim() != '') {
        updateClimaInfo(inputContenido.value);
        inputContenido.value = '';
        inputContenido.blur();
    }
});

inputContenido.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && inputContenido.value.trim() != '') {
        updateClimaInfo(inputContenido.value);
        inputContenido.value = '';
        inputContenido.blur();
    }
});

async function getFetchData(endPoint, ciudad) {
    const url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${ciudad}&appid=${apikey}&units=metric&lang=es-ES`;
    const response = await fetch(url);
    return response.json();
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzley.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id <= 800) return 'clear.svg';
    else return 'clouds.svg';
}

function getBackgroundImage(id) {
    if (id <= 232) return 'tormenta.gif'; 
    if (id <= 321) return 'chispeando.gif';
    if (id <= 531) return 'lluvia.gif'; 
    if (id <= 622) return 'newando.gif';
    if (id <= 781) return 'niebla.gif'; 
    if (id <= 800) return 'soleado.gif';
    if (id > 800) return 'nublado.gif';     return null; 
}

function GetCurrentDate() {
    const fecha = new Date();
    const options = { weekday: 'short', month: 'short', day: '2-digit' };
    return fecha.toLocaleDateString('es-ES', options);
}

const traduccionesClima = {
    'Clear': 'Despejado',
    'Clouds': 'Nublado',
    'Rain': 'Lluvia',
    'Thunderstorm': 'Tormenta',
    'Snow': 'Nieve',
    'Mist': 'Neblina',
    'Fog': 'Niebla',
    'Drizzle': 'Llovizna',
    'Haze': 'Bruma',
    'Smoke': 'Humo',
    'Dust': 'Polvo',
    'Sand': 'Arena',
    'Ash': 'Ceniza',
    'Squall': 'Chubasco',
    'Tornado': 'Tornado'
};

async function updateClimaInfo(ciudad) {
    const DatosClima = await getFetchData('weather', ciudad);
    if (DatosClima.cod != 200) {
        showDisplaySection(noEncontrado);
        return;
    }
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = DatosClima;
    fechaTexto.textContent = GetCurrentDate();
    textoPais.textContent = country;
    textoTemperatura.textContent = Math.round(temp) + '°C';
    textoCondicion.textContent = traduccionesClima[main] || main; 
    textoHumedad.textContent = humidity + '%';
    textoViento.textContent = speed + 'km/h';
    imgClimas.src = `/img/${getWeatherIcon(id)}`;

    // fondo 
    const backgroundImage = getBackgroundImage(id);
    const body = document.body;
    if (backgroundImage) {
        body.style.backgroundImage = `url('/img/${backgroundImage}')`;
    } else {
        body.style.backgroundImage = 'url("img/clima.gif")'; 
    }
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';

    await updateSigClimas(ciudad);
    showDisplaySection(climaInfo);
}
async function updateSigClimas(ciudad) {
    const sigsclimas = await getFetchData('forecast', ciudad);
    const timeTaken = '12:00:00';
    const fechasNuevas = new Date().toISOString().split('T')[0]; 
    tiempoItems.innerHTML = '';

    sigsclimas.list.forEach(clima => {
        if (clima.dt_txt.includes(timeTaken) &&
            !clima.dt_txt.includes(fechasNuevas)) {
            updateClimasItems(clima);
        }
    });
}


function updateClimasItems(clima) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = clima; 

    const dateTaken = new Date(date);
    const dateOptions = {
        day: '2-digit',
        month: 'short'
    };
    const resultadosDias = dateTaken.toLocaleDateString('es-ES', dateOptions);
    const climaItems = `<div class="clima-item">
                    <h5 class="clima-item-fecha regular-text">${resultadosDias}</h5>
                    <img src="img/${getWeatherIcon(id)}" class="clima-item-imagen">
                    <h5 class="clima-item-temperatura">${Math.round(temp)} °C</h5>
                </div>`;

    tiempoItems.insertAdjacentHTML('beforeend', climaItems);
}

function showDisplaySection(section) {
    [climaInfo, ciudadEncontrada, noEncontrado]
        .forEach(section => section.style.display = 'none');
    section.style.display = 'flex';
}