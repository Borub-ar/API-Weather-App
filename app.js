'use strict';

// Global variables 
const sevenDaysPanel = document.querySelector('.seven_container');
const days = document.querySelectorAll('.day');
const hourForecastPanel = document.querySelector('.hourly_forecast');
const currentDate = document.querySelector('.date');
const sevenDaysBtn = document.querySelector('.seven_days');
const hourlyBtn = document.querySelector('.hours');
const menu = document.querySelector('.bottom_menu');

const blurLayer = document.querySelector('.blur_layer')
const dayInfoPanel = document.querySelector('.day_info_panel');
const singleDayPanel = document.querySelectorAll('.s_day');
const slideBtnsCon = document.querySelector('.slide_buttons');
const slideBtns = document.querySelectorAll('.btn')
const dayArray = document.querySelectorAll('.s_day');

// Set current date
const date = new Date();
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
currentDate.textContent = today.toLocaleDateString();

// Bottom menu unfolding animation
const menuAnimation = () => {
    const searchBar = document.querySelector('.search');

    menu.style.transform = 'scale(1, 1)';
    searchBar.style.borderRadius = '0 0 0 0';
}

// Seven days forecast 
const sevenDaysWeth = async () => {
    try {
        const config = {
            params: {
                key: '4c1299c9ae164edd8cb6e247728e94af',
                days: 8,
                city: searchCity.value
            }
        }

        const apiURL = 'https://api.weatherbit.io/v2.0/forecast/daily';
        const res = await axios.get(apiURL, config);
        return res.data.data;

    } catch (e) {
        console.log(e);
    }
}


const sevenDayForecast = async () => {
    const dayInfo = await sevenDaysWeth();

    for (let [index, day] of days.entries()) {
        day.children[0].textContent = dayInfo[index + 1].datetime.substr(5).replace('-', '.');
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

// Current weather in searched city - function 
const getCurrentWeather = async () => {
    try {
        const config = {
            params: {
                city: searchCity.value,
                key: '4c1299c9ae164edd8cb6e247728e94af'
            }
        }
        const apiURL = 'https://api.weatherbit.io/v2.0/current';
        const res = await axios.get(apiURL, config);
        const resData = res.data.data[0];
        return resData;

    } catch (err) {
        console.log(err);
    }
}

// Current city background image - function
const getBgImage = async () => {
    try {
        const config = {
            params: {
                client_id: 'hpthTi3lgM1vdtMHcfvAiW-hFUjaLHYCSAtG4y-Er-I',
                query: searchCity.value,
                per_page: 1
            }
        }
        const apiURL = 'https://api.unsplash.com/search/photos';
        const res = await axios.get(apiURL, config);
        const resData = res.data.results[0].urls.regular;

        return resData;
    } catch {
        const rand = Math.floor(Math.random() * 5) + 1;
        return `img/rand0${rand}.jpg`;
    }
}

// Hourly forecast in searched city - function
const getHourlyForecast = async () => {
    try {
        const config = {
            params: {
                key: '4c1299c9ae164edd8cb6e247728e94af',
                city: searchCity.value,
                hours: 12
            }
        }
        const apiURL = 'https://api.weatherbit.io/v2.0/forecast/hourly';
        const res = await axios.get(apiURL, config);
        return res.data.data;

    } catch (e) {
        console.log(e);
    }
}

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
        weatherTemp.classList.add('icon_temp');
        weatherTemp.textContent = `${hour.temp} ºC`;

        weatherCard.append(datetime, weatherIcon, weatherTemp);
    }
}

