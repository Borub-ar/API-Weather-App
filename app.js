'use strict';

// ///////////////////////////////////////////////////Weather request 
const searchBtn = document.querySelector('.search_button');
const searchCity = document.querySelector('#search');

searchBtn.addEventListener('click', async () => {
    menuAnimation();
    const cityInf = await currentWeather();
    // const bgPhoto = await bgImage();

    await sevenDayForecast();
    
    const hForecast = await hourlyForecast();
    makeHourlyIcons(hForecast);
    cardsAnimation();
    
    searchCity.value = '';

    const mainTemp = document.querySelector('.current_temp');
    const cityName = document.querySelector('.main_city_name');
    const currIcon = document.querySelector('.current_weather_icon');
    const descr = document.querySelector('.weather_descr');
    const sunrise = document.querySelector('.sunrise_span');
    const sunset = document.querySelector('.sunset_span');
    // const cityPhoto = document.querySelector('.city_photo');

    mainTemp.innerText = cityInf.temp;
    cityName.innerText = cityInf.city_name;
    currIcon.src = `https://www.weatherbit.io/static/img/icons/${cityInf.weather.icon}.png`;
    descr.innerText = cityInf.weather.description;
    sunrise.innerText = cityInf.sunrise;
    sunset.innerText = cityInf.sunset;
    // cityPhoto.style.backgroundImage = `url(${bgPhoto})`;
});

// /////////////////////////////Bottom menu unfolding animation
const menuAnimation = () => {
    if (searchCity.value) {
        const searchBar = document.querySelector('.search');
        const menu = document.querySelector('.bottom_menu');

        menu.style.transform = 'scale(1, 1)';
        searchBar.style.borderRadius = '0 0 0 0';
    };
};

// /////////////////////////Seven days forecast cards animation
const days = document.querySelectorAll('.day');

const cardsAnimation = () => {
    for (let i = 0; i < days.length; i++) {
        setTimeout(() => {
            days[i].style.transform = 'scale(1)';
        }, i * 300)
    };
};

// /////////////////Current weather in searched city - function 
const currentWeather = async () => {
    try {
        const config = {
            params: {
                city: searchCity.value,
                key: '4c1299c9ae164edd8cb6e247728e94af'
            }
        };

        const res = await axios.get('http://api.weatherbit.io/v2.0/current', config);
        const resData = res.data.data[0];
        return resData
    } catch (err) {
        console.log(err);
    };
};

// /////////////////Current city background image - function
// const bgImage = async () => {
//     try {
//         const config = {
//             params: {
//                 client_id: 'hpthTi3lgM1vdtMHcfvAiW-hFUjaLHYCSAtG4y-Er-I',
//                 query: searchCity.value,
//                 per_page: 1
//             }
//         };

//         const res = await axios.get('https://api.unsplash.com/search/photos', config);
//         const resData = res.data.results[0].urls.full;
//         return resData
//     } catch (err) {
//         console.log(err)
//     };
// };


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
    const dayInfo = await sevenDaysWeth();

    for (let [index, day] of days.entries()) {
        day.children[0].innerText = dayInfo[index + 1].datetime.substr(5).replace('-', '.');
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
        return res.data.data
    } catch (e) {
        console.log(e);
    };
};


const makeHourlyIcons = (dataAPI) => {
    for (const hour of dataAPI) {

        const weatherCard = document.createElement('div');
        weatherCard.classList.add('weather_card');
        hourForecastPanel.append(weatherCard);

        const datetime = document.createElement('p');
        datetime.innerText = `${hour.datetime.substr(11)}:00`;

        const weatherIcon = document.createElement('img');
        weatherIcon.src = `https://www.weatherbit.io/static/img/icons/${hour.weather.icon}.png`;

        const weatherTemp = document.createElement('p');
        weatherTemp.classList.add('icon_temp');
        weatherTemp.innerText = hour.temp;

        weatherCard.append(datetime, weatherIcon, weatherTemp);
    };
};

// ///////////////////////////////////////////Toggle forecast type
const sevenDaysBtn = document.querySelector('.seven_days');
const hourlyBtn = document.querySelector('.hours');
const sevenDaysPanel = document.querySelector('.right');
const hourForecastPanel = document.querySelector('.hourly_forecast');

sevenDaysBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(0)';
    hourForecastPanel.style.transform = 'translate(0, 100%)';
});

hourlyBtn.addEventListener('click', () => {
    sevenDaysPanel.style.transform = 'translate(0, 400%)';
    hourForecastPanel.style.transform = 'translate(0)';
});