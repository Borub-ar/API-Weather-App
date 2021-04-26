'use strict';

// //////////////////////////////////////////////////////////Aside toggle menu 
const toggleBtn = document.querySelector('.toggle_btn');
``
toggleBtn.addEventListener('click', () => {
    const asideNav = document.querySelector('.aside_nav');
    asideNav.classList.toggle('aside_show');
});

// /////////////////////////////////////////////////// Current weather request 
const searchBtn = document.querySelector('.search_button');
const searchCity = document.querySelector('#search');

searchBtn.addEventListener('click', async () => {
    const cityInf = await currentWeather();
    const bgPhoto = await bgImage();
    await sevenDayForecast();
    const hForecast = await hourlyForecast();
    makeHourlyIcons(hForecast);

    searchCity.value = '';

    const mainTemp = document.querySelector('.current_temp');
    const cityName = document.querySelector('.main_city_name');
    const currIcon = document.querySelector('.current_weather_icon');
    const descr = document.querySelector('.weather_descr');
    const sunrise = document.querySelector('.sunrise_span');
    const sunset = document.querySelector('.sunset_span');
    const cityPhoto = document.querySelector('.city_photo');


    mainTemp.innerText = cityInf.temp;
    cityName.innerText = cityInf.city_name;
    currIcon.src = `https://www.weatherbit.io/static/img/icons/${cityInf.weather.icon}.png`;
    descr.innerText = cityInf.weather.description;
    sunrise.innerText = cityInf.sunrise;
    sunset.innerText = cityInf.sunset;
    cityPhoto.style.backgroundImage = `url(${bgPhoto})`;
});

// //////////////Current weather in searched city - function 
const currentWeather = async () => {
    try {
        const config = {
            params: {
                city: searchCity.value,
                key: '4c1299c9ae164edd8cb6e247728e94af'
            }
        };

        const res = await axios.get('http://api.weatherbit.io/v2.0/current', config);
        const resData = res.data.data[0]
        return resData
    } catch (err) {
        console.log(err);
    };
};

// /////////////////Current city background image - function
const bgImage = async () => {
    try {
        const config = {
            params: {
                client_id: 'hpthTi3lgM1vdtMHcfvAiW-hFUjaLHYCSAtG4y-Er-I',
                query: searchCity.value,
                per_page: 1
            }
        };

        const res = await axios.get('https://api.unsplash.com/search/photos', config);
        const resData = res.data.results[0].urls.full;
        return resData
    } catch (err) {
        console.log(err)
    };
};


// ///////////////Seven days forecast 
const sevenDaysWeth = async () => {
    try {
        const config = {
            params: {
                key: '4c1299c9ae164edd8cb6e247728e94af',
                days: 8,
                city: searchCity.value
            }
        };

        const res = await axios.get('http://api.weatherbit.io/v2.0/forecast/daily', config);
        return res.data.data
    } catch (e) {
        console.log(e);
    };
};


const sevenDayForecast = async () => {
    const days = document.querySelectorAll('.day');
    const dayInfo = await sevenDaysWeth();

    for (let [index, day] of days.entries()) {
        day.children[0].innerText = dayInfo[index + 1].datetime.substr(5).replace('-', '.')
        day.children[1].src = `https://www.weatherbit.io/static/img/icons/${dayInfo[index + 1].weather.icon}.png`;
        day.children[2].children[0].innerText = dayInfo[index + 1].temp;
    };
};

// //////////////////////////Hourly forecast in searched city - function
const hourlyForecast = async () => {
    try {
        const config = {
            params: {
                key: '4c1299c9ae164edd8cb6e247728e94af',
                city: searchCity.value,
                hours: 12
            }
        };
        
        const res = await axios.get('https://api.weatherbit.io/v2.0/forecast/hourly', config);
        console.log(res.data.data);
        return res.data.data
    } catch(e) {
        console.log(e);
    };
};

const makeHourlyIcons = (dataAPI) => {
    const forecastPanel = document.querySelector('.hourly_forecast')

    for (const hour of dataAPI) {
        // const weatherIcon = dataAPI.weather.icon;
        // const weatherDescr = dataAPI.weather.description;
        // const time = dataApi.datetime;

        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather_card');
        forecastPanel.append(weatherCard);

        const datetime = document.createElement('p')
        datetime.innerText = hour.datetime;
        weatherCard.append(datetime)
    };
};