// Making slides incoming sldies
const slideIn = (varImage, varInfo) => {
    const container = document.querySelector('.image_container');

    const cityImage = document.createElement('div');
    cityImage.style.backgroundImage = `url(${varImage})`;
    cityImage.classList.add('city_photo', 'slide_right');

    // Left panel
    const leftPanel = document.createElement('div');
    leftPanel.classList.add('city_info');

    const temp = document.createElement('p');
    temp.classList.add('temp');
    temp.textContent = `${varInfo.temp} ºC`;

    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('current_weather_icon');
    weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${varInfo.weather.icon}.png`;

    const weatherDescr = document.createElement('p');
    weatherDescr.classList.add('weather_descr');
    weatherDescr.textContent = varInfo.weather.description;

    const conFlex = document.createElement('div');
    conFlex.classList.add('d_flex');

    const sunRise = document.createElement('p');
    sunRise.classList.add('sunrise');
    sunRise.textContent = `Sunrise: ${varInfo.sunrise}`;

    const sunSet = document.createElement('p');
    sunSet.classList.add('sunset');
    sunSet.textContent = `Sunset: ${varInfo.sunset}`;

    conFlex.append(sunRise, sunSet);

    leftPanel.append(temp, weatherIcon, weatherDescr, conFlex);

    // Right panel 
    const rightPanel = document.createElement('div');
    rightPanel.classList.add('city_name');

    const name = document.createElement('p');
    name.classList.add('ct_name');
    name.textContent = varInfo.city_name;
    rightPanel.append(name);

    // Append both panels to cityImage
    cityImage.append(leftPanel, rightPanel);

    container.append(cityImage);
    cityImage.classList.add('slide_in');
};

const slideOut = () => {
    const slides = document.querySelectorAll('.city_photo');

    for (const slide of slides) {
        slide.classList.add('slide_out');
    }
}

// Weather request 
const searchBtn = document.querySelector('.search_button');
const searchCity = document.querySelector('#search');

window.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
        makeRequest();
    }
})

searchBtn.addEventListener('click', () => {
    makeRequest();
})

const makeRequest = async () => {
    if (search.value) {
        menu.style.display = 'flex';
        menuAnimation();

        const backgroundPhoto = await getBgImage();
        const cityInf = await getCurrentWeather();
        const hForecast = await getHourlyForecast();

        await sevenDayForecast();

        hourForecastPanel.innerHTML = '';
        makeHourlyIcons(hForecast);

        cardsAnimation();

        sevenDaysBtn.style.transform = `scale(1)`;
        hourlyBtn.style.transform = `scale(1)`;

        slideOut();
        slideIn(backgroundPhoto, cityInf);

        searchCity.value = '';
    }
}

// Toggle forecast type
sevenDaysBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%)';
    hourForecastPanel.style.transform = 'translate(0, 100%)';
})

hourlyBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(-50%, 400%)';
    hourForecastPanel.style.transform = 'translate(0)';
})

// Show / hide - single day information panel
const showPanel = () => {
    blurLayer.style.display = 'block';
    blurLayer.style.backgroundColor = 'rgba(0, 0, 0, 0.342)';
    dayInfoPanel.style.width = '100%';
    slideBtnsCon.style.display = 'flex';

    for (const singleDay of singleDayPanel) {
        singleDay.classList.add('single_day');
    }
}

const hidePanel = () => {
    dayInfoPanel.style.width = '0';
    blurLayer.style.backgroundColor = 'none';
    blurLayer.style.display = 'none';
    slideBtnsCon.style.display = 'none';

    for (const singleDay of singleDayPanel) {
        singleDay.classList.remove('single_day');
    }
}

for (const day of days) {
    day.addEventListener('click', showPanel)
}

blurLayer.addEventListener('click', hidePanel);
window.addEventListener('keydown', e => {
    if (e.code === 'Escape') {
        hidePanel();
    }
})

// Single day slide animation
for (const [index, day] of dayArray.entries()) {
    day.style.left = `${index * 100}%`;
}

for (const [index, btn] of slideBtns.entries()) {
    btn.addEventListener('click', () => {
        for (const day of singleDayPanel) {
            day.style.transform = `translate(-${index * 100}%)`;
        }
    })
}