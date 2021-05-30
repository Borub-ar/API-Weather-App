'use strict';

// Global variables 
const currentDate = document.querySelector('.date');
const searchCity = document.querySelector('#search_input');
const searchBtn = document.querySelector('.search_button');
const errorMessage = document.querySelector('.error_message');
const sevenDaysPanel = document.querySelector('.seven_days_container');
const days = document.querySelectorAll('.day');
const hourForecastPanel = document.querySelector('.hourly_forecast');
const menu = document.querySelector('.bottom_menu');
const sevenDaysBtn = document.querySelector('.seven_days_switch');
const hourlyBtn = document.querySelector('.hours_switch');

// Set current date
const date = new Date();
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
currentDate.textContent = today.toLocaleDateString();


// Bottom menu unfolding animation
const expandMenu = () => {
    const searchBar = document.querySelector('.search_bar');

    menu.style.display = 'flex';
    menu.style.transform = 'scale(1)';
    searchBar.style.borderRadius = '0';
}


const sevenDayForecast = async (APIData) => {
    for (const [index, day] of days.entries()) {
        const dateTimeData = APIData[index + 1].datetime.substr(5).replace('-', '.');
        const dateTime = dateTimeData.startsWith(0) ? dateTimeData.substr(1) : dateTimeData;

        day.children[0].textContent = dateTime;
        day.children[1].src = `https://www.weatherbit.io/static/img/icons/${APIData[index + 1].weather.icon}.png`;
        day.children[2].children[0].textContent = APIData[index + 1].temp;
    }
}


// Seven days forecast cards animation
const showSevenDaysIcon = () => {
    for (let i = 0; i < days.length; i++) {
        setTimeout(() => {
            days[i].style.transform = 'scale(1)';
        }, i * 300);
    }
}

// Hourly forecast in searched city
const makeHourlyIcons = dataAPI => {
    hourForecastPanel.innerHTML = '';

    for (const hour of dataAPI) {
        const html = `
        <div class="weather_card">
            <p>${hour.datetime.substr(11)}:00</p>
            <img src="https://www.weatherbit.io/static/img/icons/${hour.weather.icon}.png">
            <p class="day_temp">${hour.temp} ºC</p>
        </div>        
        `

        hourForecastPanel.insertAdjacentHTML('beforeend', html)
    }
}

// Making slides 
const makeSlide = (APICityPhoto, APICityInfo) => {
    const container = document.querySelector('.image_container');

    const html = `
    <div class="city_photo slide_right slide_in" style="background-image: url(${APICityPhoto})">
        <div class="city_info">
            <p class="temp">${APICityInfo.temp} ºC</p>
            <img class="current_weather_icon" src="https://www.weatherbit.io/static/img/icons/${APICityInfo.weather.icon}.png">
            <p class="weather_descr">${APICityInfo.weather.description}</p>
            <div class="d_flex">
                <p class="sunrise">Sunrise: ${APICityInfo.sunrise}</p>
                <p class="sunset">Sunrise: ${APICityInfo.sunset}</p>
            </div>
        </div>

        <div class="city_name">
            <p class="ct_name">${APICityInfo.city_name}</p>
        </div>
    </div>
    `;

    container.insertAdjacentHTML('beforeend', html)
};

const showButtons = () => {
    sevenDaysBtn.style.transform = `scale(1)`;
    hourlyBtn.style.transform = `scale(1)`;
}

const pushSlidesLeft = () => {
    const slides = document.querySelectorAll('.city_photo');
    for (const slide of slides) slide.classList.add('slide_out');
}

const showErrorMessage = () => {
    errorMessage.classList.remove('hide_error');
    errorMessage.classList.add('show_error');
} 

const hideErrorMessage = () => {
        errorMessage.classList.remove('show_error');
        errorMessage.classList.add('hide_error');
}

// Weather request 
const makeRequest = async () => {
    if (searchCity.value) {
        const currentWeather = await getCurrentWeather();

        if (currentWeather) {
            hideErrorMessage();
            expandMenu();
    
            const backgroundPhoto = await getBgImage();
            const hourlyForecast = await getHourlyForecast();
            const sevenForecast = await getSevenDaysWeather();
            
            sevenDayForecast(sevenForecast);
            updateDetaleInfo(sevenForecast);

            makeHourlyIcons(hourlyForecast);
    
            showSevenDaysIcon();
            showButtons();
    
            pushSlidesLeft();
            makeSlide(backgroundPhoto, currentWeather);
        }

        searchCity.value = '';
        searchCity.blur();
    }
}

window.addEventListener('keydown', e => {
    e.code === 'Enter' && makeRequest();
})

searchBtn.addEventListener('click', makeRequest);


// Toggle forecast type
sevenDaysBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%)';
    hourForecastPanel.style.transform = 'translate(0, 100%)';
})

hourlyBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%, 400%)';
    hourForecastPanel.style.transform = 'translate(0)';
})




















