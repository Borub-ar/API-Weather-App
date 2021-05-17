'use strict';

// Global variables 
const currentDate = document.querySelector('.date');

const sevenDaysPanel = document.querySelector('.seven_days_container');
const days = document.querySelectorAll('.day');
const hourForecastPanel = document.querySelector('.hourly_forecast');
const menu = document.querySelector('.bottom_menu');

const searchCity = document.querySelector('#search_input');
const searchBtn = document.querySelector('.search_button');

const sevenDaysBtn = document.querySelector('.seven_days_switch');
const hourlyBtn = document.querySelector('.hours_switch');
const slideBtns = document.querySelectorAll('.slide_btn')

const blurLayer = document.querySelector('.blur_layer')
const slidesPanel = document.querySelector('.slides_panel');
const slides = document.querySelectorAll('.single_slide');
const slideBtnsBox = document.querySelector('.slide_buttons');

const errorMessage = document.querySelector('.error_message');





// Set current date
const date = new Date();
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
currentDate.textContent = today.toLocaleDateString();




// Bottom menu unfolding animation
const menuAnimation = () => {
    const searchBar = document.querySelector('.search_bar');

    menu.style.transform = 'scale(1)';
    searchBar.style.borderRadius = '0';
}



// Seven days forecast 
const updateSingleDayInfo = (apiData) => {
    const ulDayInfo = document.querySelectorAll('.single_slide_informations');

    for (const [index, day] of ulDayInfo.entries()) {
        day.children[0].textContent = apiData[index + 1].datetime.substr(5).replace('-', '.');
        day.children[1].children[0].src = `https://www.weatherbit.io/static/img/icons/${apiData[index + 1].weather.icon}.png`;
        day.children[2].textContent = apiData[index + 1].weather.description;
        day.children[3].textContent = `${apiData[index + 1].temp} ºC`;
        day.children[4].children[0].textContent = apiData[index + 1].clouds;
        day.children[5].children[0].textContent = apiData[index + 1].vis;
        day.children[6].children[0].textContent = apiData[index + 1].wind_cdir_full;
        day.children[7].children[0].textContent = apiData[index + 1].wind_spd;
        day.children[8].children[0].textContent = apiData[index + 1].pres;
        day.children[9].children[0].textContent = apiData[index + 1].low_temp;
        day.children[10].children[0].textContent = apiData[index + 1].high_temp;
        day.children[11].children[0].textContent = apiData[index + 1].snow_depth;
    }
}



const sevenDayForecast = async () => {
    const dayInfo = await getSevenDaysWeather();
    updateSingleDayInfo(dayInfo)

    for (const [index, day] of days.entries()) {
        const dateTimeData = dayInfo[index + 1].datetime.substr(5).replace('-', '.')
        const dateTime = dateTimeData.startsWith(0) ? dateTimeData.substr(1) : dateTimeData

        day.children[0].textContent = dateTime;
        day.children[1].src = `https://www.weatherbit.io/static/img/icons/${dayInfo[index + 1].weather.icon}.png`;
        day.children[2].children[0].textContent = dayInfo[index + 1].temp;
    }
}



// Seven days forecast cards animation
const cardsAnimation = () => {
    for (let i = 0; i < days.length; i++) {
        setTimeout(() => {
            days[i].style.transform = 'scale(1)';
        }, i * 300);
    }
}



// Hourly forecast in searched city
const makeHourlyIcons = dataAPI => {
    for (const hour of dataAPI) {
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather_card');
        hourForecastPanel.append(weatherCard);

        const datetime = document.createElement('p');
        datetime.textContent = `${hour.datetime.substr(11)}:00`;

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${hour.weather.icon}.png`;

        const weatherTemp = document.createElement('p');
        weatherTemp.classList.add('day_temp');
        weatherTemp.textContent = `${hour.temp} ºC`;

        weatherCard.append(datetime, weatherIcon, weatherTemp);
    }
}



// Making slides 
const slideIn = (APICityPhoto, APICityInfo) => {
    const container = document.querySelector('.image_container');

    const cityImage = document.createElement('div');
    cityImage.style.backgroundImage = `url(${APICityPhoto})`;
    cityImage.classList.add('city_photo', 'slide_right');

    // Left side
    const leftPanel = document.createElement('div');
    leftPanel.classList.add('city_info');

    const temp = document.createElement('p');
    temp.classList.add('temp');
    temp.textContent = `${APICityInfo.temp} ºC`;

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('current_weather_icon');
    weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${APICityInfo.weather.icon}.png`;

    const weatherDescr = document.createElement('p');
    weatherDescr.classList.add('weather_descr');
    weatherDescr.textContent = APICityInfo.weather.description;

    const conFlex = document.createElement('div');
    conFlex.classList.add('d_flex');

    const sunRise = document.createElement('p');
    sunRise.classList.add('sunrise');
    sunRise.textContent = `Sunrise: ${APICityInfo.sunrise}`;

    const sunSet = document.createElement('p');
    sunSet.classList.add('sunset');
    sunSet.textContent = `Sunset: ${APICityInfo.sunset}`;

    conFlex.append(sunRise, sunSet);

    leftPanel.append(temp, weatherIcon, weatherDescr, conFlex);

    // Right side 
    const rightPanel = document.createElement('div');
    rightPanel.classList.add('city_name');

    const name = document.createElement('p');
    name.classList.add('ct_name');
    name.textContent = APICityInfo.city_name;
    rightPanel.append(name);

    // Append both sides to cityImage
    cityImage.append(leftPanel, rightPanel);

    container.append(cityImage);
    cityImage.classList.add('slide_in');
};

const slideOut = () => {
    const slides = document.querySelectorAll('.city_photo');
    for (const slide of slides) slide.classList.add('slide_out');
}



const hideErrorMessage = () => {
        errorMessage.style.transform = 'translate(-50%, 100%)';
        errorMessage.style.opacity = '0';
}



// Weather request 

        
const makeRequest = async () => {
    if (searchCity.value) {
        const cityInf = await getCurrentWeather();

        if (cityInf) {

            hideErrorMessage();

            menu.style.display = 'flex';
            menuAnimation();
    
            const backgroundPhoto = await getBgImage();
            const hForecast = await getHourlyForecast();
            await sevenDayForecast();
    
            hourForecastPanel.innerHTML = '';
            makeHourlyIcons(hForecast);
    
            cardsAnimation();
    
            sevenDaysBtn.style.transform = `scale(1)`;
            hourlyBtn.style.transform = `scale(1)`;
    
            slideOut();
            slideIn(backgroundPhoto, cityInf);
        }

        searchCity.value = '';
    }
}

window.addEventListener('keydown', e => {
    e.code === 'Enter' && makeRequest();
})

searchBtn.addEventListener('click', () => {
    makeRequest();
})



// Toggle forecast type
sevenDaysBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%)';
    hourForecastPanel.style.transform = 'translate(0, 100%)';
})

hourlyBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%, 400%)';
    hourForecastPanel.style.transform = 'translate(0)';
})




















